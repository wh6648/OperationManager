/**
 * Created by apple04 on 15/8/13.
 */
$(function(){
    render();

    function render() {
        //light.doget("/performance/getNowTime", function (err, result) {
        //    if (result[0].OPERATIONSTATUS === "10") {
        //        light.doget("/performance/getOperationTimeByRow_sort", {row_sort: "2"}, function (err, result) {
        //            var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
        //                end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
        //                nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
        //            if ((cre_time < nowTime) && (nowTime < end_time)) {
                        var groupId = $("#hid-user-groups").val();
        //                orgId = $("#hid-user").val();
                        light.doget("/group/get", {id: groupId}, function (err, result) {
                            if (result.name === '公司组') {
                                events();
                                getCompanyBonusRender();
                            } else {
                                alert("您没有权限进行该操作");
                            }
                        });
        //            } else {
        //                alert("当前时间不可操作");
        //            }
        //        });
        //    } else {
        //        alert("考评未开始");
        //    }
        //});
    }

    function events(){
        $(".select-quarter a").on("click", function() {
            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
            var year = $(".year-select ul li a.active").html();
            var quarter = $(".select-quarter a.active").html();
            if(quarter==="一季度"){
                quarter = 1;
            }else if(quarter==="二季度"){
                quarter = 2;
            }else if(quarter==="三季度"){
                quarter = 3;
            }else if(quarter==="四季度"){
                quarter = 4;
            }
            tableRender(year,quarter);
        });
    }

    function getCompanyBonusRender(){
        //获得当前 年－季度/月
        light.doget("/performance/getNowTime", function(err, result) {
            var quarter = result[0].QUARTER;
            var year = result[0].YEARS;

            //将当前的年、季度存起来
            $(".render-time").attr("data-year", year);
            $(".render-time").attr("data-quarter", quarter);

            //1.给年份负值,2.当前年被选中
            $("#year").html(year);
            $("#year_n").html(parseInt(year) + 1);
            $("#year_2n").html(parseInt(year) + 2);

            $("#year").addClass("active");
            $("#hid_year").attr("value-data", year);

            //让当前 季度 选中
            if (quarter === "1") {
                $("#quarter_1").addClass("active");
                $("#hid_quarter").attr("value-data", "一季度");
            } else if (quarter === "2") {
                $("#quarter_2").addClass("active");
                $("#hid_quarter").attr("value-data", "二季度");
            } else if (quarter === "3") {
                $("#quarter_3").addClass("active");
                $("#hid_quarter").attr("value-data", "三季度");
            } else {
                $("#quarter_4").addClass("active");
                $("#hid_quarter").attr("value-data", "四季度");
            }

            tableRender(year,quarter);
        });
    }

    function tableRender(year,quarter){
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
            "sAjaxSource": "/performance/checkCompanyBonus",
            "fnInitComplete": function(oSettings, json) {
                bonusCount();
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                        "year": year,
                        "quarter": quarter
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
                {"title":"ID", "mData": "ID", "sDefaultContent": "", "width":"80px","class":"hidden"},
                {"title":"部门", "mData": "NAME", "width":"80px"},
                {"title":"奖金(万元)", "mData": "AWARD", "width":"80px"},
                {"title":"同比", "mData": "TB", "width":"80px"},
                {"title":"环比", "mData": "HB", "width":"80px"}
            ],
            "columnDefs": [
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
            var b_num = parseFloat($(this).children("td").eq(2).html());
            ccc += b_num;
        });
        $("#count").html(ccc);
    }

});