$(function() {

    "use strict";
    events();
    render();

    function events() {

        //切换显示季度月份
        $(".mqGroup").on("click", function(){

            $(".mqGroup").removeClass("active");
            $(this).addClass("active");

            var type = $(this).attr("role-type");
            if(type == "quarter"){
                $("#quarter").css("display", "block");
                $("#month").css("display", "none");
            }
            if(type == "month"){
                $("#month").css("display", "block");
                $("#quarter").css("display", "none");
            }

            $("#hid_month_quarter").attr("value-data", type);

        });

        $(".year-select ul li a").on("click", function() {
            $(".year-select ul li a").removeClass("active");
            $(this).addClass("active");
        });

        $(".select-quarter a").on("click", function() {
            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
        });

        $(".select-month a").on("click", function() {
            $(".select-month a").removeClass("active");
            $(this).addClass("active");
        });

        $("#search-btn").on("click", function() {
            var years,
                quarter;
            years = $(".year-select ul li a.active").html();

            var panduan = $("#hid_month_quarter").attr("value-data");
            if(panduan === 'month') {
                quarter = $(".select-month a.active").html();
            }
            if(panduan === 'quarter') {
                quarter = $(".select-quarter a.active").html();
                if(quarter === "1季度"){
                    quarter = '一季度';
                }else if(quarter === "2季度"){
                    quarter = '二季度';
                }else if(quarter === "3季度"){
                    quarter = '三季度';
                }else{
                    quarter = '四季度';
                }
            }

            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    setTable(years,quarter);
                }else {
                    alert("您没有访问权限！");
                }
            });

        })

    }

    function render() {

        //获得当前 年－季度/月
        var quarter,year,status;
        light.doget("/performance/getNowTime", function(err, result){
            //console.log("result",result);
            quarter = result[0].QUARTER;
            year = result[0].YEARS;
            console.log(year+"####"+quarter);

            //将当前的年、季度存起来
            $(".render-time").attr("data-year",year);
            $(".render-time").attr("data-quarter",quarter);

            //1.给年份负值,2.当前年被选中
            $("#year").html(year);
            $("#year_n").html(parseInt(year)+1);
            $("#year_2n").html(parseInt(year)+2);

            $("#year").addClass("active");
            $("#hid_year").attr("value-data",year);

            //让当前 季度 选中
            if(quarter === "1"){
                $("#quarter_1").addClass("active");
                $("#hid_quarter").attr("value-data", "一季度");
                quarter = '一季度';
            }else if(quarter === "2"){
                $("#quarter_2").addClass("active");
                $("#hid_quarter").attr("value-data", "二季度");
                quarter = '二季度';
            }else if(quarter === "3"){
                $("#quarter_3").addClass("active");
                $("#hid_quarter").attr("value-data", "三季度");
                quarter = '三季度';
            }else{
                $("#quarter_4").addClass("active");
                $("#hid_quarter").attr("value-data", "四季度");
                quarter = '四季度';
            }

            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();
            var orgId = $("#hid-user").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    setTable(year,quarter);
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

    }

    function setTable(year, quarter_month) {

        //console.log(year+quarter_month);

        /* Create an array with the values of all the input boxes in a column */
        $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
        {
            alert("123");
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val();
            } );
        };

        /* Create an array with the values of all the input boxes in a column, parsed as numbers */
        $.fn.dataTable.ext.order['dom-text-numeric'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val() * 1;
            } );
        };

        /* Create an array with the values of all the select options in a column */
        $.fn.dataTable.ext.order['dom-select'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('select', td).val();
            } );
        };

        /* Create an array with the values of all the checkboxes in a column */
        $.fn.dataTable.ext.order['dom-checkbox'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).prop('checked') ? '1' : '0';
            } );
        };

        var index_num = 0;
        $('#example').dataTable( {
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": true,//搜索栏
            "bSort": true,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "bDestroy": true,                              //先解除原有的数据源，然后重新绑定
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
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
            },
            "sAjaxSource": "/performance/officeIndexList",     //指定要从哪个URL获取数据
            "fnInitComplete": function(oSettings, json) {
                var total = 0,
                    maxNum = [0,0,0,0,0],
                    minNum = [0,0,0,0,0],
                    differ = [0,0,0,0,0]
                    ;

                for(var i=0;i<json.aaData.length;i++) {
                    //合计
                    total += json.aaData[i].DEPTPERSONS;
                    //**************最高数－总达标率
                    if(json.aaData[i].DBSUM_RATE != null && json.aaData[i].DBSUM_RATE > maxNum[1]) {
                        maxNum[1] = json.aaData[i].DBSUM_RATE.toFixed(2);
                    }
                    //最高数－总绩点
                    if(json.aaData[i].JD_SUM != null && json.aaData[i].JD_SUM > maxNum[2]) {
                        maxNum[2] = json.aaData[i].JD_SUM;
                    }
                    //最高数－人均绩点
                    if(json.aaData[i].JD_AVE != null && json.aaData[i].JD_AVE > maxNum[3]) {
                        maxNum[3] = json.aaData[i].JD_AVE;
                    }
                    //最高数－绩效分
                    if(json.aaData[i].JX_FEN != null && json.aaData[i].JX_FEN > maxNum[4]) {
                        maxNum[4] = json.aaData[i].JX_FEN;
                    }
                    //****************最低数－人数
                    if(json.aaData[i].DEPTPERSONS != null && json.aaData[i].DEPTPERSONS < minNum[0]) {
                        minNum[0] = json.aaData[i].DEPTPERSONS;
                    }
                    //最低数－总达标率
                    if(json.aaData[i].DBSUM_RATE != null && json.aaData[i].DBSUM_RATE < minNum[1]) {
                        minNum[1] = json.aaData[i].DBSUM_RATE.toFixed(2);
                    }
                    //最低数－总绩点
                    if(json.aaData[i].JD_SUM != null && json.aaData[i].JD_SUM < minNum[2]) {
                        minNum[2] = json.aaData[i].JD_SUM;
                    }
                    //最低数－人均绩点
                    if(json.aaData[i].JD_AVE != null && json.aaData[i].JD_AVE < minNum[3]) {
                        minNum[3] = json.aaData[i].JD_AVE;
                    }
                    //最低数－绩效分
                    if(json.aaData[i].JX_FEN != null && json.aaData[i].JX_FEN < minNum[4]) {
                        minNum[4] = json.aaData[i].JX_FEN;
                    }

                }
                maxNum[0] = Math.round(total);        //最高数－人数
                //相差值 ＝ 最大 － 最小
                differ[0] = maxNum[0] - minNum[0];
                differ[1] = maxNum[1] - minNum[1];
                differ[2] = maxNum[2] - minNum[2];
                differ[3] = maxNum[3] - minNum[3];

                if(json.aaData.length > 0) {
                    differ[4] = ((json.aaData[0].MAX_FEN - json.aaData[0].MIN_FEN)/differ[3]).toFixed(6);
                }

                //console.log("********"+total);
                //console.log("********"+maxNum);
                //console.log("********"+minNum);
                //console.log("********"+differ);

                $("tfoot tr:eq(0) td:eq(2)").html(total.toFixed(2));
                $("tfoot tr:eq(1) td:eq(2)").html(maxNum[0]);
                $("tfoot tr:eq(1) td:eq(3)").html(maxNum[1]);
                $("tfoot tr:eq(1) td:eq(4)").html(maxNum[2]);
                $("tfoot tr:eq(1) td:eq(5)").html(maxNum[3]);
                $("tfoot tr:eq(1) td:eq(6)").html(maxNum[4]);
                $("tfoot tr:eq(2) td:eq(2)").html(minNum[0]);
                $("tfoot tr:eq(2) td:eq(3)").html(minNum[1]);
                $("tfoot tr:eq(2) td:eq(4)").html(minNum[2]);
                $("tfoot tr:eq(2) td:eq(5)").html(minNum[3]);
                $("tfoot tr:eq(2) td:eq(6)").html(minNum[4]);
                $("tfoot tr:eq(3) td:eq(2)").html(differ[0].toFixed(1));
                $("tfoot tr:eq(3) td:eq(3)").html(differ[1].toFixed(1));
                $("tfoot tr:eq(3) td:eq(4)").html(differ[2].toFixed(1));
                $("tfoot tr:eq(3) td:eq(5)").html(differ[3].toFixed(1));
                $("tfoot tr:eq(3) td:eq(6)").html(differ[4]);
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                var start = 0,limit = 10,sSearch = "";

                _.each(aoData, function(param) {
                    if ("iDisplayStart" ===param.name) {
                        start = param.value;
                    }
                    if ("iDisplayLength" ===param.name) {
                        limit = param.value;
                    }
                    if ("sSearch" ===param.name) {
                        sSearch = param.value;
                    }
                });

                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data": {
                        keyword: sSearch,
                        skip: start,
                        limit: limit,
                        year: year,
                        quarter_month: quarter_month
                    },

                    "success": function(json) {
                        //console.log("***",json);
                        var resultData = json.data;
                        var totalItems = 0;
                        if(json.data.length >0){
                            totalItems = json.data.length;
                        }
                        //console.log("resultData",resultData)
                        fnCallback( {

                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData

                        });
                    }
                });
            },
            "columns": [
            {"title":"序号", "mData": "ROW_NO", "width":"80px"},
            {"title":"经营办", "mData": "DEPT", "width":"80px"},
            {"title":"人数", "mData": "DEPTPERSONS", "width":"80px"},
            { "title":"总达标率", "mData": "DBSUM_RATE", "width":"80px" },
            { "title":"总绩点", "mData": "JD_SUM", "width":"80px"},
            { "title":"人均绩点", "mData": "JD_AVE", "width":"80px"},
            { "title":"绩效分", "mData": "JX_FEN", "width":"80px"},
            { "title":"说明", "mData": "MARK", "width":"80px"}
            ],
            "columnDefs": [
                {
                    "targets": [3],
                    "data": "总达标率",
                    "render": function (data){
                        var aa = 0.0;
                        if(data) {
                            aa = data.toFixed(1)
                        }
                        return aa;
                    }
                },
                {
                    "targets": [4],
                    "data": "总绩点",
                    "render": function (data){
                        var aa = 0.0;
                        if(data) {
                            aa = data.toFixed(1)
                        }
                        return aa;
                    }
                },
                {
                    "targets": [5],
                    "data": "人均绩点",
                    "render": function (data){
                        var aa = 0.0;
                        if(data) {
                            aa = data.toFixed(1)
                        }
                        return aa;
                    }
                },
                {
                    "targets": [6],
                    "data": "绩效分",
                    "render": function (data){
                        var aa = 0.0;
                        if(data) {
                            aa = data.toFixed(1)
                        }
                        return aa;
                    }
                }
            ]

        } );

        }
});