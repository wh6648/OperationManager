/**
 * Created by apple04 on 15/9/7.
 */
$(function(){

    var InterValObj; // timer变量，控制时间
    render();

    function render(){

        light.doget("/performance/getNowTime", function(err, result) {
            if(result[0].OPERATIONSTATUS==="10"){
                light.doget("/performance/getOperationTimeByRow_sort", {row_sort:"6"}, function(err, result) {
                    var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
                    if((cre_time<nowTime)&&(nowTime<end_time)){
                        var groupId = $("#hid-user-groups").val();
                        orgId = $("#hid-user").val();
                        light.doget("/group/get", {id:groupId}, function(err, result) {
                            if (result.name === '区域组') {
                                events();

                                var responsibleId = $("#hid-user-code").val();
                                //读取区域操作状态
                                light.doget("/performance/getAreaByResponsibleId", {responsibleId: responsibleId}, function(err, result) {
                                    var areaId = result;
                                    light.doget("/performance/getAreaStatus", {areaId: areaId}, function(err, result) {
                                        var tube = result[0].TUBE_NUMBER_STATUS;
                                        var commerce = result[0].COMMERCE_NUMBER_STATUS;
                                        if(tube==="20"&&commerce==="20"){
                                            getStatus(responsibleId);
                                        }else{
                                            alert("申报还未完成");
                                        }
                                    });
                                });





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

    function getStatus(responsibleId){
        //读取用户审批状态
        light.doget("/performance/getUserStatus", {responsibleId: responsibleId}, function(err, result) {
            var status = result;
            if(status===1){
                window.clearInterval(InterValObj); // 停止计时器

                $("#subBonus").attr("disabled", true);
                $("#keepBonus").attr("disabled", true);
                $(".sub-true").css("display","inline");
                $(".sub-false").css("display","none");
            }else{
                //定时执行一遍保存
                InterValObj = window.setInterval(timeoutSave, 5000*60); // 启动计时器，5秒执行一次

                $("#subBonus").attr("disabled", false);
                $("#keepBonus").attr("disabled", false);
                $(".sub-false").css("display","inline");
                $(".sub-true").css("display","none");
            }
            tableRender(status,responsibleId);
        });
    }

    function tableRender(status,responsibleId){

        var count = 0;

        //dom对象排序
        //td里面是input
        $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val();
            } );
        };

        $('#example').dataTable( {
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": false,//搜索栏
            "bSort": true,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "bDestroy": true,
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
            "sAjaxSource": "/performance/getTubeAndBusinessPersonNum",
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                        "responsibleId":responsibleId
                    },
                    "success": function(json) {
                        var resultData = json.data;
                        var totalItems = json.data.length;

                        fnCallback( {
                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData
                        });

                    }
                });
            },
            "columns": [
                {"title":"id", "mData": "ID","class":"hidden"},
                {"title":"序号"},
                {"title":"公司", "mData": "COMPANY_NAME"},
                {"title":"区域", "mData": "INDEXAREA_NAME"},
                { "title":"办事处", "mData":"OFFICE_NAME"},
                { "title":"商务人数", "mData":"COMMERCE_NUMBER"},
                { "title":"修改商务人数", "mData":"EX_COMMERCE_NUMBER","orderDataType": "dom-text"},
                { "title":"箱管人数", "mData":"TUBE_NUMBER"},
                { "title":"修改箱管人数", "mData":"EX_TUBE_NUMBER","orderDataType": "dom-text"}
            ],
            "columnDefs": [
                {
                    "targets": [1],
                    "data": "序号",
                    "render": function () {
                        return ++count;
                    }
                },
                {
                    "targets": [6],
                    "data": "修改商务人数",
                    "render": function (data) {
                        if(status==="1"){
                            var ss = "<input class='edit-input' value='"+data+"' readonly/>";
                        }else{
                            var ss = "<input class='edit-input' value='"+data+"'/>";
                        }
                        return ss;
                    }
                },
                {
                    "targets": [8],
                    "data": "修改箱管人数",
                    "render": function (data) {
                        if(status==="1"){
                            var ss = "<input class='edit-input' value='"+data+"' readonly/>";
                        }else{
                            var ss = "<input class='edit-input' value='"+data+"'/>";
                        }
                        return ss;
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

    function events(){
        $("#subBonus").on("click",function(){
            alertify.confirm("该操作不可逆，是否确定提交？", function(state) {
                if(state) {

                    var officeId,businessNum,tubeNum;
                    var array = [];
                    $("#example tbody tr").each(function(){
                        officeId = $(this).children("td").eq(0).html();
                        businessNum = $(this).children("td").eq(6).children("input").val();
                        tubeNum = $(this).children("td").eq(8).children("input").val();
                        array.push({officeId:officeId, businessNum:businessNum, tubeNum:tubeNum});
                    });
                    light.doput("/performance/keepTubeAndBusinessPersonNum", {array: array}, function(err, result) {
                        var responsibleId = $("#hid-user-code").val();

                        //light.doget("/performance/getUser_id", {responsibleId: responsibleId}, function(err, result) {
                        //    var _id = result;

                            light.doput("/performance/subTubeAndBusinessPersonNum", {responsibleId: responsibleId}, function(err, result) {
                                window.location = "/site/person_num?name=绩效考核";
                            });

                        //});

                    });

                    alertify.success("提交成功！");
                }else {
                    alertify.log("已取消提交！");
                }
            });
        });

        $("#keepBonus").on("click",function(){
            alertify.confirm("是否确定保存？", function(state) {
                if(state) {
                    var officeId,businessNum,tubeNum;
                    var array = [];
                    $("#example tbody tr").each(function(){
                        officeId = $(this).children("td").eq(0).html();
                        businessNum = $(this).children("td").eq(6).children("input").val();
                        tubeNum = $(this).children("td").eq(8).children("input").val();
                        array.push({officeId:officeId, businessNum:businessNum, tubeNum:tubeNum});
                    });
                    light.doput("/performance/keepTubeAndBusinessPersonNum", {array: array}, function(err, result) {
                        alertify.success("保存成功！");
                    });
                }else {
                    alertify.log("已取消保存！");
                }
            });
        });

    }

    //定时保存
    function timeoutSave() {
        var officeId,businessNum,tubeNum;
        var array = [];
        $("#example tbody tr").each(function(){
            officeId = $(this).children("td").eq(0).html();
            businessNum = $(this).children("td").eq(6).children("input").val();
            tubeNum = $(this).children("td").eq(8).children("input").val();
            array.push({officeId:officeId, businessNum:businessNum, tubeNum:tubeNum});
        });
        light.doput("/performance/keepTubeAndBusinessPersonNum", {array: array}, function(err, result) {
        });
    }

    function keepAndSub(url){
        var officeId,businessNum,tubeNum;
        var userName = $(".user-info").children("small").eq(1).html();
        var array = [];
        $("#example tbody tr").each(function(){
            officeId = $(this).children("td").eq(0).html();
            businessNum = $(this).children("td").eq(6).children("input").val();
            tubeNum = $(this).children("td").eq(8).children("input").val();
            userName = userName;
            array.push({officeId:officeId, businessNum:businessNum, tubeNum:tubeNum, userName:userName});
        });
        light.doput(url+"PersonNum", {array: array}, function(err, result) {
            tableRender(responsibleId);
        });
    }

})
