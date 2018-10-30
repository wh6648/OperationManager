$(function() {

    "use strict";
    var index = 0;
    var index_values = 0;
    var in_up;  //20新插入数据，10更新数据
    var tel;

    get_power();

    function get_power(){
        var groupId = $("#hid-user-groups").val();
        var orgId = $("#hid-user").val();

        light.doget("/group/get", {id:groupId}, function(err, result) {
            if (result.name === '人事组') {
                render();
                events();
            }else{
                $("#start-btn").attr("disabled",true);
                $("#end-btn").attr("disabled",true);
                alert("您没有权限进行该操作");
            }
        });
    }

    function events() {

        $(".year-select ul li a").on("click", function() {
            $(".year-select ul li a").removeClass("active");
            $(this).addClass("active");
        });

        $(".select-quarter a").on("click", function() {
            $(".select-quarter a").removeClass("active");
            $(this).addClass("active");
        });
        /**
         * 点击开始按钮
         */
        $("#start-btn").on("click", function() {
            var updateData = [];
            var id,
                description,
                cre_time,
                end_time,
                remarks,
                trem_id;

            alertify.confirm("确定"+(in_up==='20'?"设置":"更新")+"时间？", function(state) {
                if(state) {

                    var $a = $("#example tbody tr input:not(.note_input_tag)");
                    for (var j = 1; j < $a.length; j++){

                        if (!($a.eq(j).val().match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2})$/))){
                            alertify.error($a.eq(j).parent().parent().children("td").eq(2).html()+"--时间格式不正确");
                            return ;
                        }
                    }
                    var i = 0;
                    $("#example tbody tr").each(function(i){
                        id = $(this).children("td").eq(0).html();
                        description = $(this).children("td").eq(2).html();
                        if (in_up == 10){
                            cre_time = $(this).children("td").eq(3).children("input").val();
                        }else{
                            if (i == 0) {
                                cre_time = moment(new Date()).format('YYYY-MM-DD HH:mm');
                            }
                            else{
                                cre_time = $(this).children("td").eq(3).children("input").val();
                            }
                        }
                        end_time = $(this).children("td").eq(4).children("input").val();
                        remarks = $(this).children("td").eq(5).children("input").val();
                        trem_id = $(this).children("td").eq(6).html();

                        updateData.push({id:id,cre_time:cre_time==undefined?'':cre_time,end_time:end_time==undefined?'':end_time,remarks:remarks,description:description,TIME_CONTROL_TREM_ID:trem_id});
                        i++;
                    });

                    if(in_up === '10') {
                        //alert(10);
                        light.doget("/performance/systemTimeChange", {updateData:updateData}, function(err, result) {
                            if(result.result_type == '1') {
                                alertify.success("更新时间成功!");
                            }else {
                                alertify.error("更新时间失败，请重新输入");
                                window.location = "/site/timeSet?name=绩效考核";
                            }

                        })

                    }else if(in_up === '20') {
                        //alert(20);
                        //先判断一下，绩效表里面有没有要操作的数据？
                        light.doget("/performance/checkJiXiaoInfo", {}, function(err, result) {
                            if (result.result == true) {
                                light.doget("/performance/systemStart", {insertData:updateData}, function(err, result) {
                                    //console.log("result:",result);
                                    if(result.result_type == '1') {
                                        alertify.success("系统启动成功!");
                                        alert("系统启动成功!");
                                    }else {
                                        alertify.error("系统启动失败，请重新输入");
                                    }
                                    window.location = "/site/timeSet?name=绩效考核";
                                })
                            }else {
                                alert("该季度绩效数据还没有，请与负责人联系！");
                            }
                        });
                    }
                }else {
                    alertify.success("已取消!");
                }
            });

        });

        $("#end-btn").on("click", function() {

            alertify.confirm("确定结束绩效考核？", function(state) {
                if(state) {
                    light.doget("/performance/closeSystem", function(err, result) {
                        if(result.result_type == '1') {
                            alertify.success("已成功结束！");
                        }else {
                            alertify.err("结束失败，请重新确认！");
                        }
                        window.location = "/site/timeSet?name=绩效考核";
                    });
                }else {
                    alertify.log("已取消！");
                }
            })
        });

    }

    function render() {
        var status;
        light.doget("/performance/getNowTime", function(err, result) {
            status = result[0].OPERATIONSTATUS;

            if (status === '10') {
                $("#start-btn").attr("disabled",false);
                $("#end-btn").attr("disabled",false);
                //说明已经编辑过，直接查表，可更新该表
                in_up = '10';
                tel = "TIME_CONTROL_TREM_ID";
                var url = "/performance/getTimeValues";
                //console.log("从数据库中查数据，应该更新");
                $("#start-btn").html("修改时间");
                $("#showNowTime").html(result[0].YEARS+"年"+result[0].QUARTER+"季度 已经开始 &nbsp;&nbsp;&nbsp;&nbsp;");
                setTable(url);
            }
            else {
                //说明第一次访问，应该从码表中把数据查出来
                in_up = '20';
                tel = "ID";
                var url = "/performance/getTimeTerm";
                //console.log("第一次访问，数据库中还没有数据，应该插入");
                $("#start-btn").attr("disabled",false);
                $("#end-btn").attr("disabled","true");
                $("#showNowTime").html(result[0].YEARS+"年"+result[0].QUARTER+"季度 还未开始 &nbsp;&nbsp;&nbsp;&nbsp;");
                setTable(url);
            }
        });
    }

    function setTable(url) {
        var parTime = 0;
        /* Create an array with the values of all the input boxes in a column */
        $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
        {
            return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                return $('input', td).val();
            } );
        };

        /* Create an array with the values of all the input boxes i2015-05-15n a column, parsed as numbers */
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
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": true,//搜索栏
            "bSort": false,//排序
            //"bInfo": true,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            "dom": 'lrtip'  ,//没有检索元素
            //'dom': '<"float_left"f>r<"float_right"l>tip',
            "sAjaxSource": url,     //指定要从哪个URL获取数据
            "fnInitComplete": function(oSettings, json) {
                for(var i=1; i <= index_values; i++) {
                    J('#runcode_'+i).calendar({ format:'yyyy-MM-dd HH:mm' });
                }
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
                        limit: limit
                    },

                    "success": function(json) {
                        //console.log("***",json);
                        var resultData = json.data;
                        var totalItems = 0;
                        if(json.data.length >0){
                            totalItems = json.data.length;
                            index_values = json.data.length*2;
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
                {"title":"ID","mData":"ID","sDefaultContent": "","width":"20px","class":"hidden"},
                {"title":"序号","mData":"","sDefaultContent": "","width":"20px","orderable":"true"},
                {"title":"说明","mData":"DESCRIPTION","sDefaultContent": "","width":"40px"},
                {"title":"开始日期","mData":"CRE_TIME","width":"40px"},
                {"title":"截止日期","mData":"END_TIME","width":"40px"},
                { "title":"备注","mData":"REMARKS","sDefaultContent": "","orderDataType": "dom-text","width":"40px" },
                {"title":"码表ID","mData":tel,"sDefaultContent": "","width":"20px","class":"hidden"}
            ],
            "columnDefs": [
                {
                    "targets": [1],
                    "data": "序号",
                    "render": function (){
                        return ++parTime;
                    }
                },
                {
                    "targets": [3],
                    "data": "开始日期",
                    "render": function (data){
                        var ss;
                        ++index;
                        if(index===23){
                            ss = "";
                        }else {
                            if(data){
                                var time = moment(data).subtract('hours', 8).format('YYYY-MM-DD HH:mm');
                                if(time == "Invalid date"){
                                    time = "";
                                }
                                if ( index === 1) {
                                    ss = "<input class='start' value='"+time+"' readonly/>";
                                }else {
                                    ss = "<input class='start' id='runcode_"+index+"' value='"+time+"'/>";
                                }
                            }else {
                                if ( index === 1) {
                                    ss = "<input class='start' value='' readonly/>";
                                }else {
                                    ss = "<input class='start' id='runcode_" + index + "' value=''/>";
                                }
                            }

                        }
                        return ss;
                    }
                },
                {
                    "targets": [4],
                    "data": "截止日期",
                    "render": function (data){
                        var ss;
                        ++index;
                        if(index===2){
                            var ss = "";
                        }else {
                            if(data){
                                var time = moment(data).subtract('hours', 8).format('YYYY-MM-DD HH:mm');
                                if(time == "Invalid date"){
                                    time = "";
                                }
                                ss = "<input class='start' id='runcode_"+index+"' value='"+time+"'/>";
                            }else {
                                ss = "<input class='start' id='runcode_"+index+"' value=''/>";
                            }
                        }
                        return ss;
                    }
                },
                {
                    "targets": [5],
                    "data": "备注",
                    "render": function (data){
                        var ss;
                        if(data){
                            ss = "<input type='text' class='note_input_tag' name='row-1-position' value='"+data+"'/>";
                        }else{
                            ss = "<input type='text' class='note_input_tag' name='row-1-position'/>";
                        }
                        return  ss;
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