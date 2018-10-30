/**
 * Created by apple04 on 15/8/13.
 */
$(function(){
   render();

   function events(){
       $("#subBonus").bind("click",function(){
           alertify.confirm("是否确定提交？", function(state) {
               if(state) {
                   var array = [];
                   var id,award;
                   $("#example tbody tr").each(function(i){
                       id = $(this).children("td").eq(0).html();
                       award = $(this).children("td").eq(2).children("input").val()*10000;
                       array.push({id:id,award:award});
                   });
                   light.doput("/performance/keepCompanyBonus", {array: array}, function(err, result) {

                       //给人事发消息
                       light.doput("/performance/set_message", {msg_type:"gs_rs",content:"总奖金分配完毕",pid:""},function(err, result){
                           if(result.result === true) {
                               alertify.success("消息提醒发送成功！");
                               window.location = "/site/bonusDistribution?name=绩效考核";
                           }else {
                               alert.error("消息提醒失败！");
                               window.location = "/site/bonusDistribution?name=绩效考核";
                           }
                       });
                       light.doget("/performance/subCompanyBonus", function(err, result) {
                           getCompanyBonusStatus();
                       });
                   });
                   alertify.success("提交成功！");
               }else {
                   alertify.log("已取消提交！");
               }
           });
       });
       $("#keepBonus").bind("click",function(){
           alertify.confirm("是否确定提交？", function(state) {
               if(state) {
                   var array = [];
                   var id,award;
                   $("#example tbody tr").each(function(i){
                       id = $(this).children("td").eq(0).html();
                       award = $(this).children("td").eq(2).children("input").val()*10000;
                       array.push({id:id,award:award});
                   });
                   light.doput("/performance/keepCompanyBonus", {array: array}, function(err, result) {
                       getCompanyBonusStatus();
                   });
                   alertify.success("提交成功！");
               }else {
                   alertify.log("已取消提交！");
               }
           });
       });
       $("#example").bind("change", function(){
           bonusCount();
       });
   }

    function render(){
        light.doget("/performance/getNowTime", function(err, result) {
            if(result[0].OPERATIONSTATUS==="10"){
                light.doget("/performance/getOperationTimeByRow_sort", {row_sort:"2"}, function(err, result) {
                    var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
                    if((cre_time<nowTime)&&(nowTime<end_time)){
                        var groupId = $("#hid-user-groups").val();
                        orgId = $("#hid-user").val();
                        light.doget("/group/get", {id:groupId}, function(err, result) {
                            if (result.name === '公司组' || result.name === '人事组') {
                                events();
                                getCompanyBonusStatus();
                            }else{
                                alert("您没有权限进行该操作");
                            }
                        });
                    }else{
                        alert("当前时间不可操作");
                    }
                });
            }else{
                alert("考评未开始");
            }
        });
    }

    function getCompanyBonusStatus(){
        light.doget("/performance/getCompanyBonusStatus", function(err, result){
            var companyBonusStatus = result[0].COMPANY_BONUS_STATUS;
            if(companyBonusStatus==="1"){
                showTable(companyBonusStatus);
                $("#subBonus").attr("disabled", true);
                $("#keepBonus").attr("disabled", true);
                $(".sub-true").css("display","inline");
                $(".sub-false").css("display","none");
            }else{
                showTable(companyBonusStatus);
                $("#subBonus").attr("disabled", false);
                $("#keepBonus").attr("disabled", false);
                $(".sub-false").css("display","inline");
                $(".sub-true").css("display","none");
            }
        });
    }

    function showTable(companyBonusStatus){
        $('#example').dataTable( {
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": false,//搜索栏
            "bSort": false,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "bDestroy": true,
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
            "sAjaxSource": "/performance/getCompanyBonus",
            "fnInitComplete": function(oSettings, json) {
                bonusCount();
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                    },
                    "success": function(json) {
                        var resultData = json.data;
                        var totalItems = json.data.length;
                        for(var i=0;i<json.data.length;i++){
                            if(json.data[i].TB===0){
                                json.data[i].TB = "--";
                            }else if(json.data[i].TB===null){
                                json.data[i].TB = "--";
                            }else{
                                json.data[i].TB = (json.data[i].AWARD/json.data[i].TB);
                            }
                            if(json.data[i].HB===0){
                                json.data[i].HB = "--";
                            }else if(json.data[i].HB===null){
                                json.data[i].HB = "--";
                            }else{
                                json.data[i].HB = (json.data[i].AWARD/json.data[i].HB);
                            }
                            json.data[i].AWARD = json.data[i].AWARD/10000;
                        }
                        fnCallback( {
                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData
                        });

                    }
                });
            },
            "columns": [
                {"title":"ID", "mData": "ID", "sDefaultContent": "","class":"hidden"},
                {"title":"部门", "mData": "NAME"},
                {"title":"奖金(万元)", "mData": "AWARD"},
                {"title":"同比", "mData": "TB"},
                {"title":"环比", "mData": "HB"}
            ],
            "columnDefs": [
                {
                    "targets": [2],
                    "data": "奖金",
                    "render": function (data) {
                        var ss;
                        if(companyBonusStatus === "1"){
                            ss = "<input value="+data+" readonly>";
                        }else {
                            ss = "<input value="+data+">";
                        }
                        return  ss;
                    }
                },
                {
                    "targets": [3],
                    "data": "同比",
                    "render": function (data) {
                        var ss;
                        if(data === "--"){
                            ss = data;
                        }else {
                            ss = (data * 100).toFixed(2);
                            if(ss>=100){
                                ss = "<span class='label label-warning arrowed-in arrowed-right'>"+ss+"%</span>";
                            }else{
                                ss = "<span class='label label-success arrowed-in arrowed-right'>"+ss+"%</span>";
                            }
                        }
                        return  ss;
                    }
                },
                {
                    "targets": [4],
                    "data": "环比",
                    "render": function (data) {
                        var ss;
                        if(data === "--"){
                            ss = data;
                        }else {
                            ss = (data * 100).toFixed(2);
                            if(ss>=100){
                                ss = "<span class='label label-warning arrowed-in arrowed-right'>"+ss+"%</span>";
                            }else{
                                ss = "<span class='label label-success arrowed-in arrowed-right'>"+ss+"%</span>";
                            }
                        }
                        return  ss;
                    }
                }
            ],
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'search': '检索:',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'paginate': {
                    'first':      '第一页',
                    'last':       '最后一页',
                    'next':       '下一页',
                    'previous':   '上一页'
                },
                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总件数 _MAX_ 条)'
            }
        } );
    }

    function bonusCount(){
        var ccc = 0;
        $("#example tbody tr").each(function(i){
            var b_num = parseFloat($(this).children("td").eq(2).children("input").val());
            ccc += b_num;
        });
        $("#count").html(ccc);
    }

});