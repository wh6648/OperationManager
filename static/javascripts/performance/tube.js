/**
 * Created by apple04 on 15/9/7.
 */
$(function(){

    var InterValObj; // timer变量，控制时间

    render();

    function render(){
        light.doget("/performance/getNowTime", function(err, result) {
            if(result[0].OPERATIONSTATUS==="10"){
                light.doget("/performance/getOperationTimeByRow_sort", {row_sort:"4"}, function(err, result) {
                    var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
                    if((cre_time<nowTime)&&(nowTime<end_time)){
                        var groupId = $("#hid-user-groups").val();
                        orgId = $("#hid-user").val();
                        light.doget("/group/get", {id:groupId}, function(err, result) {
                            if (result.name === '箱管组') {
                                events();
                                getTubeDeclareStatus();
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

    function events(){
        $("#subBonus").bind("click",function(){
            alertify.confirm("是否确定提交？", function(state) {
                if(state) {
                    var array = [];
                    var id,personNumber;
                    $("#example tbody tr").each(function(i){
                        id = $(this).children("td").eq(0).html();
                        personNumber = $(this).children("td").eq(2).children("input").val();
                        array.push({id:id,personNumber:personNumber});
                    });
                    light.doput("/performance/subTubePersonNumber", {array: array}, function(err, result) {
                        light.doget("/performance/subTubeDeclareStatus", function(err, result) {
                            getTubeDeclareStatus();
                        });
                    });
                    alertify.success("提交成功！");
                }else {
                    alertify.log("已取消提交！");
                }
            });
        });

        $("#keepBonus").bind("click",function(){
            alertify.confirm("是否确定保存？", function(state) {
                if(state) {
                    var array = [];
                    var id,personNumber;
                    $("#example tbody tr").each(function(i){
                        id = $(this).children("td").eq(0).html();
                        personNumber = $(this).children("td").eq(2).children("input").val();
                        array.push({id:id,personNumber:personNumber});
                    });
                    light.doput("/performance/keepTubePersonNumber", {array: array}, function(err, result) {
                        getTubeDeclareStatus();
                    });
                    alertify.success("保存成功！");
                }else {
                    alertify.log("已取消保存！");
                }
            });
        });
    }





    function getTubeDeclareStatus(){
        light.doget("/performance/getTubeDeclareStatus", function(err, result){
            var tubeStatus = result[0].TUBE_PERSON_SUBSTATUS;
            if(tubeStatus==="1"){
                window.clearInterval(InterValObj); // 停止计时器
                showTable(tubeStatus);
                $("#subBonus").attr("disabled", true);
                $("#keepBonus").attr("disabled", true);
                $(".sub-true").css("display","inline");
                $(".sub-false").css("display","none");
            }else{

                //定时执行一遍保存
                InterValObj = window.setInterval(timeoutSave, 5000*60); // 启动计时器，5秒执行一次

                showTable(tubeStatus);
                $("#subBonus").attr("disabled", false);
                $("#keepBonus").attr("disabled", false);
                $(".sub-false").css("display","inline");
                $(".sub-true").css("display","none");
            }
        });
    }

    //定时保存
    function timeoutSave() {
        var array = [];
        var id,personNumber;
        $("#example tbody tr").each(function(i){
            id = $(this).children("td").eq(0).html();
            personNumber = $(this).children("td").eq(2).children("input").val();
            array.push({id:id,personNumber:personNumber});
        });
        light.doput("/performance/keepTubePersonNumber", {array: array}, function(err, result) {
        });
    }


    function showTable(tubeStatus){

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
            "sAjaxSource": "/performance/getTubePersonNumber",
            "fnInitComplete": function(oSettings, json) {
                //bonusCount();
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                        "tubeStatus": tubeStatus
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
                {"title":"ID", "mData": "ID", "sDefaultContent": "", "class":"hidden"},
                {"title":"办事处", "mData": "OFFICE_NAME"},
                {"title":"办事处中箱管人数", "mData": {},"orderDataType": "dom-text"}
            ],
            "columnDefs": [
                {
                    "targets": [2],
                    "data": "箱管人数",
                    "render": function (data) {
                        if(tubeStatus==="1"){
                            var ss = "<input value=" + data.TUBE_NUMBER + " readonly>";
                        }else {
                            if (data.OFFICE_NAME === '箱管') {
                                var ss = "<input value=" + data.TUBE_NUMBER + " readonly>";
                            }else {
                                var ss = "<input value=" + data.TUBE_NUMBER + ">";
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

})
