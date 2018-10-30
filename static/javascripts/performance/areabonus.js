/**
 * Created by wsights01 on 15-7-30.
 */
$(function(){


    "use strict";
    events();
    render();

   function events(){
       $(".main-content").on("click", function (event){
           if ($(event.target).hasClass("paginate_button"))
           {
               $("[data-rel=tooltip]").tooltip();
           }
       });


       //$(".year-select ul li a").on("click", function() {
       //    $(".year-select ul li a").removeClass("active");
       //    $(this).addClass("active");
       //    var year = $(".year-select ul li a.active").html();
       //    var quarter = $(".select-quarter a.active").html();
       //    set_table(year,quarter,$("#hid-user").val());
       //});

       $(".select-quarter a").on("click", function() {

           $(".select-quarter a").removeClass("active");
           $(this).addClass("active");
           var year = $(".year-select ul li a.active").html();
           var quarter = $(".select-quarter a.active").html();
           set_table(year,quarter,$("#hid-user").val());
       });
   }

   function render(){
       var groupId = $("#hid-user-groups").val();

       light.doget("/group/get", {id:groupId}, function(err, result) {
           if (result.name === '区域组'/* ||
               result.name === '区商务组' ||
               result.name === '区箱管组' ||
               result.name === '区运管组' ||
               result.name === '区船管组'*/
           ) {
               //获得当前 年－季度/月
               var quarter,year,areaId=$("#hid-user").val();
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

                   set_table(year,quarter,areaId);
               });
           }else{
               $(".main-content").html("没有权限");
               alert("您没有权限进行该操作");
           }
       });
   }

    function set_table(year,quarter,areaId){
        switch (quarter)
        {
            case '一季度':{quarter=1;}break;
            case '二季度':{quarter=2;}break;
            case '三季度':{quarter=3;}break;
            case '四季度':{quarter=4;}break;
            default:{alert("年份选择错误！");return ;}break;
        }

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
                "bPaginate": true,//开启分页功能
                "bLengthChange": false,//每行显示记录数
                "bFilter": true,//搜索栏
                "bSort": true,//排序
                "bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "bAutoWidth": false,
                "aLengthMenu": [15],//每页现实的条目数
                "bDestroy": true,
                //"dom": 'lrtip'  ,//没有检索元素
                'dom': '<"float_left"f>r<"float_right"l>tip',
                'language': {
                    'emptyTable': '没有数据',
                    'loadingRecords': '加载中...',
                    'processing': '查询中...',
                    'search': '检索:',
                    'lengthMenu': '每页 _MENU_ 人',
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
                "columns": [
                    {"title":"序号","mData": "ROWNUM","width":"50px", "sDefaultContent": ""},
                    {"title":"办事处","mData": "OFFICE_NAME","width":"100px", "sDefaultContent": ""},
                    {"title":"姓名","mData": "NAME","width":"50px", "sDefaultContent": ""},
                    { "title":"入职时间","mData": "ENTRY_TIME","width":"150px" , "sDefaultContent": ""},
                    { "title":"转正时间","mData": "POSITIVE_TIME","width":"150px", "sDefaultContent": ""},
                    { "title":"比例","mData": "PROPORTION","width":"50px", "sDefaultContent": ""},
                    { "title":"上级比例","mData": "SUPERIORPRO","width":"100px" , "sDefaultContent": ""},
                    { "title":"备注","mData": "REMARKS","width":"150px" , "sDefaultContent": ""},
                    { "title":"上级备注","mData": "REMARKSPRO","width":"150px" , "sDefaultContent": ""},
                    { "title":"奖金","mData": "HS_AWARD","width":"50px" , "sDefaultContent": ""}

                ],
                "sAjaxSource": "/performance/showBonusByArea",     //指定要从哪个URL获取数据
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                    oSettings.jqXHR = $.ajax( {
                        "dataType": "json",
                        "type": "GET",
                        "url": sSource,
                        "data":{
                            "year": year,
                            "quarter": quarter,
                            "areaId":areaId
                        },
                        "success": function(json) {
                            console.log(json);
                            if (json)
                            {
                                //console.log(json)

                                var b = json.data.result_type;
                                if (b == 1)
                                {
                                    var a = json.data.result_data;
                                    fnCallback( {

                                        iTotalRecords: a.length          //json.data.totalItems
                                        , iTotalDisplayRecords: a.length  //json.data.totalItems
                                        , aaData: a

                                    });
                                }
                                else {
                                    alert("查询数据失败");
                                }

                            }
                            else{
                                alert("查询数据失败");
                            }

                        }
                    });
                },
                "fnInitComplete": function(oSettings, json) {
                    $("[data-rel=tooltip]").tooltip();
                },
                "columnDefs": [
                    {
                        "targets": [0],
                        "data": "序号",
                        "render": function (data) {
                            return  data;
                        }
                    },
                    {
                        "targets": [1],
                        "data": "办事处",
                        "render": function (data) {

                            return  data;
                        }
                    },
                    {
                        "targets": [3],
                        "data": "入职时间",
                        "render": function (data) {
                            var time = moment(data).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "--";
                            }
                            return  time;
                        }
                    },
                    {
                        "targets": [4],
                        "data": "转正时间",
                        "render": function (data) {
                            var time = moment(data).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "--";
                            }
                            return  time;
                        }
                    },
                    {
                        "targets": [7],
                        "data": "备注",
                        "render": function (data) {
                            var ss='';
                            if (data != null)
                                ss = "<span data-rel='tooltip' data-original-title='"+data+"'>"+data.substr(0,4)+"..."+"</span>";
                            return  ss;
                        }
                    },
                    {
                        "targets": [8],
                        "data": "上级备注",
                        "render": function (data) {
                            var ss='';
                            if (data != null) {
                                ss = "<span data-rel='tooltip' data-original-title='"+data+"'>"+data.substr(0,4)+"..."+"</span>";
                            }else {
                                ss = "";
                            }

                            return  ss;
                        }
                    },
                    {
                        "targets": [9],
                        "data": "奖金",
                        "render": function (data) {
                            var ss='';
                            if (data != null) {
                                ss = data.toFixed(2);
                            }else {
                                ss = "";
                            }

                            return  ss;
                        }
                    }
                ]
            } );

        } );
    }
});