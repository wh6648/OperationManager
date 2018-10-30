/**
 * Created by chao on 15/8/25.
 */
$(function() {

    "use strict"
    events();
    render();

    function render(){

        //获得当前 年－季度/月
        var quarter,year;
        light.doget("/performance/getNowTime", function(err, result) {
            quarter = result[0].QUARTER;
            year = result[0].YEARS;
            switch (quarter)
            {
                case '1':{quarter='一季度';}break;
                case '2':{quarter='二季度';}break;
                case '3':{quarter='三季度';}break;
                case '4':{quarter='四季度';}break;
                default:{alert("年份选择错误！");return ;}break;
            }
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
            if (quarter === "一季度") {
                $("#quarter_1").addClass("active");
                $("#hid_quarter").attr("value-data", "一季度");
                //quarter = 1;
            } else if (quarter === "二季度") {
                $("#quarter_2").addClass("active");
                $("#hid_quarter").attr("value-data", "二季度");
                //quarter = 2;
            } else if (quarter === "三季度") {
                $("#quarter_3").addClass("active");
                $("#hid_quarter").attr("value-data", "三季度");
                //quarter = 3;
            } else {
                $("#quarter_4").addClass("active");
                $("#hid_quarter").attr("value-data", "四季度");
                //quarter = 4;
            }

            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();
            var orgId = $("#hid-user").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                //console.log("$$$$$$" ,result.name);
                if (result.name === '人事组') {
                    tabRender(year,quarter);
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

    }

    function tabRender(year,quarter){

        light.doget("/performance/getCompanyRelation", function(err, result){
            $("#select_company").empty();
            for(var i=0;i<result.length;i++){
                $("#select_company").append("<li class='' id='"+result[i].ID+"'><a data-toggle='tab' href='#home4'>"+result[i].NAME+"</a></li>");
            }
            var companyId = result[0].ID;
            $("#"+companyId).addClass("active");
            showTable(year,quarter,companyId);
        });

    }

    function showTable(year,quarter,companyId){

        switch (quarter)
        {
            case '一季度':{quarter=1;}break;
            case '二季度':{quarter=2;}break;
            case '三季度':{quarter=3;}break;
            case '四季度':{quarter=4;}break;
            default:{alert("年份选择错误！");return ;}break;
        }

        /* Create an array with the values of all the input boxes in a column */
        $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val();
            } );
        }

        /* Create an array with the values of all the input boxes in a column, parsed as numbers */
        $.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val() * 1;
            } );
        }

        /* Create an array with the values of all the select options in a column */
        $.fn.dataTable.ext.order['dom-select'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('select', td).val();
            } );
        }

        /* Create an array with the values of all the checkboxes in a column */
        $.fn.dataTable.ext.order['dom-checkbox'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).prop('checked') ? '1' : '0';
            } );
        }

        /* Initialise the table with the required column ordering data types */
        $(document).ready(function() {
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
                "sAjaxSource": "/performance/showOfficeBonus",
                "fnInitComplete": function(oSettings, json) {
                    set_total("example");
                },
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                    oSettings.jqXHR = $.ajax( {
                        "dataType": "json",
                        "type": "GET",
                        "url": sSource,
                        "data": {
                            "year": year,
                            "quarter": quarter,
                            "companyId": companyId
                        },
                        "success": function(json) {
                            var resultData = json.data.result_data;

                            var totalItems = resultData.length;

                            fnCallback( {
                                iTotalRecords: totalItems          //json.data.totalItems
                                , iTotalDisplayRecords: totalItems //json.data.totalItems
                                , aaData: resultData
                            });

                        }
                    });
                },
                "columns": [
                    {"title":"序号","mData": "ROWNUM","width":"20px","sDefaultContent": ""},
                    {"title":"ID","mData": "ID","width":"20px","sDefaultContent": "", "class":"hidden"},
                    {"title":"经营办","mData": "OFFICE_NAME","width":"40px","sDefaultContent": ""},
                    {"title":"人数","mData": "DEPTPERSONS","width":"20px","sDefaultContent": ""},
                    { "title":"绩效分","mData": "JX_FEN","orderDataType": "dom-text","width":"30px" ,"sDefaultContent": ""},
                    { "title":"总分","mData": "SUM_FEN","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                    { "title":"总额","mData": "TOTAL","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                    { "title":"人均","mData": "PER_CAPITA","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                    { "title":"商务人数","mData": "COMMERCE_NUMBER","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                    { "title":"商务占金额","mData": "COMMERCE_MONEY","orderDataType": "dom-text" ,"width":"50px","sDefaultContent": ""},
                    { "title":"箱管人数","mData": "TUBE_NUMBER","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                    { "title":"箱管占金额","mData": "TUBE_MONEY","orderDataType": "dom-text" ,"width":"50px","sDefaultContent": ""},
                    { "title":"期内实习试用","mData": "PROBATION","orderDataType": "dom-text" ,"width":"60px","sDefaultContent": ""},
                    { "title":"期内转正","mData": "POSITIVE","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                    { "title":"转正月数","mData": "MONTHS_NUMBER","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                    { "title":"实际数额","mData": "TRUE_TOTAL","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""}
                ],
                "columnDefs": [
                    {
                        "targets": [3],
                        "data": "peoSum",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [4],
                        "data": "jx_fen",
                        "render": function (data) {
                            var pre = "--";

                            pre = parseFloat(data).toFixed(0);
                            if (pre >= 90)
                                pre = "<span class='label label-danger arrowed-in arrowed-right' style='width: 45px'>"+pre+"</span>";
                            else if (pre >= 80)
                                pre = "<span class='label label-warning arrowed-in arrowed-right' style='width: 40px'>"+pre+"</span>";
                            else if (pre >= 70)
                                pre = "<span class='label label-success arrowed-in arrowed-right' style='width: 35px'>"+pre+"</span>";
                            else
                                pre = "<span class='label label-info arrowed-in arrowed-right' style='width: 30px'>"+pre+"</span>";


                            return pre+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [5],
                        "data": "sum_fen",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [6],
                        "data": "total",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [7],
                        "data": "every",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [8],
                        "data": "sw_peo",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [9],
                        "data": "sw_money",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [10],
                        "data": "xg_peo",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [11],
                        "data": "xgmoney",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [12],
                        "data": "期内实习试用",
                        "render": function (data) {
                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [13],
                        "data": "期内转正",
                        "render": function (data) {
                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [14],
                        "data": "转正月数",
                        "render": function (data) {
                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                    },
                    {
                        "targets": [15],
                        "data": "true_total",
                        "render": function (data) {

                            return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
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
        } );
    }

    function events(){

        $(".year-select ul li a").on("click", function() {
            $(".year-select ul li a").removeClass("active");
            $(this).addClass("active");
        });

        $(".select-quarter a").on("click", function() {

            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
            var year = $(".year-select ul li a.active").html();
            var quarter = $(".select-quarter a.active").html();
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();
            var orgId = $("#hid-user").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                //console.log("$$$$$$" ,result.name);
                if (result.name === '人事组') {
                    tabRender(year,quarter);
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

        $("#select_company").on("click","li",function(){
            var year = $(".year-select ul li a.active").html();
            var quarter = $(".select-quarter a.active").html();
            var companyId = $(this)[0].id;
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();
            var orgId = $("#hid-user").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                //console.log("$$$$$$" ,result.name);
                if (result.name === '人事组') {
                    showTable(year,quarter,companyId);
                }else {
                    alert("您没有访问权限！");
                }
            });

        });
    }
    function set_total(table_name){
        var $tr_array = $("#"+table_name+" tbody tr");
        var peo_num = 0,score_sum = 0,bus_num = 0,tube_num = 0,pra_num = 0,pos_num = 0,pos_mon = 0,money_sum = 0;
        for (var i = 0; i < $tr_array.length; i++)
        {
            peo_num += parseFloat($tr_array.eq(i).children("td").eq(3).children("p").html());
            score_sum += parseFloat($tr_array.eq(i).children("td").eq(5).children("p").html());
            bus_num += parseFloat($tr_array.eq(i).children("td").eq(8).children("p").html());
            tube_num += parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html());
            pra_num += parseFloat($tr_array.eq(i).children("td").eq(12).children("p").html());
            pos_num += parseFloat($tr_array.eq(i).children("td").eq(13).children("p").html());
            pos_mon += parseFloat($tr_array.eq(i).children("td").eq(14).children("p").html());
            money_sum += parseFloat($tr_array.eq(i).children("td").eq(15).children("p").html());
        }

        $("#peo_num").html(parseFloat(peo_num).toFixed(1)+"<p hidden>"+peo_num+"</p>");
        $("#score_sum").html(parseFloat(score_sum).toFixed(1)+"<p hidden>"+score_sum+"</p>");
        $("#bus_num").html(parseFloat(bus_num).toFixed(1)+"<p hidden>"+bus_num+"</p>");
        $("#tube_num").html(parseFloat(tube_num).toFixed(1)+"<p hidden>"+tube_num+"</p>");
        $("#pra_num").html(parseFloat(pra_num).toFixed(1)+"<p hidden>"+pra_num+"</p>");
        $("#pos_num").html(parseFloat(pos_num).toFixed(1)+"<p hidden>"+pos_num+"</p>");
        $("#pos_mon").html(parseFloat(pos_mon).toFixed(1)+"<p hidden>"+pos_mon+"</p>");
        $("#money_sum").html(parseFloat(money_sum).toFixed(1)+"<p hidden>"+money_sum+"</p>");
    }

});
