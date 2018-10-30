/**
 * Created by wsights on 15-7-30.
 */
$(function (){
    "use strict";
    events();
    render();

    function events(){
        //暂时先注了
        $("table").on("click","a",function (){
            if ($(this).hasClass("sub20") || $(this).hasClass("sub30"))
            {
                $("#check_submit").modal("show");

                $("#check_submit #hid_office_id").html($(this).children("p").html());
                set_table2();
            }
            else
            {
                alert("该办事处未提交，请等待。。。");
            }

        });
        $("table").on("click", ".btn-check", function() {
            $("#check_submit").modal("show");
        });
    };

    function render(){
        /**
         * 获得登陆用户权限
         */
        var groupId = $("#hid-user-groups").val();

        light.doget("/group/get", {id:groupId}, function(err, result) {
            //console.log("$$$$$$" ,result.name);
            if (result.name === '人事组') {
                /**
                 * 判断是否已经提交过
                 */
                set_table();
            }else {
                alert("您没有访问权限！");
            }
        });

    };

    function set_table(){
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
        //$(document).ready(function() {
            $('#example').dataTable( {
                "bPaginate": true,//分页按钮
                "bLengthChange": true,//每行显示记录数
                "bFilter": true,//搜索栏
                "bSort": true,//排序
                "bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "bAutoWidth": false,
                //"dom": 'lrtip'  ,//没有检索元素
                'dom': '<"float_left"f>r<"float_right"l>tip',
                "columns": [
                    {"title":"序号","mData": "ROWNUM","sDefaultContent": "","width":"20px"},
                    {"title":"办事处","mData": {},"sDefaultContent": "","width":"30px"},
                    {"title":"提交状态","mData": "SUB_CHECK_STATUS","sDefaultContent": "","width":"30px"},
                    {"title":"提交人","mData": "DECLARE_PERS","sDefaultContent": "","width":"30px"},
                    {"title":"提交时间","mData": "DECLARE_TIME","sDefaultContent": "","width":"30px"},
                    {"title":"审批状态","mData": "SUB_CHECK_STATUS","sDefaultContent": "","width":"30px"},
                    {"title":"审批人","mData": "EXAMINE_PERS","sDefaultContent": "","width":"30px"},
                    {"title":"审批时间","mData": "EXAMINE_TIME","sDefaultContent": "","width":"30px"}

                ],
                "sAjaxSource": "/performance/getAllOfficeStatus",     //指定要从哪个URL获取数据
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作

                    oSettings.jqXHR = $.ajax( {
                        "dataType": "json",
                        "type": "GET",
                        "url": sSource,
                        "success": function(json) {
                            if (json)
                            {

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

                            }else {
                                alert("查询数据失败");
                            }

                        }
                    });
                },
                "columnDefs": [
                    {
                        "targets": [0],
                        "data": "序号",
                        "render": function (data) {

                            return data;
                        }
                    },
                    {
                        "targets": [1],
                        "data": "办事处",
                        "render": function (data) {
                            var ss = "<a href='javascript:void(0);' class='sub"+data.SUB_CHECK_STATUS+"'>" + data.OFFICE_NAME +"<p hidden>"+data.OFFICE_ID+"</p>"+"</a>";
                            return ss;

                        }
                    },
                    {
                        "targets": [2],
                        "data": "提交状态",
                        "render": function (data) {
                            var ss;
                            if (data == 20 || data == 30) {
                                ss = '<i class="ace-icon glyphicon glyphicon-ok submit-status-ok"></i>';
                            } else {
                                ss = '<i class="ace-icon glyphicon glyphicon-remove submit-status"></i>';
                            }
                            return ss;

                        }
                    },
                    {
                        "targets": [4],
                        "data": "提交时间",
                        "render":function(data){
                            var time = moment(data).subtract('hours', 8).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "--";
                            }
                            return time;
                        }
                    },
                    {
                        "targets": [5],
                        "data": "审批状态",
                        "render":function(data){
                            var ss;
                            if(data == 30) {
                                ss = '<span class="label label-success arrowed-in arrowed-right" name="row-1-position">已审批</span>';
                            }else {
                                ss = '<span class="label arrowed label-warning arrowed-in-right">未审批</span>';
                            }
                            return  ss;
                        }
                    },
                    {
                        "targets": [7],
                        "data": "审批时间",
                        "render":function(data){
                            var time;
                            if (data == undefined)
                            {
                                time = "--";
                            }
                            else
                            {
                                time = moment(data).subtract('hours', 8).format('YYYY-MM-DD HH:mm');
                                if(time == "Invalid date"){
                                    time = "--";
                                }
                            }

                            return time;
                        }
                    }
                ],
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
                }


            } );

    }
    function set_table2(){

            $('#example1').dataTable( {
                "bPaginate": false,//分页按钮
                "bLengthChange": true,//每行显示记录数
                "bFilter": false,//搜索栏
                "bSort": false,//排序
                "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "bAutoWidth": false,
                "bDestroy": true,//解除数据源绑定，设置改属性后重新掉该函数可刷新datatable
                //"dom": 'lrtip'  ,//没有检索元素
                'dom': '<"float_left"f>r<"float_right"l>tip',
                "columns": [
                    {"title":"ID","mData":"ID","width":"20px","class":"hidden"},
                    {"title":"序号","mData":"ROWNUM","width":"20px"},
                    {"title":"姓名","mData":"NAME", "sDefaultContent": "","width":"20px"},
                    {"title":"员工号","mData":"CODE", "sDefaultContent": "","width":"30px"},
                    {"title":"职位","mData":"POSITION", "sDefaultContent": "","width":"20px"},
                    { "title":"入职时间","mData":"ENTRY_TIME", "sDefaultContent": "","width":"60px" },
                    { "title":"转正时间","mData":"POSITIVE_TIME", "sDefaultContent": "","width":"60px"},
                    { "title":"备注","mData":"REMARKS", "sDefaultContent": "","width":"10px" },
                    { "title":"比例","mData":"PROPORTION", "sDefaultContent": "","width":"10px" },
                    { "title":"上级比例","mData":"SUPERIORPRO", "sDefaultContent": "","width":"40px"},
                    { "title":"上级备注","mData":"REMARKSPRO", "sDefaultContent": "","width":"40px"}

                ],
                "sAjaxSource": "/performance/getEmployeeBonusInfo",     //指定要从哪个URL获取数据
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                    var start = 0,limit = 10,sSearch = "";
                    var orgId = $("#check_submit #hid_office_id").html();

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
                        "data":{
                            keyword: sSearch,
                            skip: start,
                            limit: limit,
                            orgId: orgId
                        },
                        "success": function(json) {
                            if (json)
                            {
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
                                //填充逻辑
                                return;
                            }
                            alert("查询数据失败");

                        }
                    });
                },
                "columnDefs": [
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
                                ss = moment(data).subtract('hours', 8).format('YYYY/MM/DD');
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
                                ss = moment(data).subtract('hours', 8).format('YYYY/MM/DD');
                            }else {
                                ss = '';
                            }
                            return ss;
                        }
                    },
                    {
                        "targets": [7],
                        "data": "备注",
                        "render": function (data) {
                            var ss;
                            if (data === null)
                                ss = "<span data-rel='tooltip' data-original-title=''></span>";
                            else
                                ss = "<span data-rel='tooltip' data-original-title='"+data+"'>"+data.substr(0,4)+"..."+"</span>";
                            return  ss;
                        }
                    },
                    {
                        "targets": [10],
                        "data": "上级备注",
                        "render": function (data) {
                            var ss;
                            if (data === null)
                                ss = "<span data-rel='tooltip' data-original-title=''></span>";
                            else
                                ss = "<span data-rel='tooltip' data-original-title='"+data+"'>"+data.substr(0,4)+"..."+"</span>";
                            return  ss;
                        }
                    }
                ],
                "fnInitComplete": function(oSettings, json) {
                    $("[data-rel=tooltip]").tooltip();
                    var $input_array = $("#example1 tbody tr");
                    var sum = 0;
                    for (var i = 0; i < $input_array.length; i++)
                    {
                        sum += parseFloat($input_array.eq(i).children("td").eq(9).html()==""?0:$input_array.eq(i).children("td").eq(9).html());

                    }
                    $("#pra_sum").html(sum+"%");
                },
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
                }


            } );

    }
});
