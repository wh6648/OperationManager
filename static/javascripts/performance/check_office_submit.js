/**
 * Created by wsights on 15-7-30.
 */
$(function (){
    "use strict";
    events();
    render();
    var InterValObj; // timer变量，控制时间
    var get_data = new Array();//查询的返回数据
    var tr_num = 0;
    var _datatable;
    var orgId;
    var manager_num = 0;
    var coefficient = 0;
    var coe_num = 0;
    var all_manager_money = 0;

    function events(){

        $("#btn-copy").on("click", function(err) {
            var table = $("#example1 tr:has(.edit-input)");

            //判断是否由主管
            if (manager_num === 0) {
                for(var i = 0 ; i < table.length; i++) {
                    table.eq(i).children("td").eq("9").children("input").val(table.eq(i).children("td").eq("8").html());
                    //算钱
                    table.eq(i).children("td").eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt(table.eq(i).children("td").eq("9").children("input").val()) / 100);
                }
            }else {
                for(var i = 0 ; i < table.length; i++) {
                    table.eq(i).children("td").eq("9").children("input").val(table.eq(i).children("td").eq("8").html());
                    //算钱
                    table.eq(i).children("td").eq(11).html((parseInt($("#check_submit #hid_office_money").html()) - parseInt($("#check_submit #hid_all_manager_money").html())) * parseInt(table.eq(i).children("td").eq("9").children("input").val()) / 100);
                }
            }

            //算总和
            var $input_array = $("#example1 .edit-input");
            var sum = 0;
            for (var i = 0; i < $input_array.length; i++)
            {
                sum += parseFloat($input_array.eq(i).val()==""?0:$input_array.eq(i).val());

            }
            console.log(sum)
            $("#pra_sum").html(sum+"%");

        });

        //点击审批按钮
        $("table").on("click", ".btn-check", function() {
            var $this = $(this);
            var orgId = $this.parent().parent().children("td").eq(1).children("a").children("p").html();
            $("#check_submit").modal("show");
            $("#check_submit #hid_office_id").html(orgId);

            //查这个组织分得的钱
            light.doget("/performance/getOfficeMoney", {orgId:orgId}, function(err, result) {
                //console.log("$$$$result:",result[0].TRUE_TOTAL);
                $("#check_submit #hid_office_money").html(result[0].TRUE_TOTAL);
            });

            set_table2();

            //定时执行一遍保存
            InterValObj = window.setInterval(saveFun, 5000*60); // 启动计时器，5秒执行一次
        });

        //点击催办按钮
        $("table").on("click", ".btn-warning", function (e) {
            var $this = $(this);
            var orgId = $this.parent().parent().children("td").eq(1).children("a").children("p").html();
            //发送消息
            light.doget("/performance/setMessageForOffice", {orgId:orgId}, function (err, result) {
                if(result) {
                    if ((result.split("&"))[0].split("=")[1] == 0) {
                        alertify.success("短信发送成功！");
                    }else{
                        alertify.error("短信发送失败！");
                    }

                }else {
                    alertify.error("短信发送失败！");
                }
            });
        });

        //当弹出的层hide的时候，触发一些动作
        $('#check_submit').on('hide.bs.modal', function () {
            window.clearInterval(InterValObj); // 停止计时器
        });

        $("#example1").on("change", ".edit-input", function (){
            var $this = $(this);//this对象

            if ($this.val().match(/^\d+(\.\d+)?$/)) {
                var table = $("#example1 tr:has(.edit-input)");

                //判断是否由主管
                if (manager_num === 0) {
                    for(var i = 0 ; i < table.length; i++) {
                        //算钱
                        table.eq(i).children("td").eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt(table.eq(i).children("td").eq("9").children("input").val()) / 100);
                    }
                }else {
                    for(var i = 0 ; i < table.length; i++) {
                        //算钱
                        table.eq(i).children("td").eq(11).html((parseInt($("#check_submit #hid_office_money").html()) - parseInt($("#check_submit #hid_all_manager_money").html())) * parseInt(table.eq(i).children("td").eq("9").children("input").val()) / 100);
                    }
                }

                //算总和
                var $input_array = $("#example1 .edit-input");
                var sum = 0;
                for (var i = 0; i < $input_array.length; i++)
                {
                    sum += parseFloat($input_array.eq(i).val()==""?0:$input_array.eq(i).val());

                }
                sum = Math.round(sum);
                $("#pra_sum").html(sum+"%");
            }
            else
            {
                {
                    alert("请输入正确的数字");
                    $this.trigger("focus").trigger("select");
                }
            }
        });
        $("#example1").on("blur", ".edit-input", function (){
            var $this = $(this);
            if (!$this.val().match(/^\d+(\.\d+)?$/))
            {
                alert("请输入正确的数字");
                $this.trigger("focus").trigger("select");
            }
        });
        $("#btn-copy").on("mouseover", function () {
            $("[data-rel=tooltip]").tooltip();
        });

        //点击保存按钮
        $("#check_save_button").on("click", function(event) {
            var save = 1;
            saveFun(save);
        });

        //点击提交按钮
        $("#check_sub_button").on("click", function (){
            var $input_array = $("#example1 .edit-input");
            for (var i = 0; i < $input_array.length; i++)
            {
                if (!$input_array.eq(i).val().match(/^\d+(\.\d+)?$/))
                {
                    alert("请输入正确的数字");
                    return ;
                }
            }
            var table = $("#example1 tbody tr");
            var row_tr = $("#example1 tr:has(.edit-input)");
            var sql_data = new Array();

            var size = proportionalSize();

            if(size == '<'){
                alert("比例合计小于100%！");
                return;
            }
            if(size == '>') {
                alert("比例合计大于100%！");
                return;
            }

            //先判断是否可以修改
            light.doget("/performance/panduanStatus", {"orgId":$("#check_submit #hid_office_id").html()}, function(err, result) {
                if(err){
                    alert("查询有误！")
                }else {
                    if (result[0].SUB_CHECK_STATUS === '30') {
                        alert("已经审批过！不可以再修改！")
                    } else if (result[0].SUB_CHECK_STATUS === '10') {
                        alert("该办事处还没有申报！不可审批！请催办！")
                    } else {
                        //提交之前会重新算一遍钱
                        var user_name = $(".user-info").children("small").eq(1).html();
                        var orgId = $("#check_submit #hid_office_id").html();
                        //去数据库查出该办事处分的钱数
                        light.doget("/performance/getOfficeMoney", {orgId:orgId}, function(err, result) {
                            if (result) {
                                $("#check_submit #hid_office_money").html(result[0].TRUE_TOTAL);

                                var $tr_array = $("#example1 tbody tr");
                                for (var i = 0; i < manager_num; i++)
                                {
                                    var $td = $tr_array.eq(i).children("td");
                                    var manager_money = 0;
                                    if ($td.eq(4).html() == '主管')
                                    {
                                        //算钱
                                        //该主管钱=办事处总钱*(该主管系数*100/(总人数－主管人数))/(所有主管的系数*100/(总人数-主管人数)+100)
                                        manager_money = (parseInt($("#check_submit #hid_office_money").html())) * (parseInt($td.eq(8).children("p").html()) * 100 / ($tr_array.length - manager_num)) / (parseInt($("#check_submit #hid_office_coefficient").html()) * 100 / ($tr_array.length - manager_num) + 100);
                                        //console.log("主管manager_money:",manager_money);
                                        //放钱
                                        $td.eq(11).html(manager_money);
                                        all_manager_money += parseInt(manager_money);
                                        //所有主管的钱
                                        $("#check_submit #hid_all_manager_money").html(all_manager_money);
                                    }
                                }
                                //员工的钱
                                for(var i = manager_num; i < $tr_array.length; i++){
                                    var $td = $tr_array.eq(i).children("td");
                                    if(manager_num === 0) {
                                        //员工的钱＝办事处所有钱 * 员工比(比如30) / 100
                                        $td.eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt($td.eq(9).children("input").val()) / 100);
                                    }else {
                                        //员工的钱＝办事处所有钱 * 员工比(比如30) / (所有主管的系数*100/(总人数-主管人数)+100)
                                        $td.eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt($td.eq(9).children("input").val()) / (parseInt($("#check_submit #hid_office_coefficient").html()) * 100 / ($tr_array.length - manager_num) + 100));
                                    }

                                    if (i == $tr_array.length - 1) {
                                        //员工的数组
                                        for (var i = 0; i < table.length; i++)
                                        {
                                            if (i < manager_num) {
                                                sql_data[i] = {
                                                    "ID": table.eq(i).children("td").eq("0").html(),
                                                    "SUPERIORPRO":'0',
                                                    "REMARKSPRO":table.eq(i).children("td").eq("10").children("input").val(),
                                                    "MONEY":table.eq(i).children("td").eq("11").html()
                                                };
                                            }else {
                                                sql_data[i] = {
                                                    "ID": table.eq(i).children("td").eq("0").html(),
                                                    "SUPERIORPRO":table.eq(i).children("td").eq("9").children("input").val(),
                                                    "REMARKSPRO":table.eq(i).children("td").eq("10").children("input").val(),
                                                    "MONEY":table.eq(i).children("td").eq("11").html()
                                                };
                                            }
                                        }

                                        //console.log("#####sql_data",sql_data);
                                        //入库
                                        light.doput("/performance/areaCheckPut", {
                                            "req_data": sql_data,
                                            "orID": $("#check_submit #hid_office_id").html(),
                                            "u_na": user_name
                                        }, function (err, result) {

                                            if (!result) {
                                                alert("数据错误！")
                                            } else {
                                                if (result.result) {
                                                    alertify.success("数据修改成功");
                                                    //给上级发一个消息提醒
                                                    light.doput("/performance/setMessageForManager", {content:"上级已审批",orgId:orgId},function(err, result){
                                                        if(result.result === true) {
                                                            alertify.success("消息提醒发送成功！");
                                                        }else {
                                                            alertify.error("消息提醒失败！");
                                                        }
                                                        window.location = "/site/check_office_submit?name=绩效考核";
                                                    });
                                                }
                                                else {
                                                    alertify.error("数据修改失败");
                                                    window.location = "/site/check_office_submit?name=绩效考核";
                                                }

                                            }

                                        });
                                    }
                                }
                            }
                        });

                    }
                }
            });


        });
    };

    function render(){

        var quarter,years;
        light.doget("/performance/getNowTime", function(err, result){
            quarter = result[0].QUARTER;
            years = result[0].YEARS;
            $("#navi").html("("+years+"年"+quarter+")");
        });
        /**
         * 获得登陆用户权限
         * －主管
         * －哪个办事处的
         */
        var groupId = $("#hid-user-groups").val();
        orgId = $("#hid-user").val();
        light.doget("/group/get", {id:groupId}, function(err, result) {
            if (result.name === '区域组') {
                set_table();
            }else{
                alert("您没有权限进行该操作");
            }
        });

        //$.left_time_show(600000);
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
        $('#example').dataTable( {
            "bPaginate": true,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": true,//搜索栏
            "bSort": true,//排序
            "bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
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
            "sAjaxSource": "/performance/officeSubmitStatusGet",     //指定要从哪个URL获取数据
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "data":{"orgId":orgId},
                    "success": function(json) {

                        //console.log("$$$",json);

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

                        } else {
                            alert("查询数据失败");
                        }

                    }
                });
            },
            "columns": [
                {"title":"序号","mData": "ROWNUM","sDefaultContent": "","width":"20px","class":"hidden"},
                {"title":"办事处","mData": {},"sDefaultContent": "","width":"30px"},
                {"title":"提交状态","mData": "SUB_CHECK_STATUS","sDefaultContent": "","width":"30px"},
                {"title":"提交时间","mData": "DECLARE_TIME","sDefaultContent": "--","width":"30px"},
                {"title":"提交人","mData": "DECLARE_PERS","sDefaultContent": "--","width":"30px"},
                {"title":"审批状态","mData": "SUB_CHECK_STATUS","sDefaultContent": "","width":"30px"},
                {"title":"操作","mData": {},"width":"30px"}

            ],
            "columnDefs": [
                {
                    "targets": [1],
                    "data": "办事处",
                    "render": function (data) {
                        var ss = "<a href='javascript:void(0);'>" + data.NAME +"<p hidden>"+data.OFFICE_ID+"</p>"+"</a>";
                        return ss;

                    }
                },
                {
                    "targets": [2],
                    "data": "提交状态",
                    "render": function (data) {
                        var ss;
                        if (data == 20) {
                            ss = '<i class="ace-icon glyphicon glyphicon-ok submit-status-ok"></i>';
                        }
                        if (data == 30) {
                            ss = '<i class="ace-icon glyphicon glyphicon-ok submit-status-ok"></i>';
                        }
                        if ((data == 10 || "")) {
                            ss = '<i class="ace-icon glyphicon glyphicon-remove submit-status"></i>';
                        }
                        return ss;

                    }
                },
                {
                    "targets": [3],
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
                    "targets": [6],
                    "data": "操作",
                    "render": function (data) {
                        var ss,tt;
                        if (data.SUB_CHECK_STATUS == 10)
                        {
                            ss = "<button class=\"btn btn-xs btn-warning\" title=\"催办\">催办<i class=\"ace-icon fa fa-bell icon-animated-bell\"></i></button>";
                            tt = "<button class=\"btn btn-xs btn-info btn-check\" disabled=true title=\"审批\">审批<i class=\"ace-icon fa fa-pencil bigger-120\"></i></button>";
                        }
                        if (data.SUB_CHECK_STATUS == 20 || data.SUB_CHECK_STATUS == 30)
                        {
                            ss = "<button class=\"btn btn-xs btn-warning\" disabled=true title=\"催办\">催办<i class=\"ace-icon fa fa-bell icon-animated-bell\"></i></button>";
                            tt = "<button class=\"btn btn-xs btn-info btn-check\" title=\"审批\">审批<i class=\"ace-icon fa fa-pencil bigger-120\"></i></button>";
                        }
                        if (data.NAME === '财务主管') {
                            ss = "<button class=\"btn btn-xs btn-warning\" title=\"催办\">催办<i class=\"ace-icon fa fa-bell icon-animated-bell\"></i></button>";
                            tt = "<button class=\"btn btn-xs btn-info btn-check\" title=\"审批\">审批<i class=\"ace-icon fa fa-pencil bigger-120\"></i></button>";
                        }
                        return  ss+tt;
                    }
                }
            ]

        } );
    }

    function set_table2(param){
        var name_index = 0;

        _datatable = $('#example1').dataTable( {
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": true,//搜索栏
            "bSort": false,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "bDestroy": true,//解除数据源绑定，设置改属性后重新掉该函数可刷新datatable
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
            "columns": [
                {"title":"ID","mData":"ID","sDefaultContent": "","width":"20px","class":"hidden"},
                {"title":"序号","mData":"","sDefaultContent": "","width":"40px"},
                {"title":"姓名","mData":"NAME", "sDefaultContent": "","width":"40px"},
                {"title":"员工号","mData":"CODE", "sDefaultContent": "","width":"40px"},
                {"title":"职位","mData":"POSITION", "sDefaultContent": "","width":"30px"},
                { "title":"入职时间","mData":"ENTRY_TIME", "sDefaultContent": "","width":"60px" },
                { "title":"转正时间","mData":"POSITIVE_TIME", "sDefaultContent": "","width":"60px"},
                { "title":"备注","mData":"REMARKS", "sDefaultContent": "","width":"50px" },
                { "title":"比例(%)","mData":{}, "sDefaultContent": "","width":"40px" },
                { "title":"上级比例(%)","mData":{}, "sDefaultContent": "","width":"50px" },
                { "title":"上级备注","mData":"REMARKSPRO", "sDefaultContent": "","width":"40px"},
                { "title":"奖金/元","mData":"", "sDefaultContent": "","width":"40px","class":'hidden'}

            ],
            "sAjaxSource": "/performance/getEmployeeBonusAndManagerInfo",     //指定要从哪个URL获取数据
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
                                manager_num = 0;
                                for(var m=0;m<json.data.length;m++) {
                                    if(json.data[m].POSITION == '20') {
                                        manager_num++;
                                    }
                                }
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
                    "targets": [1],
                    "data": "序列",
                    "render": function (data){
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
                        }else if (data === '20') {
                            ss = '主管';
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
                    "targets": [8],
                    "data": "比例",
                    "render": function (data) {

                        //console.log("data:",data);
                        if(data.POSITION == '20' && coe_num < manager_num) {
                            coefficient += parseInt(data.PROPORTION);
                            //$("#check_submit #hid_office_coefficient").html(coefficient);
                            coe_num++;
                        }
                        $("#check_submit #hid_office_coefficient").html(coefficient);

                        return  data.PROPORTION;
                    }
                },
                {
                    "targets": [9],
                    "data": "上级比例",
                    "render": function (data) {
                        var ss;

                        //if (name_index == 1) {
                        //    ss = '';
                        //}
                        //else {
                            var s = data.PROPORTION==null?0:data.PROPORTION;
                            if(data.SUPERIORPRO) {
                                ss = "<input type=\"text\" class='edit-input' value='" + data.SUPERIORPRO + "'>";
                            }else {
                                ss = "<input type=\"text\" class='edit-input' value='"+s+"'>";
                            }
                        //}
                        return  ss;
                    }
                },
                {
                    "targets": [10],
                    "data": "上级备注",
                    "render": function (data) {
                        var ss;
                        if(data) {
                            ss = "<input type=\"text\" class='edit-input2 note_input_tag' value='"+data+"'>";
                        }else {
                            ss = "<input type=\"text\" class='edit-input2 note_input_tag' value=''>";
                        }

                        return  ss;
                    }
                },
                {
                    "targets": [11],
                    "data": "奖金",
                    "render": function (data) {
                        var ss;
                        if(data) {
                            ss = '';
                        }else {
                            ss = "";
                        }

                        return  ss;
                    }
                }
            ],
            "fnInitComplete": function(oSettings, json) {

                var $tr_array = $("#example1 tbody tr");

                for (var i = 0; i < manager_num; i++)
                {
                    var $td = $tr_array.eq(i).children("td");
                    var manager_money = 0;
                    if ($td.eq(4).html() == '主管')
                    {
                        //算钱
                        //该主管钱=办事处总钱*该主管系数/(总人数-主管人数+所有主管的系数)
                        //manager_money = (parseInt($("#check_submit #hid_office_money").html())) * (parseInt($td.eq(8).html())) / ($tr_array.length - manager_num + parseInt($("#check_submit #hid_office_coefficient").html()))
                        //该主管钱=办事处总钱*(该主管系数*100/(总人数－主管人数))/(所有主管的系数*100/(总人数-主管人数)+100)
                        manager_money = (parseInt($("#check_submit #hid_office_money").html())) * (parseInt($td.eq(8).html()) * 100 / ($tr_array.length - manager_num)) / (parseInt($("#check_submit #hid_office_coefficient").html()) * 100 / ($tr_array.length - manager_num) + 100);
                        //放钱
                        $td.eq(11).html(manager_money);

                        all_manager_money += parseInt(manager_money);
                        //所有主管的钱
                        $("#check_submit #hid_all_manager_money").html(all_manager_money);

                        $td.eq(8).css({position: "absolute","padding-left": "0px","padding-right": "0px","color": "red"});
                        $td.eq(8).html("主管为办事处平均数的"+$td.eq(8).html()+"倍"+"<p hidden>"+$td.eq(8).html()+"</p>");
                        $td.eq(9).html("");

                    }
                }

                //判断 有没有主管
                if(manager_num === 0) {
                    for(var i = manager_num; i < $tr_array.length; i++){
                        var $td = $tr_array.eq(i).children("td");
                        //员工的钱＝办事处所有钱 * 员工比(比如30) / 100
                        $td.eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt($td.eq(9).children("input").val()) / 100);
                    }
                }else {
                    //员工的钱
                    for(var i = manager_num; i < $tr_array.length; i++){
                        var $td = $tr_array.eq(i).children("td");
                        //员工的钱＝（办事处所有钱－所有主管）* 员工百分比
                        //$td.eq(11).html((parseInt($("#check_submit #hid_office_money").html()) - parseInt($("#check_submit #hid_all_manager_money").html())) * parseInt($td.eq(9).children("input").val()) / 100);
                        //员工的钱＝办事处所有钱 * 员工比(比如30) / (所有主管的系数*100/(总人数-主管人数)+100)
                        $td.eq(11).html(parseInt($("#check_submit #hid_office_money").html()) * parseInt($td.eq(9).children("input").val()) / (parseInt($("#check_submit #hid_office_coefficient").html()) * 100 / ($tr_array.length - manager_num) + 100));
                    }
                }

                $("[data-rel=tooltip]").tooltip();
                var $input_array = $("#example1 .edit-input");
                var sum = 0;
                for (var i = 0; i < $input_array.length; i++)
                {
                    sum += parseFloat($input_array.eq(i).val()==""?0:$input_array.eq(i).val());

                }
                sum = Math.round(sum);
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

    //判断页面的比例是否大于100%
    function proportionalSize() {
        var proportionSize = 0;
        var row_tr = $("#example1 tr:has(.edit-input)");
        row_tr.each(function(i){
            //proportionSize += parseInt(row_tr.eq(i).children("td").eq("9").children("input").val());     //当有小数时,不好用
            proportionSize += parseFloat(row_tr.eq(i).children("td").eq("9").children("input").val());
        });

        //console.log("proportionSize"+proportionSize);
        if(parseInt(proportionSize) < 100) {
            return "<";
        }if (parseInt(proportionSize) > 100) {
            return '>';
        }else {
            return '=';
        }
    };

    function saveFun(params) {

        var $input_array = $("#example1 .edit-input");
        for (var i = 0; i < $input_array.length; i++)
        {
            if (!$input_array.eq(i).val().match(/^\d+(\.\d+)?$/))
            {
                alert("请输入正确的数字");
                return ;
            }
        }
        var table = $("#example1 tbody tr");
        var row_tr = $("#example1 tr:has(.edit-input)");
        var sql_data = new Array();
        var user_name = $(".user-info").children("small").eq(1).html();

        for (var i = 0; i < table.length; i++)
        {
            if (i < manager_num) {
                sql_data[i] = {
                    "ID": table.eq(i).children("td").eq("0").html(),
                    "SUPERIORPRO":'0',
                    "REMARKSPRO":table.eq(i).children("td").eq("10").children("input").val()
                };
            }else {
                sql_data[i] = {
                    "ID": table.eq(i).children("td").eq("0").html(),
                    "SUPERIORPRO":table.eq(i).children("td").eq("9").children("input").val(),
                    "REMARKSPRO":table.eq(i).children("td").eq("10").children("input").val()
                };
            }
        }

        //先判断是否可以修改
        light.doget("/performance/panduanStatus", {"orgId":$("#check_submit #hid_office_id").html()}, function(err, result) {
            if(err){
                alert("查询有误！")
            }else {
                if (result[0].SUB_CHECK_STATUS === '30' && params != undefined) {
                    alert("已经审批过！不可以再保存！");
                } else if (result[0].SUB_CHECK_STATUS === '30' && params == undefined) {
                    return;
                } else if (result[0].SUB_CHECK_STATUS === '10' && params != undefined) {
                    alert("该办事处还没有申报！不可审批！请催办！");
                } else if (result[0].SUB_CHECK_STATUS === '10' && params == undefined) {
                    return;
                } else {
                    //入库
                    light.doput("/performance/areaCheckSave", {"req_data": sql_data,"orID": $("#check_submit #hid_office_id").html(),"u_na": user_name}, function (err, result) {

                        if (!result && params === 1) {
                            alert("数据错误！");
                        } else {
                            if (result.result  && params ===1) {
                                alertify.success("数据保存成功");
                            }
                            else if(result.result  && params ===undefined){
                                return;
                            }else {
                                alertify.error("数据保存失败");
                            }
                        }

                    });
                }
            }
        });
    }

});
