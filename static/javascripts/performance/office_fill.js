/**
 * Created by wsights on 15-7-29.
 */
$(function (){

    "use strict";
    //10没有提交过，20已提交过，30没有提交过,保存过
    var trueCommit;
    var InterValObj; // timer变量，控制时间

    events();
    render();

    function events(){

        //点击保存
        $("#button_keep").on("click", function(err, result) {
            alertify.confirm("是否保存？保存之后可以修改，但不是申报完成！", function(state) {
                if(state){
                    sub_func('save');
                }else {
                    alertify.log("取消保存！");
                }
            });
        });

        //点击提交
        $("#commit-true").on("click", function() {
            var size = proportionalSize();

            if(size == '<'){
                alert("比例合计小于100%！");
            }else if(size == '>') {
                alert("比例合计大于100%！");
            }else {
                alertify.confirm("是否提交？提交之后可以不可再修改！", function(state) {
                    if(state){
                        sub_func('submit');
                    }else {
                        alertify.log("取消提交！");
                    }
                });
            }

        });

        $("#example").on("change", ".edit-input", function (){
            var $this = $(this);//this对象

            if ($this.val().match(/^\d+(\.\d+)?$/)) {
                //$(this).parent("td").children("p").html($this.val());
                //$(this).html($(this).attr("value", $(this).val()));
                //console.log($(this).val($(this).val()));
                var $input_array = $("#example .edit-input");
                var sum = 0;
                for (var i = 0; i < $input_array.length; i++)
                {
                    sum += parseFloat($input_array.eq(i).val()==""?0:$input_array.eq(i).val());

                }
                $(".dataTables_scrollFootInner .display.dataTable tfoot th:eq(8)").html(sum+"%");
            }
            else
            {
                {
                    alert("请输入正确的数字");
                    $this.trigger("focus").trigger("select");
                }
            }
        });

        $(".main-content").on("click", function (event){
            if ($(event.target).hasClass("paginate_button"))
            {
                $("[data-rel=tooltip]").tooltip();
            }
        });
    }

    function render(){
        var quarter,years;
        light.doget("/performance/getNowTime", function(err, result){
            quarter = result[0].QUARTER;
            years = result[0].YEARS;
            $("#navi").html("("+years+"年"+quarter+")");

            //将当前的年、季度存起来
            $(".render-time").attr("data-year",years);
            $(".render-time").attr("data-quarter",quarter);
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
                judgeInfo(orgId);
            }else {
                alertify.log("您没有访问权限！");
            }
        });

    }

    function sub_func(saveOrSub) {
        var timeOutFlag = 0;

        if (saveOrSub === undefined) {
            saveOrSub = 'save';
            timeOutFlag = 1;
        }

        if (saveOrSub === 'submit' && timeOutFlag === 0) {
            window.clearInterval(InterValObj); // 停止计时器
        }

        var jsonData = [];
        var updateData = [];
        var id,
            name,
            code,
            remarks,
            proportion;
        /*var userCode = $("#hid-user-code").val();*/

        //注--此处code的值实际是name，根据后期需要会有变动，变量名暂时不变
        var userCode = $(".user-info").children("small").eq(1).html();
        var userOrgId = $("#hid-user").val();

        $("#example tbody tr").each(function(i){
            id = $(this).children("td").eq(0).html();
            name = $(this).children("td").eq(2).html();
            code = $(this).children("td").eq(3).html();
            remarks = $(this).children("td").eq(7).children("input").val();
            proportion = $(this).children("td").eq(8).children("input").val();
            jsonData.push({name:name,code:code,remarks:remarks,proportion:proportion});
            updateData.push({id:id,remarks:remarks,proportion:proportion});
        });

        //console.log("***json:",jsonData);

        //10没有提交过，20已提交过
        if(trueCommit === "10") {
            if(saveOrSub === 'save') {
                light.doput("/performance/setEmployeeBonusDraft", {jsonData:jsonData,deptcode:$("#hid-user").val()}, function(err, result) {
                    if(result.result === true && timeOutFlag === 0) {
                        alertify.success("保存成功!");
                    }else if(result.result === true && timeOutFlag === 1) {
                        return;
                    }else {
                        alertify.error("保存失败，请重新确定！");
                    }
                })
            }else if(saveOrSub === 'submit') {
                light.doput("/performance/setEmployeeBonus", {jsonData:jsonData,deptcode:$("#hid-user").val(),userCode:userCode}, function(err, result) {
                    if(result.result === true) {
                        trueCommit = '20';
                        alertify.success("申报成功!");
                        //给上级发一个消息提醒
                         light.doput("/performance/setMessageForArea", {msg_type:"zg_qy",content:"已申报",pid:userOrgId},function(err, result){
                             console.log(result);
                             if(result.result === true) {
                             alertify.success("消息提醒发送成功！");
                             }else {
                             alertify.error("消息提醒失败！");
                             }
                         });
                    }else {
                        alertify.error("申报失败，请重新确定！");
                    }
                })
            }
        }else if(trueCommit === "20") {
            if(saveOrSub === 'save') {
                alert("已经提交申报，不能保存！");
            }else if(saveOrSub === 'submit') {
                alert("已经申报，不允许修改申报！");
            }
            //暂时去的，还有用，不确定   －－－ lyj
            //light.doput("/performance/updateEmployeeBonus", {updateData:updateData}, function(err, result) {
            //    if(result.result === true) {
            //        alertify.success("更新成功!");
            //
            //        //给上级发一个消息提醒
            //        light.doput("/performance/setMessageForArea", {content:"已修改申报",userOrgId:userOrgId},function(err, result){
            //            console.log("#######result:",result);
            //            if(result.result === true) {
            //                alertify.success("消息提醒发送成功！");
            //            }else {
            //                alertify.error("消息提醒失败！");
            //            }
            //        });
            //
            //    }else {
            //        alertify.error("更新失败，请重新输入");
            //    }
            //})

        }else if(trueCommit === '30') {
            if(saveOrSub === 'save') {
                light.doput("/performance/updateEmployeeBonus", {updateData:updateData}, function(err, result) {
                    if(result.result === true && timeOutFlag === 0) {
                        alertify.success("保存成功!");
                    }else if(result.result === true && timeOutFlag === 1) {
                        return;
                    }else {
                        alertify.error("保存失败，请重新确定！");
                    }
                })
            }else if(saveOrSub === 'submit') {
                light.doput("/performance/upInEmployeeBonus", {updateData:updateData,deptcode:$("#hid-user").val(),userCode:userCode}, function(err, result) {
                    if(result.result === true) {
                        trueCommit = '20';
                        $(".sub-false").css("display","none");
                        $(".sub-true").css("display","inline");

                        $("#button_keep").attr("disabled", true);
                        $("#commit-true").attr("disabled", true);
                        alertify.success("申报成功!");

                        //给上级发一个消息提醒
                        light.doput("/performance/setMessageForArea", {content:"已申报",userOrgId:userOrgId},function(err, result){
                            //console.log("#######result:",result);
                            if(result.result === true) {
                                alertify.success("消息提醒发送成功！");
                            }else {
                                alertify.error("消息提醒失败！");
                            }
                        });

                    }else {
                        alertify.error("申报失败，请重新输入");
                    }
                })
            }

        }
    }

    function set_table(url){
        var name_index = 0;

        //dom对象排序
        //td里面是input
        $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val();
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
            "sAjaxSource": url,     //指定要从哪个URL获取数据
            "fnInitComplete": function(oSettings, json) {
                $("[data-rel=tooltip]").tooltip();
                var $input_array = $("#example .edit-input");
                var sum = 0;
                for (var i = 0; i < $input_array.length; i++)
                {
                    sum += parseFloat($input_array.eq(i).val()==""?0:$input_array.eq(i).val());
                }
                $(".dataTables_scrollFootInner .display.dataTable tfoot th:eq(8)").html(sum+"%");
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
                        orgId: orgId
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
                { "title":"比例(%)","mData":"PROPORTION", "sDefaultContent": "","width":"10px","orderDataType": "dom-text" },
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
                    "data": "备注",
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
                    "targets": [8],
                    "data": "比例",
                    "render": function (data) {
                        var ss;
                        if(data) {
                            ss = "<input type=\"text\" class='edit-input' value='" + data + "'>"+"<p hidden>"+data+"</p>";
                        }else {
                            ss = "<input type=\"text\" class='edit-input' value=''>"+"<p hidden></p>";
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

    /**
     * 判断保存状态还是提交状态
     * @type {string}
     */
    function judgeInfo(orgId) {

        var url ;
        light.doget("/performance/getTrueComOrSave", {orgId:orgId}, function(err, result) {
            if (err) {
                alertify.error("查询有问题");
            }else if(result.length == 0){
                alert("考评未开始!");
            }else if (result.length > 0 && result[0].STATUS === '10') {
                $(".sub-false").css("display","inline");
                //保存状态
                trueCommit = "30";
                url = "/performance/getEmployeeBonusInfo";

                //定时执行一遍保存
                InterValObj = window.setInterval(sub_func, 5000*60); // 启动计时器，5秒执行一次

                set_table(url)
            }else if (result.length > 0 && result[0].STATUS === '20') {
                //已经提交过
                $(".sub-true").css("display","inline");

                $("#button_keep").attr("disabled", true);
                $("#commit-true").attr("disabled", true);

                trueCommit = "20";
                url = "/performance/getEmployeeBonusInfo";
                set_table(url)
            }else {
                //已经审批
                $(".sub-true").css("display","inline");

                $("#button_keep").attr("disabled", true);
                $("#commit-true").attr("disabled", true);

                trueCommit = "20";
                url = "/performance/getEmployeeBonusInfo";
                set_table(url)
            }

        });

    };

    //判断页面的比例是否大于100%
    function proportionalSize() {
        var proportionSize = 0;
        $("#example tbody tr").each(function(i){
            //proportionSize += parseInt($(this).children("td").eq(8).children("input").val());     //当有小数时,不好用
            proportionSize += parseFloat($(this).children("td").eq(8).children("input").val());
        });

        if(parseInt(proportionSize) < 100) {
            return "<";
        }if (parseInt(proportionSize) > 100) {
            return '>';
        }else {
            return '=';
        }
    };

});

