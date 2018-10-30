/**
 * Created by chao on 15/8/25.
 */
$(function() {
    var state;
    var InterValObj; // timer变量，控制时间
    events();
    render();

    function render(){
        light.doget("/performance/getCompanyRelation", function(err, result){
            for(var i=0;i<result.length;i++){
                $("#select_company").append("<li class='' id='"+result[i].ID+"'><a data-toggle='tab' href='#home4'>"+result[i].NAME+"</a></li>");
            }
            $("#"+result[0].ID).addClass("active");

        });

        //获得当前 年－季度/月
        var quarter_month,year;
        light.doget("/performance/getNowTime", function(err, result) {
            quarter_month = result[0].QUARTER;
            year = result[0].YEARS;
            //1.给年份负值,2.当前年被选中
            $("#year").html(year);
            $("#year_n").html(parseInt(year) + 1);
            $("#year_2n").html(parseInt(year) + 2);
            $("#year").addClass("active");

            //让当前 季度 选中
            if (quarter_month === "1") {
                $("#quarter_1").addClass("active");
            } else if (quarter_month === "2") {
                $("#quarter_2").addClass("active");
            } else if (quarter_month === "3") {
                $("#quarter_3").addClass("active");
            } else {
                $("#quarter_4").addClass("active");
            }
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    searchState(year,quarter_month);
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

    }

    function searchState(year,quarter_month){
        light.doget("/officeSet/getOfficeSetState",{year:year, quarter_month:quarter_month}, function(err, result) {

            if(result.length == 0){
                alertify.alert("该季度暂无数据!");
            }else{
                if(state == 1){
                    window.clearInterval(InterValObj); // 停止计时器
                    $("#keepBonus").addClass("hidden");
                    $("#subBonus").addClass("hidden");
                    state = result[0].MANAGER_COEFFICIENT_STATUS;
                    showTable(year,quarter_month,state);
                }else {
                    state = result[0].MANAGER_COEFFICIENT_STATUS;
                    showTable(year,quarter_month,state);
                }
            }

        });

    }

    //定时执行一遍保存
    InterValObj = window.setInterval(saveOfficeSet, 5000*60); // 启动计时器，5秒执行一次


    function showTable(year,quarter_month,state){

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
                "sAjaxSource": "/officeSet/getOfficeSet",
                "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                    oSettings.jqXHR = $.ajax( {
                        "dataType": "json",
                        "type": "GET",
                        "url":sSource ,
                        "data": {
                            "year": year,
                            "quarter_month": quarter_month
                            //,"companyId": companyId
                        },
                        "success": function(json) {
                            var resultData = json.data;
                            var totalItems = json.data.length;
                            //console.log("dddddd",resultData);
                            fnCallback( {
                                iTotalRecords: totalItems          //json.data.totalItems
                                , iTotalDisplayRecords: totalItems //json.data.totalItems
                                , aaData: resultData
                            });

                        }
                    });
                },
                "columns": [
                    //{"title":"id", "mData": "OFFICE_ID","class":"hidden"},
                    {"title":"responsibleId", "mData": "MANAGER_ID","class":"hidden"},
                    {"title":"办事处","width":"80px", "mData": "OFFICE_NAME"},
                    {"title":"办事处主管","width":"80px", "mData": "NAME"},
                    { "title":"系数","orderDataType": "dom-text","width":"80px", "mData":"COEFFICIENT"},
                    { "title":"备注","orderDataType": "dom-text" ,"width":"80px", "mData":"COEFFICIENT_REMARKS"}
                ],
                "columnDefs": [
                    {
                        "targets": [3],
                        "data": "系数",
                        "render": function (data) {
                            if(data == null){
                                data = "";
                            }
                            var ss;
                            if(state == 0){
                                 ss = "<input type='text' class='edit-input' value='"+data+"'/>";
                            }else{
                                ss = "<input type='text' readonly ='readonly' class='edit-input' value='"+data+"'/>";
                            }

                            return  ss;
                        }
                    },
                    {
                        "targets": [4],
                        "data": "备注",
                        "render": function (data) {
                            var ss;
                            var value;
                            if(data == null){
                                value = ""
                            }else{
                                value = data;
                            }
                            if(state == 0){
                                ss = "<input type='text' class='edit-input note_input_tag' value='"+value+"' />";

                            }else{
                                ss = "<input type='text'  readonly ='readonly' class='edit-input note_input_tag' value='"+value+"'/>";
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
        } );
    }




    function saveOfficeSet(style){
        var timeOutFlag = 0;

        if(style === undefined) {
            style = 'save';
            timeOutFlag = 1;
        }

        var year = $(".year-select ul li a.active").html();
        var quarter_month = $(".select-quarter a.active").attr("role-type");

        var MANAGER_ID,COEFFICIENT,COEFFICIENT_REMARKS;
        var array = [];
        $("#example tbody tr").each(function(){
            MANAGER_ID = $(this).children("td").eq(0).html();
            COEFFICIENT = $(this).children("td").eq(3).children("input").val();
            COEFFICIENT_REMARKS = $(this).children("td").eq(4).children("input").val();
            array.push({MANAGER_ID:MANAGER_ID, COEFFICIENT:COEFFICIENT, COEFFICIENT_REMARKS:COEFFICIENT_REMARKS, year:year, quarter_month:quarter_month});
        });
        light.doput("/officeSet/saveOfficeSet" ,{array: array}, function(err, result) {
            var year = $(".year-select ul li a.active").html();
            var quarter_month = $(".select-quarter a.active").attr("role-type");
            if(style == "commit"){
                window.clearInterval(InterValObj); // 停止计时器
                setOfficeSetState(year,quarter_month);
            }else if(style == "save" && timeOutFlag === 0){
                alertify.success("保存成功！");
                searchState(year,quarter_month);
            }else {
                searchState(year,quarter_month);
                return;
            }

        });

    }

    function setOfficeSetState(year,quarter_month){
        light.doput("/officeSet/setOfficeSetState" ,{year: year,quarter_month:quarter_month}, function(err, result) {
            alertify.success("提交成功！");
            searchState(year,quarter_month);
        });
    }

    function events(){

        $("#subBonus").on("click",function(){
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    alertify.confirm("该操作不可逆，是否确定提交？", function(e) {
                        if(e) {
                            var style = "commit";
                            saveOfficeSet(style);

                        }else {
                            alertify.log("已取消提交！");
                        }
                    });
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

        $("#keepBonus").on("click",function(){
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    if(state == 1){
                        alertify.alert("不可保存！");
                    }else{
                        alertify.confirm("是否确定保存？", function(e) {
                            if(e) {
                                var style = "save";
                                saveOfficeSet(style);

                            }else {
                                alertify.log("已取消保存！");
                            }
                        });
                    }
                }else {
                    alert("您没有访问权限！");
                }
            });

        });

        $(".year-select ul li a").on("click", function() {
            $(".year-select ul li a").removeClass("active");
            $(this).addClass("active");
        });

        $(".select-quarter a").on("click", function() {

            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
            var year = $(".year-select ul li a.active").html();
            var quarter_month = $(".select-quarter a.active").attr("role-type");
            /**
             * 获得登陆用户权限
             * －主管
             * －哪个办事处的
             */
            var groupId = $("#hid-user-groups").val();

            light.doget("/group/get", {id:groupId}, function(err, result) {
                if (result.name === '人事组') {
                    searchState(year,quarter_month);
                }else {
                    alert("您没有访问权限！");
                }
            });

           // tabRender(year,quarter);
        });

    }
});
