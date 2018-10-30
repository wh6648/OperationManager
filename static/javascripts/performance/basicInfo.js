/**
 * Created by apple on 15-8-25.
 */
$(function (){
    "use strict";
    var $this_change_tag;
    var table_data;
    render();
    events();


    function render(){
        set_table();
    };
    function events(){
        //点击备注编辑弹出编辑信息div
        $("#example").on("click","a.edit",function (){
            $("#change_info").modal("show");
            $this_change_tag = $(this);
            //数据传入div
            var $tr_array = $this_change_tag.parent().parent().children("td");
            $("#d_t_id").val($tr_array.eq(0).children("p").html());
            $("#d_t_code").val($tr_array.eq(1).html());
            $("#d_t_name").val($tr_array.eq(5).html());
            /*$("#d_t_position option[value="+$tr_array.eq(6).children("p").html()+"]").attr("selected",true);
            * 职级*/
            $("#d_t_rank").val($tr_array.eq(6).html());
            //归属类的ID
            $("#d_t_lei").val($tr_array.eq(4).html());
            $("#d_t_dept").val($tr_array.eq(11).html());
            $("#d_t_group").val($tr_array.eq(12).html());
            $("#d_t_manger").val($tr_array.eq(13).html());

            $("#d_t_name2").val($tr_array.eq(2).html());
            $("#d_t_o_name").find("option[value="+$tr_array.eq(3).children("p").html()+"]").attr("selected",true);
            $("#d_t_in_time").val($tr_array.eq(7).html());
            $("#d_t_change_time").val($tr_array.eq(8).html());
            $("#d_t_out_time").val($tr_array.eq(10).html());
            $("#d_t_node").val($tr_array.eq(9).children("span").data("original-title"));

            //指定插件
            /*$("#d_t_position").chosen();
            * 职级下拉*/
            $("#d_t_o_name").chosen();

            J("#d_t_in_time").calendar({ format:'yyyy-MM-dd HH:mm' });
            J("#d_t_change_time").calendar({ format:'yyyy-MM-dd HH:mm' });
            J("#d_t_out_time").calendar({ format:'yyyy-MM-dd HH:mm' });

            //去数据库查其余数据
            light.doget("/performance/getOneEmpInfo", {id:$tr_array.eq(0).children("p").html()}, function (err, result) {
                if (result) {
                    //放数据
                    //console.log(result);
                    var item = result[0];
                    $("#basic-money").val(item.CJBMONEY);
                    $("#post-money").val(item.CGWMONEY);
                    $("#scene-money").val(item.CXCMONEY);
                    $("#other-food-money").val(item.COTHERFOODMONEY);
                    $("#outside-money").val(item.CZWMONEY);
                    $("#area-money").val(item.CDQMONEY);
                    $("#other-money").val(item.COTHERSUBSIDY);
                    $("#basic-money-sum").val(item.CJBMONEYSUM);
                }else {
                    alertify.error("数据查询失败!");
                }
            });

        });
        //点击加载更多
        $(".more-btn").on("click", function (e) {
            //$(".more-info").toggleClass("more-info-dev");
            $(".more-info").toggle(
                function() {
                    $(".more-info").addClass("more-info-dev");
                },
                function() {
                    $(".more-info").removeClass("more-info-dev");
                }
            );
        });
        $("#example").on("click","a.delete",function (){
            alertify.log("暂时不支持删除！");
            //var $this=$(this);
            //var del_code = $this.parent().parent().children("td").eq(1).html();
            //var del_name = $this.parent().parent().children("td").eq(5).html();
            //var del_id = $this.parent().parent().children("td").children("p").html();
            //if (confirm("确认要删除  编号："+del_code+"--"+del_name+"？"))
            //{
            //    //对数据进行删除的逻辑
            //    light.doget("/performance/em_info_delete",{"id":del_id}, function (err, result){
            //        if (result===undefined || result.result_type===false)
            //        {
            //            alert("删除失败");
            //        }
            //        else
            //        {
            //            alert("删除成功");
            //            //重新刷新表格数据
            //            set_table();
            //        }
            //    });
            //}
            //else
            //{
            //    return false;
            //}
        });
        $("#area_cancle").on("click",function (){
            $("#change_info").modal("hide");
        });
        $("#area_ok").on("click",function (){
            //将数据入库，未做数据正确性校验
            var put_data = {
                "ID":$("#d_t_id").val(),
                "CODE":$("#d_t_code").val(),
                "ORGID":$("#d_t_o_name :selected").val(),

                /*归属类*/
                "CLEI":$("#d_t_lei").val(),
                "CDEPT":$("#d_t_dept").val(),
                "CGROUP":$("#d_t_group").val(),

                "NAME":$("#d_t_name").val(),
                "POSITION":$("#d_t_manger").val(),
                "RANK":$("#d_t_rank").val(),
                "ENTRY_TIME":$("#d_t_in_time").val(),
                "POSITIVE_TIME":$("#d_t_change_time").val(),
                "DEPARTURE_TIME":$("#d_t_out_time").val(),
                "REMARKS":$("#d_t_node").val(),

                "CJBMONEY":$("#basic-money").val(),
                "CGWMONEY":$("#post-money").val(),
                "CXCMONEY":$("#scene-money").val(),
                "COTHERFOODMONEY":$("#other-food-money").val(),
                "CZWMONEY":$("#outside-money").val(),
                "CDQMONEY":$("#area-money").val(),
                "COTHERSUBSIDY":$("#other-money").val(),
                "CJBMONEYSUM":$("#basic-money-sum").val()
            };
            //console.log(put_data);
            alertify.confirm("确定保存吗？", function(state) {
                if(state){
                    light.doput("/performance/em_info_edit", put_data, function (err, result){
                        if (result===undefined || result.result_type===false)
                        {
                            alert("修改失败"); $("#change_info").modal("hide");
                        }
                        else
                        {
                            alert("修改成功");
                            $("#change_info").modal("hide");
                            set_table();
                        }

                    });
                }else {
                    alertify.log("取消保存！");
                }
            });

        });
        $("#d_t_o_name").on("change", function (){
            $("#d_t_name2").val($(this).find("option:selected").data("value"));
        });
        $(".main-content").on("click", function (event){
            if ($(event.target).hasClass("paginate_button"))
            {
                $("[data-rel=tooltip]").tooltip();
            }
        });
    };
    function set_table(){

        //alert("此功能正在开发中！敬请期待！");

        $(document).ready(function() {

//	$('#example thead tr:eq(0) th:eq(2)').html("title!");
//	$('#example thead tr:eq(1) th:eq(2)').html("column !");
            // Wrap the colspan'ing header cells with a span so they can be positioned
            // absolutely - filling the available space, and no more.
            $('#example thead th[colspan]').wrapInner( '<span/>' ).append( '&nbsp;' );

            // Standard initialisation
            $('#example').DataTable( {
                "iDisplayLength": 15,
                "bPaginate": false,//分页按钮
                "bLengthChange": true,//每行显示记录数
                "bFilter": true,//搜索栏
                "bSort": true,//排序
                "bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
                "bAutoWidth": true,
                "bDestroy": true,
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
                        'next':       '',
                        'previous':   ''
                    },
                    'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
                    'infoEmpty': '没有数据',
                    'infoFiltered': '(过滤总件数 _MAX_ 条)'
                },
                "sAjaxSource": "/performance/getEmpInfo",     //指定要从哪个URL获取数据
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                    oSettings.jqXHR = $.ajax( {
                        "dataType": "json",
                        "type": "GET",
                        "url": sSource,
                        "success": function(json) {
                            if (json)
                            {
                                //console.log(json);
                                table_data = json.data.data;
                                var o_list = json.data.o_list;

                                if (o_list!=undefined)
                                {
                                    //填充列表
                                    var $list = $("#d_t_o_name");
                                    for (var i = 0; i < o_list.length; i++)
                                    {
                                        $list.append("<option data-value="+o_list[i].NAME+" value="+o_list[i].ID+">"+o_list[i].O_NAME+"</option>");
                                    }
                                }

                                fnCallback( {

                                    iTotalRecords: table_data.length          //json.data.totalItems
                                    , iTotalDisplayRecords: table_data.length  //json.data.totalItems
                                    , aaData: table_data

                                });
                                return ;
                            }
                            alert("查询数据失败");
                        }
                    });
                },
                "columns": [
                    {"mData": "ID"},
                    {"mData": "CODE"},
                    {"mData": "NAME2"},
                    {"mData": {}},//办事处代办
                    {"mData": "CLEI","sDefaultContent": ""},
                    {"mData": "NAME"},
                    {"mData": "RANK"/*{}职级下拉*/},//职级代办
                    {"mData": "ENTRY_TIME","sDefaultContent": ""},
                    {"mData": "POSITIVE_TIME","sDefaultContent": ""},
                    {"mData": "REMARKS","sDefaultContent": ""},
                    {"mData": "DEPARTURE_TIME","sDefaultContent": ""},
                    {"mData": "CDEPT","sDefaultContent": "","class":"hidden"},
                    {"mData": "CGROUP","sDefaultContent": "","class":"hidden"},
                    {"mData": "POSITION","sDefaultContent": "","class":"hidden"}
                ],
                "fnInitComplete": function(oSettings, json) {
                    $("[data-rel=tooltip]").tooltip();
                },
                responsive: true,
                paging: true,
                "columnDefs": [
                    {
                        "targets": [0],
                        "data": "操作",
                        "render": function (data) {
                            var aa = "<a href=\"#\"  class=\" edit\">编辑</a>";
                            var ss = "<a href=\"#\"  class=\" delete\">删除</a>";
                            var hid_data = "<p hidden>"+data+"</p>";
                            return aa + ss + hid_data;
                        }
                    },
                    {
                        "targets": [3],
                        "data": "办事处",
                        "render": function (data) {
                            var a = '';
                            var hid_data = "<p hidden></p>";
                            if (data) {
                                a = data.O_NAME !== null ? data.O_NAME : '';
                                hid_data = "<p hidden>"+(data.ORGID !== null ? data.ORGID : "")+"</p>";
                            }

                            return a + hid_data;
                        }
                    },
                    {
                        "targets": [6],
                        "data": "职级",
                        "render": function (data) {
                            /*var r;
                            var hid_data = "<p hidden>"+data.POSITION+"</p>";
                            switch(data.POSITION)
                            {
                                case '10':r="员工";break;
                                case '20':r="办事处主管";break;
                                case '30':r="区域主管";break;
                                default:r="未知等级";break;
                            }
                            return  r+hid_data;
                             职级下拉*/
                            return data;
                        }
                    },
                    {
                        "targets": [7],
                        "data": "入职时间",
                        "render": function (data) {
                            var time = moment(data).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "";
                            }
                            return  time;
                        }
                    },
                    {
                        "targets": [8],
                        "data": "转正时间",
                        "render": function (data) {
                            var time = moment(data).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "";
                            }
                            return  time;
                        }
                    },
                    {
                        "targets": [9],
                        "data": "备注",
                        "render": function (data) {
                            var ss='';
                            if (data != null)
                                ss = "<span data-rel='tooltip' data-original-title='"+data+"'>"+data.substr(0,4)+"..."+"</span>";
                            return  ss;
                        }
                    },
                    {
                        "targets": [10],
                        "data": "离职时间",
                        "render": function (data) {
                            var time = moment(data).format('YYYY-MM-DD HH:mm');
                            if(time == "Invalid date"){
                                time = "";
                            }
                            return  time;
                        }
                    },
                    {
                        "targets": [13],
                        "data": "主管/员工",
                        "render": function (data) {
                            var aa;
                            if(data) {
                                if(data == 10) {
                                    aa = '员工';
                                }else if(data == 20) {
                                    aa = '主管';
                                }else {
                                    aa = ''
                                }
                            }else {
                                aa = '';
                            }
                            return  aa;
                        }
                    }
                ]

            } );
        } );

    }
});