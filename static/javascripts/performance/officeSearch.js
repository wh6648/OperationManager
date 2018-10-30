/**
 * Created by wsights on 15-7-29.
 */
$(function (){

    "use strict";
    //10没有提交过，20已提交过，30没有提交过,保存过
    var trueCommit;
    events();
    render();

    function events(){

        $(".main-content").on("click", function (event){
            if ($(event.target).hasClass("paginate_button"))
            {
                $("[data-rel=tooltip]").tooltip();
            }
        });

        /**
         * 选择日期
         */
        $(".select-quarter a").on("click", function() {

            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
            var years = $(".year-select ul li a.active").html();
            var quarter = $(".select-quarter a.active").html();
            set_table(years,quarter);
        });
    }

    function render(){
        //获得当前 年－季度/月
        var quarter,years,areaId=$("#hid-user").val();
        light.doget("/performance/getNowTime", function(err, result) {
            quarter = result[0].QUARTER;
            years = result[0].YEARS;
            switch (quarter) {
                case '1':
                {
                    quarter = '一季度';
                }
                    break;
                case '2':
                {
                    quarter = '二季度';
                }
                    break;
                case '3':
                {
                    quarter = '三季度';
                }
                    break;
                case '4':
                {
                    quarter = '四季度';
                }
                    break;
                default:
                {
                    alert("年份选择错误！");
                    return;
                }
                    break;
            }
            //将当前的年、季度存起来
            $(".render-time").attr("data-year", years);
            $(".render-time").attr("data-quarter", quarter);

            //1.给年份负值,2.当前年被选中
            $("#year").html(years);
            $("#year_n").html(parseInt(years) + 1);
            $("#year_2n").html(parseInt(years) + 2);

            $("#year").addClass("active");
            $("#hid_year").attr("value-data", years);

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
        });

        /**
         * 获得登陆用户权限
         * －主管
         * －哪个办事处的
         */
        var groupId = $("#hid-user-groups").val();
        var orgId = $("#hid-user").val();

        light.doget("/group/get", {id:groupId}, function(err, result) {
            //console.log("$$$$$$" ,result.name);
            if (result.name === '办事处主任组' || result.name === '商务组' || result.name === '箱管组' || result.name === '船管组' || result.name === '运管组') {
                /**
                 * 判断是否已经提交过
                 */
                set_table(years,quarter);
            }else {
                alertify.log("您没有访问权限！");
            }

        });

    }

    function set_table(years,quarter){
        var name_index = 0;

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

        $('#example').dataTable( {
            "scrollX": "1285px",
            "scrollXInner": "1285px",
            //"scrollY": "450px",
            "scrollCollapse": true,
            "bPaginate": false,//分页按钮
            "bLengthChange": false,//每行显示记录数
            "bFilter": false,//搜索栏
            "bSort": true,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "bDestroy": true,
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'search': '检索:',
                'lengthMenu': '每页 _MENU_ 件',
                'zeroRecords': '没有数据',
                'paginate': {
                    'first':      '第一页',
                    'last':       '最后一页',
                    'next':       '',
                    'previous':   ''
                },
                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
                'infoEmpty': '没有数据',
                'infoFiltered': '(过滤总件数 _MAX_ 条)'
            },
            "sAjaxSource": "/performance/searchEmployeeBonusInfo",     //指定要从哪个URL获取数据
            "fnInitComplete": function(oSettings, json) {

                $("[data-rel=tooltip]").tooltip();
                var sum = 0,sumP = 0;
                var $tr = $("#example tbody tr");
                if (json.iTotalRecords > 0) {
                    for (var i = 0; i < $tr.length; i++)
                    {
                        sum += parseFloat($tr.eq(i).children("td").eq(8).html()==""?0:$tr.eq(i).children("td").eq(8).html());
                        sumP += parseFloat($tr.eq(i).children("td").eq(9).html()==""?0:$tr.eq(i).children("td").eq(9).html());
                    }
                }else {
                    sum = 0;
                    sumP = 0;
                }
                $(".dataTables_scrollFootInner .display.dataTable tfoot th:eq(8)").html(sum+"%");
                $(".dataTables_scrollFootInner .display.dataTable tfoot th:eq(9)").html(sum+"%");

            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                var start = 0,limit = 10,sSearch = "";
                var orgId = $("#hid-user").val();

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
                        orgId: orgId,
                        years: years,
                        quarter: quarter
                    },

                    "success": function(json) {
                        var resultData = json.data;
                        var totalItems = 0;
                        if(json.data.length > 0){
                            totalItems = json.data.length;
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
                {"title":"ID","mData":"ID","width":"20px","class":"hidden"},
                {"title":"序号","width":"20px"},
                {"title":"姓名","mData":"NAME", "sDefaultContent": "","width":"20px"},
                {"title":"员工号","mData":"CODE", "sDefaultContent": "","width":"30px"},
                {"title":"职位","mData":"POSITION", "sDefaultContent": "","width":"20px"},
                { "title":"入职时间","mData":"ENTRY_TIME", "sDefaultContent": "","width":"60px" },
                { "title":"转正时间","mData":"POSITIVE_TIME", "sDefaultContent": "","width":"60px"},
                { "title":"考评意见","mData":"REMARKS", "sDefaultContent": "","width":"10px" },
                { "title":"比例(%)","mData":"PROPORTION", "sDefaultContent": "","width":"10px" },
                { "title":"上级比例(%)","mData":"SUPERIORPRO", "sDefaultContent": "","width":"40px" },
                { "title":"上级备注","mData":"REMARKSPRO", "sDefaultContent": "","width":"40px"}

            ],
            "columnDefs": [
                {
                    "targets": [1],
                    "data": "序号",
                    "render": function (){
                        return ++name_index;
                    }
                },
                {
                    "targets": [4],
                    "data": "职位",
                    "render": function (data){
                        var ss;
                        if (data === '10') {
                            ss = '员工';
                        }else {
                            ss = '';
                        }
                        return ss;
                    }
                },
                {
                    "targets": [5],
                    "data": "入职时间",
                    "render": function (data){
                        var ss;
                        if(data) {
                            ss = moment(data).format('YYYY/MM/DD');
                        }else {
                            ss = '';
                        }
                        return ss;
                    }
                },
                {
                    "targets": [6],
                    "data": "转正时间",
                    "render": function (data){
                        var ss;
                        if(data) {
                            ss = moment(data).format('YYYY/MM/DD');
                        }else {
                            ss = '';
                        }
                        return ss;
                    }
                },
                {
                    "targets": [7],
                    "data": "考评意见",
                    "render": function (data) {
                        var ss;
                        if(data) {
                            ss = data;
                        }else {
                            ss = "";
                        }

                        return  ss;
                    }
                },
                {
                    "targets": [8],
                    "data": "比例",
                    "render": function (data) {
                        var ss;
                        if(data) {
                            ss = data;
                        }else {
                            ss = "0";
                        }
                        return  ss;
                    }
                },
                {
                    "targets": [9],
                    "data": "上级比例",
                    "render": function (data) {
                        var ss;
                        if(data != null) {
                            ss = data;
                        }else {
                            ss = '--';
                        }
                        return  ss;
                    }
                },
                {
                    "targets": [10],
                    "data": "上级备注",
                    "render": function (data) {
                        var ss;
                        if (data === undefined){
                            ss = "<span data-rel='tooltip' data-original-title=''></span>";
                        }else if (data === null) {
                            ss = "<span data-rel='tooltip' data-original-title=''></span>";
                        }
                        else {
                            ss = "<span data-rel='tooltip' data-original-title="+data+">"+data.substr(0,4)+"..."+"</span>";
                        }
                        return  ss;
                    }
                }
            ]

        } );

    }

});

