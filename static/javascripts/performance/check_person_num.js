/**
 * Created by apple04 on 15/9/7.
 */
$(function(){

    render();

    function render(){
        var groupId = $("#hid-user-groups").val();
        //                orgId = $("#hid-user").val();
        light.doget("/group/get", {id: groupId}, function (err, result) {
            if (result.name === '人事组') {
                events();
                getPersonNumberRender();
            } else {
                alert("您没有权限进行该操作");
            }
        });

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

    function getPersonNumberRender(){
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
        var count = 0;
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
            "sAjaxSource": "/performance/checkTubeBusinessPersonNumber",
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
                        fnCallback( {
                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData
                        });

                    }
                });
            },
            "columns": [
                {"title":"序号"},
                {"title":"公司", "mData": "COMPANY_NAME"},
                {"title":"区域", "mData": "INDEXAREA_NAME"},
                { "title":"办事处", "mData":"OFFICE_NAME"},
                { "title":"商务人数", "mData":"EX_COMMERCE_NUMBER"},
                { "title":"箱管人数", "mData":"EX_TUBE_NUMBER"}
            ],
            "columnDefs": [
                {
                    "targets": [0],
                    "data": "序号",
                    "render": function () {
                        return ++count;
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
