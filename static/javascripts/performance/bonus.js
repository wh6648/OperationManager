
$(function (){
    "use strict";
    var all_com_money = 0;
    var all_score = 0;
    var jx_fen_ave = 0;
    var change_power = false;//修改表的权限
    var InterValObj; // timer变量，控制时间
    var timeFlag = 1;
    get_power();

    function get_power(){
        var groupId = $("#hid-user-groups").val();
        var orgId = $("#hid-user").val();

        light.doget("/performance/getPeoNumState", function (err, result){
            if (result.result_type == 1) {
                light.doget("/performance/getOperationTimeByRow_sort", {row_sort:"7"}, function (err, result) {
                    var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
                        nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
                    if((cre_time<nowTime)&&(nowTime<end_time)){
                        light.doget("/group/get", {id:groupId}, function(err, result) {
                            if (result.name === '人事组') {
                                light.doget("/performance/getOfficeBonusState", {}, function (err, result){
                                    if (result.result_type == 1) {
                                        change_power = result.change_power;
                                        render();
                                        events();
                                    }
                                    else{
                                        //console.log(err);
                                        alert("取得数据不正确");
                                    }
                                });

                            }else{
                                alert("您没有权限进行该操作");
                            }
                        });
                    }
                    else {
                        alert("当前时间不可操作");
                    }

                });
            }
            else{
                //console.log(err);
                alert("箱管商务人数尚未审批结束");
            }
        });

    }

    function render(){
        setTable();
    };
    function events(){
        //finish事件
        $("#button_submit").on("click", function (){
            var sub_type = 1;//finish submit's status is 1
            if (change_power == true)
            {
                if (confirm("数据将提交，以后不能修改。\n确定提交吗？"))
                {
                    timeFlag = 1;
                    sub_func(sub_type);
                    //算员工的钱
                    calculate_emp();
                }
            }
            else
                alert("对不起，您已确定提交。不能再修改！");
        });
        //keep事件
        $("#button_keep").on("click", function (){
            var sub_type = 0;//finish submit's status is 1
            if (change_power == true)
            {
                if (confirm("保存数据并不会提交，如果要提交请选择完成按钮。\n确定保存吗？"))
                {
                    timeFlag = 1;
                    sub_func(sub_type);
                    //算员工的钱
                    calculate_emp();
                }
            }
            else
                alert("对不起，您已确定提交。不能再修改！");
        });

    };

    //定时执行一遍保存
    InterValObj = window.setInterval(timeoutSave, 5000*60); // 启动计时器，

    //超时保存
    function timeoutSave() {
        var sub_type = 0;

        if (change_power == true) {

            timeFlag = 0;

            sub_func(sub_type);
            //算员工的钱
            calculate_emp();
        }else {
            timeFlag = 1;
            window.clearInterval(InterValObj); // 停止计时器
        }
    };

    function set_total(table_name){
        var $tr_array = $("#"+table_name+" tbody tr");
        var peo_num = 0,score_sum = 0,bus_num = 0,bus_num_money = 0,tube_num = 0,tube_num_money = 0,pra_num = 0,pos_num = 0,pos_mon = 0,money_sum = 0,pra_num_money = 0,pos_num_money = 0;
        for (var i = 0; i < $tr_array.length; i++)
        {
            /**
             * lyj-update
             * 管里 合计 部分数据
             */
            peo_num += parseFloat($tr_array.eq(i).children("td").eq(3).children("p").html());
            score_sum += parseFloat($tr_array.eq(i).children("td").eq(7).children("p").html());
            bus_num += parseFloat($tr_array.eq(i).children("td").eq(11).children("p").html());
            bus_num_money += parseFloat($tr_array.eq(i).children("td").eq(12).children("p").html());
            tube_num += parseFloat($tr_array.eq(i).children("td").eq(13).children("p").html());
            tube_num_money += parseFloat($tr_array.eq(i).children("td").eq(14).children("p").html());
            pra_num += parseFloat($tr_array.eq(i).children("td").eq(15).children("input").val());
            pra_num_money += parseFloat($tr_array.eq(i).children("td").eq(17).children("p").html());
            pos_num += parseFloat($tr_array.eq(i).children("td").eq(18).children("input").val());
            pos_num_money += parseFloat($tr_array.eq(i).children("td").eq(20).children("p").html());
            pos_mon += parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val());
            money_sum += parseFloat($tr_array.eq(i).children("td").eq(21).children("p").html());
        }

        peo_num = isNaN(peo_num)?0:peo_num;
        score_sum = isNaN(score_sum)?0:score_sum;
        bus_num = isNaN(bus_num)?0:bus_num;
        bus_num_money = isNaN(bus_num_money)?0:bus_num_money;
        tube_num = isNaN(tube_num)?0:tube_num;
        tube_num_money = isNaN(tube_num_money)?0:tube_num_money;
        pra_num = isNaN(pra_num)?0:pra_num;
        pra_num_money = isNaN(pra_num_money)?0:pra_num_money;
        pos_num = isNaN(pos_num)?0:pos_num;
        pos_num_money = isNaN(pos_num_money)?0:pos_num_money;
        pos_mon = isNaN(pos_mon)?0:pos_mon;
        money_sum = isNaN(money_sum)?0:money_sum;

        $("#peo_num").html(parseFloat(peo_num).toFixed(1)+"<p hidden>"+peo_num+"</p>");
        $("#score_sum").html(parseFloat(score_sum).toFixed(1)+"<p hidden>"+score_sum+"</p>");
        $("#bus_num").html(parseFloat(bus_num).toFixed(1)+"<p hidden>"+bus_num+"</p>");
        $("#bus_num_money").html(parseFloat(bus_num_money).toFixed(1)+"<p hidden>"+bus_num_money+"</p>");
        $("#tube_num").html(parseFloat(tube_num).toFixed(1)+"<p hidden>"+tube_num+"</p>");
        $("#tube_num_money").html(parseFloat(tube_num_money).toFixed(1)+"<p hidden>"+tube_num_money+"</p>");
        $("#pra_num").html(parseFloat(pra_num).toFixed(1)+"<p hidden>"+pra_num+"</p>");
        $("#pra_num_money").html(parseFloat(pra_num_money).toFixed(1)+"<p hidden>"+pra_num_money+"</p>");//不考核总钱1
        $("#pos_num").html(parseFloat(pos_num).toFixed(1)+"<p hidden>"+pos_num+"</p>");
        $("#pos_num_money").html(parseFloat(pos_num_money).toFixed(1)+"<p hidden>"+pos_num_money+"</p>");//不考核总钱2
        $("#pos_mon").html(parseFloat(pos_mon).toFixed(1)+"<p hidden>"+pos_mon+"</p>");
        $("#money_sum").html(parseFloat(money_sum).toFixed(1)+"<p hidden>"+money_sum+"</p>");
    }
    function sub_func(sub_type){
        var row_tr = $("#example1 tr:has(.bus_input)");
        var this_data = new Array();
        var row_1 = 0,row_2 = 0,row_3 = 0,row_4 = 0,row_5 = 0,row_6 = 0;
        for (var i = 0; i < row_tr.length; i++)
        {
            row_1 = row_tr.eq(i).children("td").eq(3).children("p").html();
            row_2 = row_tr.eq(i).children("td").eq(5).children("p").html();
            row_3 = row_tr.eq(i).children("td").eq(15).children("input").val();
            row_4 = row_tr.eq(i).children("td").eq(18).children("input").val();
            row_5 = row_tr.eq(i).children("td").eq(19).children("input").val();
            row_6 = row_tr.eq(i).children("td").eq(16).children("input").val();
            if (row_1 === '') {
                row_1 = '0';
            }
            if (row_2 === '') {
                row_2 = '0';
            }
            if (row_3 === '') {
                row_3 = '0';
            }
            if (row_4 === '') {
                row_4 = '0';
            }
            if (row_5 === '') {
                row_5 = '0';
            }
            if (row_6 === '') {
                row_6 = '0';
            }

            this_data[i] = {
                ID:row_tr.eq(i).children("td").eq(1).html(),
                NAME:row_tr.eq(i).children("td").eq(2).html(),
                DEPTPERSONS:row_1,//人数
                JD_AVE:row_2,//人均绩点
                JX_FEN:row_tr.eq(i).children("td").eq(6).children("p").html(),
                SUM_FEN:row_tr.eq(i).children("td").eq(7).children("p").html(),
                TOTAL:row_tr.eq(i).children("td").eq(8).children("p").html(),
                PER_CAPITA:row_tr.eq(i).children("td").eq(9).children("p").html(),
                EX_COMMERCE_NUMBER:row_tr.eq(i).children("td").eq(8).children("p").val(),
                COMMERCE_MONEY:row_tr.eq(i).children("td").eq(12).children("p").html(),
                EX_TUBE_NUMBER:row_tr.eq(i).children("td").eq(13).children("p").html(),
                TUBE_MONEY:row_tr.eq(i).children("td").eq(14).children("p").html(),
                PROBATION:row_3,//期内实习适用
                POSITIVE:row_4,//期内转正
                MONTHS_NUMBER:row_5,//期内月数
                TRUE_TOTAL:row_tr.eq(i).children("td").eq(21).children("p").html(),
                MONTH_PER_CAPITA:row_tr.eq(i).children("td").eq(9).children("p").html()/3,
                EFFECTIVE_COEFFICIENT:row_6,
                SUBSTATUS:sub_type
            };
        }

        //console.log(this_data);

        light.doput("/performance/bonusPut", {"req_data":this_data}, function (err, result) {

            if (!result && timeFlag === 1) {
                alert("取得数据错误！")
            }
            else
            {
                if (result.result && timeFlag === 1)
                {
                    alert("数据修改成功");
                }else if(result.result && timeFlag === 0) {
                    return;
                }
                else
                {
                    alert("数据修改失败");
                }
            }
        });

    }
    function setTable(){
        $('#example1').dataTable( {
            "bPaginate": false,//分页按钮
            "bLengthChange": true,//每行显示记录数
            "bFilter": false,//搜索栏
            "bSort": true,//排序
            "bInfo": false,//Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
            "bAutoWidth": false,
            //"dom": 'lrtip'  ,//没有检索元素
            'dom': '<"float_left"f>r<"float_right"l>tip',
            "columns": [
                {"title":"序号","mData": "ROWNUM","width":"10px","sDefaultContent": ""},
                {"title":"ID","mData": "ID","width":"20px","sDefaultContent": "", "class":"hidden"},
                {"title":"经营办","mData": "OFFICE_NAME","width":"40px","sDefaultContent": ""},
                {"title":"平均人数","mData": {},"width":"20px","sDefaultContent": ""},
                {"title":"总绩点","mData": "JD_SUM","width":"20px","sDefaultContent": ""},
                {"title":"人均绩点","mData": {},"width":"20px","sDefaultContent": ""},
                { "title":"绩效分","mData": "JX_FEN","orderDataType": "dom-text","width":"30px" ,"sDefaultContent": ""},
           /*7*/{ "title":"总分","mData": "SUM_FEN","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                { "title":"计算奖金总额","mData": "TOTAL","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                { "title":"季度人均奖","mData": "PER_CAPITA","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},

       /*新加的*/{ "title":"单月人均奖","mData": "PER_CAPITA","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},

                { "title":"商务人数","mData": "COMMERCE_NUMBER"/*"EX_COMMERCE_NUMBER"*/,"orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                { "title":"商务占金额","mData": "COMMERCE_MONEY","orderDataType": "dom-text" ,"width":"50px","sDefaultContent": ""},
                { "title":"箱管人数","mData": "TUBE_NUMBER"/*"EX_TUBE_NUMBER"*/,"orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                { "title":"箱管占金额","mData": "TUBE_MONEY","orderDataType": "dom-text" ,"width":"50px","sDefaultContent": ""},
          /*15*/{ "title":"期内实习试用","mData": "PROBATION","orderDataType": "dom-text" ,"width":"60px","sDefaultContent": ""},

       /*新加的*/{ "title":"能效系数","mData": "EFFECTIVE_COEFFICIENT","orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                { "title":"不参加考核","mData": {},"orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},

                { "title":"期内转正人数","mData": "POSITIVE","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},
                { "title":"未转正总月数","mData": "MONTHS_NUMBER","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""},

                { "title":"不参加考核","mData": {},"orderDataType": "dom-text" ,"width":"20px","sDefaultContent": ""},
                { "title":"实际奖金额","mData": "TRUE_TOTAL","orderDataType": "dom-text" ,"width":"40px","sDefaultContent": ""}
            ],
            "sAjaxSource": "/performance/getOfficeBonus",
            "fnInitComplete": function(oSettings, json) {

                //算不参加考核的钱@lyj
                calculateOtherMoney();

                $(".peoSum").on("change", function (){
                    var $this = $(this);
                    var $td_array = $this.parent().parent().children("td");
                    $this.parent().children("p").html(parseFloat($this.val()));

                    var t =  parseFloat(parseFloat($td_array.eq(3).children("p").html()) * parseFloat($td_array.eq(6).children("p").html())).toFixed(1);
                    /**
                     * lyj-update
                     * 改总分
                     */
                    t = isNaN(t)?0:t;
                    $td_array.eq(7).html(

                        parseFloat(t).toFixed(1)+"<p hidden>"+t+"</p>"
                    );

                    set_total("example1");

                    //修改共同列
                    updateTogetherRow();
                    set_total("example1");
                });

                //修改那几个系数事件
                $(".peoAve").on("change", function (){
                    var $this = $(this);
                    var $td_array = $this.parent().parent().children("td");
                    $this.parent().children("p").html(parseFloat($this.val()));

                    var tt =  parseFloat(parseFloat(jx_fen_ave) * parseFloat($td_array.eq(5).children("p").html())).toFixed(1);
                    /**
                     * lyj-update
                     * 改绩效分
                     * 平均绩效分 * 系数
                     */
                    tt = isNaN(tt)?0:tt;
                    $td_array.eq(6).html(

                        parseFloat(tt).toFixed(1)+"<p hidden>"+tt+"</p>"
                    );

                    var t =  parseFloat(parseFloat($td_array.eq(3).children("p").html()) * parseFloat($td_array.eq(5).children("p").html()) * parseFloat($td_array.eq(6).children("p").html())).toFixed(1);

                    /**
                     * lyj-update
                     * 改总分
                     */
                    t = isNaN(t)?0:t;
                    $td_array.eq(7).html(

                        parseFloat(t).toFixed(1)+"<p hidden>"+t+"</p>"
                    );
                    set_total("example1");

                    //修改共同列
                    updateTogetherRow();
                    set_total("example1");
                });

                /**
                 * lyj-update
                 * 管理 表格 后面三个input输入框
                 */
                $(".qnsxsy, .nxxs").on("change", function (){
                    var $this = $(this);
                    var $td_array = $this.parent().parent().children("td");

                    var t = parseFloat($td_array.eq(8).children("p").html())
                        - parseFloat($td_array.eq(12).children("p").html())
                        - parseFloat($td_array.eq(14).children("p").html())
                        - (parseFloat($td_array.eq(15).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(10).children("p").html()))
                        - (parseFloat($td_array.eq(19).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(10).children("p").html()));
                        //- (parseFloat($td_array.eq(18).children("input").val()) * parseFloat($td_array.eq(9).children("p").html()) / 3 * (3-(parseFloat($td_array.eq(19).children("input").val()))));

                    //console.log((parseFloat($td_array.eq(15).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(10).children("p").html())));
                    t = isNaN(t)?0:t;
                    $td_array.eq(21).html(
                        parseFloat(t).toFixed(1)+"<p hidden>"+t+"</p>"
                    );

                    //算不参加考核的钱@lyj
                    calculateOtherMoney();

                    set_total("example1");
                });
                //lyj@update这列不在公式里了
                $(".qnzz").on("change", function (){
                    //var $this = $(this);
                    //var $td_array = $this.parent().parent().children("td");
                    //var t = parseFloat($td_array.eq(8).children("p").html())
                    //    - parseFloat($td_array.eq(12).children("p").html())
                    //    - parseFloat($td_array.eq(14).children("p").html())
                    //    - (parseFloat($td_array.eq(15).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(9).children("p").html()))
                    //    - (parseFloat($td_array.eq(18).children("input").val()) * parseFloat($td_array.eq(9).children("p").html()) / 3 * (3-(parseFloat($td_array.eq(19).children("input").val()))));
                    //
                    //t = isNaN(t)?0:t;
                    //$td_array.eq(21).html(
                    //    parseFloat(t).toFixed(1)+"<p hidden>"+t+"</p>"
                    //);
                    //
                    ////算不参加考核的钱@lyj
                    //calculateOtherMoney();

                    set_total("example1");
                });
                $(".zzys").on("change", function (){
                    var $this = $(this);
                    var $td_array = $this.parent().parent().children("td");
                    var t = parseFloat($td_array.eq(8).children("p").html())
                        - parseFloat($td_array.eq(12).children("p").html())
                        - parseFloat($td_array.eq(14).children("p").html())
                        - (parseFloat($td_array.eq(15).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(10).children("p").html()))
                        - (parseFloat($td_array.eq(19).children("input").val()) * parseFloat($td_array.eq(16).children("input").val()) * parseFloat($td_array.eq(10).children("p").html()));
                        //- (parseFloat($td_array.eq(18).children("input").val()) * parseFloat($td_array.eq(9).children("p").html()) / 3 * (3-(parseFloat($td_array.eq(19).children("input").val()))));

                    t = isNaN(t)?0:t;
                    $td_array.eq(21).html(
                        parseFloat(t).toFixed(1)+"<p hidden>"+t+"</p>"
                    );

                    //算不参加考核的钱@lyj
                    calculateOtherMoney();

                    set_total("example1");
                });
                set_total("example1");
            },
            "fnServerData": function ( sSource, aoData, fnCallback, oSettings ) { //用于替换默认发到服务端的请求操作
                oSettings.jqXHR = $.ajax( {
                    "dataType": "json",
                    "type": "GET",
                    "url": sSource,
                    "success": function(json) {

                        //console.log("#######json:",json);

                        var resultData = json.data.result_data;
                        var done_type = json.data.result_type;
                        if (done_type == 0)
                        {
                            alert("获得的数据有问题！");
                            return ;
                        }
                        var totalItems = resultData.length;

                        all_com_money = json.data.sum_money;
                        all_score = json.data.all_score;
                        jx_fen_ave = json.data.jx_fen_ave;

                        //console.log(jx_fen_ave);
                        //console.log(all_com_money);

                        fnCallback( {
                            iTotalRecords: totalItems          //json.data.totalItems
                            , iTotalDisplayRecords: totalItems //json.data.totalItems
                            , aaData: resultData
                        });

                    }
                });
            },
            "columnDefs": [
                {
                    "targets": [3],
                    "data": "平均人数",
                    "render": function (data) {
                        if (data.OFFICE_NAME != '箱管' &&
                            data.OFFICE_NAME != '财务商务' &&
                            data.OFFICE_NAME != '船管' &&
                            data.OFFICE_NAME != '运管' &&
                            data.OFFICE_NAME != '财务主管'
                        )
                        return parseFloat(data.DEPTPERSONS).toFixed(1)+"<p hidden>"+data.DEPTPERSONS+"</p>";
                        else
                        return "<p hidden>"+data.DEPTPERSONS+"</p>"+"<input type=\"text\" class='edit-input bus_input peoSum' value=\""+data.DEPTPERSONS+"\">";
                    }
                },
                {
                    "targets": [4],
                    "data": "总绩点",
                    "render": function (data) {
                        if (data)
                            return data.toFixed(1);
                        else
                            return "";
                    }
                },
                {
                    "targets": [5],
                    "data": "人均绩点",
                    "render": function (data) {
                        if (data.OFFICE_NAME != '箱管' &&
                            data.OFFICE_NAME != '财务商务' &&
                            data.OFFICE_NAME != '船管' &&
                            data.OFFICE_NAME != '运管' &&
                            data.OFFICE_NAME != '财务主管'
                        )
                            return parseFloat(data.JD_AVE).toFixed(1)+"<p hidden>"+data.JD_AVE+"</p>";
                        else
                            return "<p hidden>"+data.JD_AVE+"</p>"+"<input type=\"text\" class='edit-input bus_input peoAve' value=\""+data.JD_AVE+"\">";
                    }
                },
                {
                    "targets": [6],
                    "data": "jx_fen",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [7],
                    "data": "sum_fen",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [8],
                    "data": "total",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [9],
                    "data": "every",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [10],
                    "data": "单月人均奖",
                    "render": function (data) {

                        return parseFloat(data/3).toFixed(1)+"<p hidden>"+(data/3)+"</p>";
                    }
                },
                {
                    "targets": [11],
                    "data": "sw_peo",
                    "render": function (data) {
                        var aa = 0;
                        if (data === null) {
                            data = 0.0;
                            aa = parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }else {
                            aa = parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                        return aa;
                    }
                },
                {
                    "targets": [12],
                    "data": "sw_money",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [13],
                    "data": "xg_peo",
                    "render": function (data) {
                        var aa = 0;
                        if (data === null) {
                            data = 0.0;
                            aa = parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }else {
                            aa = parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                        }
                        return aa;
                    }
                },
                {
                    "targets": [14],
                    "data": "xgmoney",
                    "render": function (data) {

                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
                    }
                },
                {
                    "targets": [15],
                    "data": "期内实习试用",
                    "render": function (data) {

                        return "<input type=\"text\" class='edit-input bus_input qnsxsy' value=\""+data+"\">";
                    }
                },
                {
                    "targets": [16],
                    "data": "能效系数",
                    "render": function (data) {
                        var aa = '';
                         if (data !== null) {
                            aa = "<input type=\"text\" class='edit-input bus_input nxxs' value=\""+data+"\">";
                         }else {
                             aa = "<input type=\"text\" class='edit-input bus_input nxxs' value=\""+0+"\">";
                         }
                        return aa;
                    }
                },
                {
                    "targets": [17],
                    "data": "不参加考核",
                    "render": function (data) {
                        return '';
                    }
                },
                {
                    "targets": [18],
                    "data": "期内转正",
                    "render": function (data) {
                        return "<input type=\"text\" class='edit-input bus_input qnzz' value=\""+data+"\">";
                    }
                },
                {
                    "targets": [19],
                    "data": "转正月数",
                    "render": function (data) {
                        return "<input type=\"text\" class='edit-input bus_input zzys' value=\""+data+"\">";
                    }
                },
                {
                    "targets": [20],
                    "data": "不参加考核",
                    "render": function (data) {
                        return '';
                    }
                },
                {
                    "targets": [21],
                    "data": "true_total",
                    "render": function (data) {
                        return parseFloat(data).toFixed(1)+"<p hidden>"+data+"</p>";
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


        });
    };

    /**
     * lyj
     * 算不参加考核的钱
     */
    function calculateOtherMoney () {

        var no_1,no_2;

        var $tr_array = $("#example1 tbody tr");
        for (var i = 0; i < $tr_array.length; i++)
        {

            //因为人均这列会变，因为是共同方法，所以需要改不参加考核这一列
            /**
             * 第一个不参加考核列
             * 公式：(月人均) * (期内实习适用人数) * 0.5
             */
            no_1 = parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html()) * parseFloat($tr_array.eq(i).children("td").eq(15).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val());
            no_1 = isNaN(no_1)?0:no_1;
            $tr_array.eq(i).children("td").eq(17).html(
                parseFloat(no_1).toFixed(1)+"<p hidden>"+no_1+"</p>"
            );
            /**
             * 第二个不参加考核列
             * 公式：(月人均 / 3) * (期内转正人数) * (3 - 转正人月数)     --换了
             * 公式：(月人均 * 能效系数 * 未转正总月数)
             */
            //no_2 = parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html()) / 3 * parseFloat($tr_array.eq(i).children("td").eq(18).children("input").val()) * parseFloat(3 - parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val()))
            no_2 = parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html()) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val());
            no_2 = isNaN(no_2)?0:no_2;
            $tr_array.eq(i).children("td").eq(20).html(
                parseFloat(no_2).toFixed(1)+"<p hidden>"+no_2+"</p>"
            );
        }
    }

    function updateTogetherRow () {
        /**
         * lyj-update
         * 财务商务、箱管、运管、船管这几个输入框
         * @type {*|jQuery|HTMLElement}
         */
        var $tr_array = $("#example1 tbody tr");
        var no_1 = 0, no_2 = 0,s_money = 0,x_money = 0;
        for (var i = 0; i < $tr_array.length; i++)
        {
            var t6 = all_com_money/parseFloat($("#score_sum").children("p").html())*parseFloat($tr_array.eq(i).children("td").eq(7).children("p").html());
            t6 = isNaN(t6)?0:t6;

            /**
             * lyj-update
             * 改总额
             */
            $tr_array.eq(i).children("td").eq(8).html(
                parseFloat(t6).toFixed(1)+"<p hidden>"+t6+"</p>"
            );
            var t7 = parseFloat($tr_array.eq(i).children("td").eq(8).children("p").html())/parseFloat($tr_array.eq(i).children("td").eq(3).children("p").html());
            t7 = isNaN(t7)?0:t7;
            /**
             * lyj-update
             * 改人均
             */
            $tr_array.eq(i).children("td").eq(9).html(
                parseFloat(t7).toFixed(1)+"<p hidden>"+t7+"</p>"
            );

            var t8 = parseFloat($tr_array.eq(i).children("td").eq(8).children("p").html())/parseFloat($tr_array.eq(i).children("td").eq(3).children("p").html())/3;
            t8 = isNaN(t8)?0:t8;
            /**
             * lyj-update
             * 改单月人均
             */
            $tr_array.eq(i).children("td").eq(10).html(
                parseFloat(t8).toFixed(1)+"<p hidden>"+t8+"</p>"
            );

            /**
             * lyj-update
             * 改不参加考核1
             */
            no_1 = parseFloat(t8) * parseFloat($tr_array.eq(i).children("td").eq(15).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val());
            no_1 = isNaN(no_1)?0:no_1;
            $tr_array.eq(i).children("td").eq(17).html(
                parseFloat(no_1).toFixed(1)+"<p hidden>"+no_1+"</p>"
            );
            /**
             * lyj-update
             * 改不参加考核2
             */
            no_2 = parseFloat(t8) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val());
            no_2 = isNaN(no_2)?0:no_2;
            $tr_array.eq(i).children("td").eq(20).html(
                parseFloat(no_2).toFixed(1)+"<p hidden>"+no_2+"</p>"
            );

            /**
             * lyj-update
             * 改商务占金额列
             * 因为 人均 变了，所以商务占金额也要随着变
             */
            s_money = parseFloat(t7) * parseFloat($tr_array.eq(i).children("td").eq(11).children("p").html());
            s_money = isNaN(s_money)?0:s_money;
            $tr_array.eq(i).children("td").eq(12).html(
                parseFloat(s_money).toFixed(1)+"<p hidden>"+s_money+"</p>"
            );
            /**
             * lyj-update
             * 改箱管占金额列
             * 因为 人均 变了，所以箱管占金额也要随着变
             */
            x_money = parseFloat(t7) * parseFloat($tr_array.eq(i).children("td").eq(13).children("p").html());
            x_money = isNaN(x_money)?0:x_money;
            $tr_array.eq(i).children("td").eq(14).html(
                parseFloat(x_money).toFixed(1)+"<p hidden>"+x_money+"</p>"
            );

            var t15 =  parseFloat($tr_array.eq(i).children("td").eq(8).children("p").html())
                - parseFloat($tr_array.eq(i).children("td").eq(12).children("p").html())
                - parseFloat($tr_array.eq(i).children("td").eq(14).children("p").html())
                - (parseFloat($tr_array.eq(i).children("td").eq(15).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html()))
                - (parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(16).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(10).children("p").html()));
                //- (parseFloat($tr_array.eq(i).children("td").eq(18).children("input").val()) * parseFloat($tr_array.eq(i).children("td").eq(9).children("p").html()) / 3 * (3-(parseFloat($tr_array.eq(i).children("td").eq(19).children("input").val()))));
            t15 = isNaN(t15)?0:t15;

            /**
             * lyj-update
             * 改实际数额
             */
            $tr_array.eq(i).children("td").eq(21).html(
                parseFloat(t15).toFixed(1)+"<p hidden>"+t15+"</p>"
            );
        }
    }

    //改员工比例表中人的钱
    function calculate_emp() {
        /**
         * 1.对应每个办事处的钱要知道
         * 获得 办事处奖金分配表的id 和 钱
         */
        var $tr_array = $("#example1 tbody tr");
        //var this_data = new Array(
        var update_data = new Array();
        var this_data = [];
        var money = 0;
        for (var i = 0; i < $tr_array.length; i++)
        {
            money = $tr_array.eq(i).children("td").eq(21).children("p").html();
            money = isNaN(money)?0:money;
            //this_data[i] = {ID:$tr_array.eq(i).children("td").eq(1).html(),MONEY:money}
            this_data[i] = [$tr_array.eq(i).children("td").eq(1).html(),money];
            //this_data.push({ID:$tr_array.eq(i).children("td").eq(1).html(),MONEY:money});
        }

        light.doget("/performance/getEmpMoney", {"req_data":this_data}, function(err,result) {
            if(result) {
                //console.log("****result:",result);
                for (var i = 0; i < result.length; i++) {
                    update_data[i] = {MONEY:result[i][0],ID:result[i][1]};
                }

                /**
                 * 2.计算这个办事处员工的钱
                 */
                light.doput("/performance/updateEmpMoney", {"update_data":update_data}, function (err, result){

                    if (!result && timeFlag === 1) {
                        alert("取得数据错误！")
                    }
                    else
                    {
                        if (result.result && timeFlag === 1)
                        {
                            alertify.success("算钱成功");
                        }else if(result.result && timeFlag === 0) {
                            return;
                        }
                        else
                        {
                            alertify.error("算钱失败");
                        }
                    }

                });
            }

        });

    }
});
