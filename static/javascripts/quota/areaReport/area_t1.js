/**
 * Created by root on 14-12-8.
 */
$(function () {

    "use strict";

    //// 当前选中的年
    //var year;
    ////当前选中的季度
    //var quarter;
    ////当前选中的月
    //var month;
    //当前选中的是季报还是月报
    //var month_quarter;
    var quarter_firstMonth;
    var areaPersonCount;
    //var currentReport="month"

    setPageInitData();


    function setPageInitData() {

        var date_year,date_quarter;
        if($("#hid_year").val() == ""){

            light.doget("/common/getCurrYearMonth",function(err, result) {
                if (err) {
                    console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                    if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                        window.location = "/site/login";
                    }
                }
                if (!result) {
                    return;
                }

                date_year = result[0]["YEARS"];
                date_quarter = result[0]["MONTHS"];
                var date_year_n = parseInt(date_year) + 1;
                var date_year_2n = parseInt(date_year) + 2;

                $("#year").html(date_year);
                $("#year_n").html(date_year_n);
                $("#year_2n").html(date_year_2n);

                $("#hid_date_year").val(date_year);
                $("#hid_date_year_n").val(date_year_n);
                $("#hid_date_year_2n").val(date_year_2n);

                $(".yearGroup").removeClass("active");
                $("#year").addClass("active");

                // 获得当前 月份 和 季度

                var quarter;
                // 当前 月份 被选中
                $(".quarterGroup").removeClass("active");
                // 当前 季度 被选中
                if(date_quarter <= 3){
                    $("#quarter_1").addClass("active");
                    //$("#hid_quarter").val(1);
                    quarter = 1;
                }else if(date_quarter > 3 && date_quarter <= 6){
                    $("#quarter_2").addClass("active");
                    //$("#hid_quarter").val(2);
                    quarter = 2;
                }else if(date_quarter > 6 && date_quarter <= 9){
                    $("#quarter_3").addClass("active");
                    //$("#hid_quarter").val(3);
                    quarter = 3;
                }else{
                    $("#quarter_4").addClass("active");
                    //$("#hid_quarter").val(4);
                    quarter = 4;
                }
                $(".monthGroup").removeClass("active");
                $("#month_"+date_quarter).addClass("active");


                //$("#hid_year").val(date_year);
                //$("#hid_month").val(date_quarter);
                //$("#hid_month_quarter").val("month");
                //year = date_year;
                //month = date_quarter;
                //month_quarter ="month";

                $("#hid_year").val(date_year);
                $("#hid_quarter").val(quarter);
                $("#hid_month").val(date_quarter);

                events();
                //loadMonthGrid();

                if($("#hid_currentReport").val() == 'month'){
                    loadMonthGrid();
                }else{
                    loadQuarterGrid();
                }
            })

        }

        else{
            // 获得当前 月份 和 季度
            date_year = $("#hid_year").val();
            date_quarter = $("#hid_month").val();

            $("#year").html($("#hid_date_year").val());
            $("#year_n").html($("#hid_date_year_n").val());
            $("#year_2n").html($("#hid_date_year_2n").val());


            if(date_year == $("#hid_date_year").val()){
                $(".yearGroup").removeClass("active");
                $("#year").addClass("active");
            }
            //if(date_year == $("#hid_date_year_n").val()){
            //    $(".yearGroup").removeClass("active");
            //    $("#year_n").addClass("active");
            //}
            //if(date_year == $("#hid_date_year_2n").val()){
            //    $(".yearGroup").removeClass("active");
            //    $("#year_2y").addClass("active");
            //}


            var quarter;
            // 当前 月份 被选中
            $(".quarterGroup").removeClass("active");
            // 当前 季度 被选中
            if(date_quarter <= 3){
                $("#quarter_1").addClass("active");
                //$("#hid_quarter").val(1);
                quarter = 1;
            }else if(date_quarter > 3 && date_quarter <= 6){
                $("#quarter_2").addClass("active");
                //$("#hid_quarter").val(2);
                quarter = 2;
            }else if(date_quarter > 6 && date_quarter <= 9){
                $("#quarter_3").addClass("active");
                //$("#hid_quarter").val(3);
                quarter = 3;
            }else{
                $("#quarter_4").addClass("active");
                //$("#hid_quarter").val(4);
                quarter = 4;
            }
            $(".monthGroup").removeClass("active");
            $("#month_"+ moment(date_quarter).format('MM')).addClass("active");

            //$("#hid_year").val(date_year);
            //$("#hid_month").val(date_quarter);
            //$("#hid_month_quarter").val("month");
            //year = date_year;
            //month = date_quarter;
            //month_quarter ="month";
            events();
            if($("#hid_currentReport").val() == 'month'){
                $(".mqGroup").removeClass("active");
                $("#mq_month").addClass("active");
                $("#month").show();
                $("#quarter").hide()
                loadMonthGrid();

            }else{
                $(".mqGroup").removeClass("active");
                $("#mq_quarter").addClass("active");
                $("#month").hide();
                $("#quarter").show()
                loadQuarterGrid();
            }


        }



    }
    // 绑定事件
    function events() {
        $(".yearGroup").bind("click",function(){

            // toggle 的意思是 隐藏和显示相互切换
            $(".yearGroup").removeClass("active");
            $(this).addClass("active");

            $("#hid_year").val($(this).html());
            if($("#hid_currentReport").val() == 'month'){
                loadMonthGrid();
            }else{
                loadQuarterGrid();
            }


        });

        /**
         * 选择后两年
         */
        $(".yearGroup-n").bind("click",function(){
            alert("没有数据！");
        });

        $(".quarterGroup").bind("click",function(){

            // toggle 的意思是 隐藏和显示相互切换
            $(".quarterGroup").removeClass("active");
            $(this).addClass("active");
            $("#hid_quarter").val($(this).attr("role-type"));
            loadQuarterGrid();
        });

        $(".monthGroup").bind("click",function(){
            // toggle 的意思是 隐藏和显示相互切换
            $(".monthGroup").removeClass("active");
            $(this).addClass("active");
            $("#hid_month").val($(this).attr("role-type"));

            loadMonthGrid();
        });

        $(".mqGroup").bind("click",function(){

            // toggle 的意思是 隐藏和显示相互切换
            $(".mqGroup").removeClass("active");
            $(this).addClass("active");

            //$("#month").toggle();
            //$("#quarter").toggle();

            var type = $(this).attr("role-type");
            if(type == "quarter"){
                $("#month").hide();
                $("#quarter").show()
                loadQuarterGrid();

            }
            if(type == "month"){
                $("#quarter").hide();
                $("#month").show()
                loadMonthGrid();
            }
            $("#hid_month_quarter").val(type);

        });
    }
    function loadMonthGrid() {
        $("#hid_currentReport").val("month");
        $("#monthGrid").show();
        $("#quarterGrid").hide();
        //console.log("report: departmentReportForMonth:departmentCode=" + departmentCode +";year="+year+";month="+month)
        light.doget("/quota/areaReportForMonth",{indexArea: $("#hid_areaCode").val(),year:$("#hid_year").val(),month:$("#hid_month").val()}, function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            if(!result){
                return;
            }

            if(result.length > 0){
                areaPersonCount = result[0].DEPTPERSONS;
            }

            var jiafen = 0;
            var jianfen = 0;
            $(result).each(function(index,element){
                // 01 加分
                if(element.INDEXTYPE == '01'){
                    jiafen =Number(jiafen) + Number(element.PERFORMANCEPOINT);
                }
                else{
                    jianfen =Number(jianfen) + Number(element.PERFORMANCEPOINT);
                }
            })

            var monthTotal = parseInt(jiafen) - parseInt(jianfen);


            renderMonthGrid(result,monthTotal);

        });

    }

    function renderMonthGrid(result,monthTotal){
        var grid_selector = "#grid-table";
        var pager_selector = "";

        //resize to fit page size
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid( 'setGridWidth', $("#page-content").width() );
        })
        //resize on sidebar collapse/expand
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
            if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
                $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
            }
        })
        //console.log(result)
        jQuery(grid_selector).jqGrid({
            data:result,
            datatype: "local",
            height: "auto",
            autoScroll: true,
            shrinkToFit:false,
            rowNum:result.length,
            colNames:
                [
                    'sort',
                    '类别',
                    '考核项',
                    '单位',
                    '指标类型',
                    '分值',
                    //'权重',
                    '任务量',
                    '计划量',
                    '完成量',
                    '评价',
                    '达标率',
                    '绩效点',
                    '人均量',
                    '人均绩点'
                ],
            colModel:[
                {name:'INDEXORDER',index:'INDEXORDER', sorttype:"int",width:180,editable: false,sortable: false,hidden:true},
                {name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:40,editable: false ,sortable: false,align:'left',  summaryType:'sum', summaryTpl:'<b class="color: blue">合计:</b>'},
                {name:'INDEXNAME',index:'INDEXNAME', width:180,editable: false,sortable: false,align:'left'},
                {name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:40,editable: false ,sortable: false,align:'left'},
                {name:'INDEXTYPENAME',index:'INDEXTYPENAME', width:40,editable: false ,sortable: false,align:'left'},
                {name:'INDEXVALUE',index:'INDEXVALUE', width:40, sorttype:"int", editable: false  ,sortable: false,align:'right'},
                //{name:'WEIGHTNUMBER',index:'WEIGHTNUMBER', width:40,formatter:"int", sorttype:"int", editable: false  ,sortable: false,align:'right',  summaryType:'sum', summaryTpl:'<b>{0}</b>'},
                {name:'QUOTA',index:'QUOTA',  sorttype:"int", formatter:"int",width:70, editable: false  ,sortable: false,align:'right'},
                {name:'PLAN',index:'PLAN',  sorttype:"int", formatter:"int",width:70, editable: false  ,sortable: false,align:'right'},
                {name:'ACT',index:'ACT',  sorttype:"int", formatter:"int",width:70, editable: false  ,sortable: false,align:'right'},
                {name:'EVACOEFFICIENT',index:'EVACOEFFICIENT',  sorttype:"int", formatter:"number",width:70, editable: false ,sortable: false,align:'right'},
                {name:'STANDARDRATE',index:'STANDARDRATE',width:70, editable: false ,sortable: false,align:'right',formatter:"number",formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:'',suffix:'%'}},
                {name:'PERFORMANCEPOINT',index:'PERFORMANCEPOINT',  sorttype:"number", formatter:"number",width:70, editable: false ,sortable: false,formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''},align:'right', summaryType:'sum', summaryTpl:'<b>{0}</b>'},

                {name:'PERCAPITA',index:'PERCAPITA',  sorttype:"number", width:70, editable: false ,sortable: false,align:'right', formatter:"number" ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}},
                {name:'PERPERFORMANCEPOINT',index:'PERPERFORMANCEPOINT', sorttype:"number",formatter:"number" , width:70,editable: false ,sortable: false,align:'right', formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}}

            ],

            viewrecords : true,
            pager : pager_selector,
            rownumbers:true,
            //editurl: "/dummy.html",//nothing is saved
            caption: $("#hid_year").val()+"年"+$("#hid_month").val()+"月-"+$("#hid_areaName").val()+" - 考核指标一览",
            loadComplete: function (data) {
                // ui-jqgrid-title

                $(this).closest('.ui-jqgrid-view').find('.ui-jqgrid-title').html($("#hid_year").val()+"年"+$("#hid_month").val()+"月-"+$("#hid_areaName").val()+" - 考核指标一览");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("text-align","center");
                // ui-jqgrid-title
                $(this).closest('.ui-jqgrid-view').find('span.ui-jqgrid-title').css("float","center");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("color","#777");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("background","white");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("font-size","20px");

                $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("color","white");
                $(this).closest('.ui-jqgrid-view').find('tr.jqg-second-row-header').css("border-bottom","1px white solid");
                $(this).closest('.ui-jqgrid-view').find('tr th').css("border","0");

                //jqg-third-row-header 表头高度
                $(this).closest('.ui-jqgrid-view').find('.jqg-third-row-header').css("height","25px");
                // 人数 那行高度
//                $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("height",22);

                // 控制 行 高度
                $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("padding",2);
                $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("height",25);


                // 添加一行
                var selectedId = $("#grid-table").jqGrid("getGridParam", "selrow");
                var ids = jQuery("#grid-table").jqGrid('getDataIDs');
                var rowid = Math.max.apply(Math,ids);
                var newrowid = rowid+1;

                var tempRow = {
                    INDEXORDER:"",
                    INDEXSMALLNAME:"总计",
                    INDEXNAME:"",
                    INDEXUNITNAME:"",
                    INDEXTYPENAME:"",
                    INDEXVALUE:"",
                    QUOTA:"",
                    PLAN:"",
                    ACT:"",
                    EVACOEFFICIENT:"",
                    STANDARDRATE:"",
                    PERFORMANCEPOINT:monthTotal,
                    PERCAPITA:"",
                    PERPERFORMANCEPOINT:""
                }
                $("#grid-table").jqGrid("addRowData", newrowid, tempRow, "last");

                //var rowNew = $("#grid-table").jqGrid("getRowData", newrowid);

                $("tr[id=" +newrowid+"]","#grid-table").children("td").eq(9).html("");
                $("tr[id=" +newrowid+"]","#grid-table").children("td").eq(10).html("");
                $("tr[id=" +newrowid+"]","#grid-table").children("td").eq(12).html("");
                $("tr[id=" +newrowid+"]","#grid-table").children("td").eq(13).html("");

            },
            sortname: 'INDEXORDER',
            grouping:true,
            groupingView : {
                groupField : ['INDEXTYPENAME'],
                groupColumnShow : [false],
                groupText : ['<b>{0} - {1} 项</b>'],
                groupOrder: ['desc'],
                groupSummary: [true],
                groupCollapse: false
            }

        });
        $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size

        //navButtons
        jQuery(grid_selector).jqGrid('navGrid',pager_selector,
            { 	//navbar options
                edit: false,
                editicon : 'ace-icon fa fa-pencil blue',
                add: false,
                addicon : 'ace-icon fa fa-plus-circle purple',
                del: false,
                delicon : 'ace-icon fa fa-trash-o red',
                search: false,
                searchicon : 'ace-icon fa fa-search orange',
                refresh: false,
                refreshicon : 'ace-icon fa fa-refresh green'
                //view: true,
                //viewicon : 'ace-icon fa fa-search-plus grey'
            }

        )
        //
        jQuery(grid_selector).jqGrid('setGroupHeaders', {
            useColSpanStyle: false,
            groupHeaders:[
                {startColumnName: 'INDEXSMALLNAME', numberOfColumns:1, titleText: '人数',align:'center'},
                {startColumnName: 'INDEXNAME', numberOfColumns: 1, titleText: areaPersonCount+'人'}
            ]
        });

        $(grid_selector).jqGrid('setGridParam',{
            data:result,
            datatype: "local",
            page:1,
            rowNum:result.length
        }).trigger("reloadGrid")

    }

    function loadQuarterGrid() {

        $("#hid_currentReport").val("quarter");
        $("#monthGrid").hide();
        $("#quarterGrid").show();
        var  quarter = $("#hid_quarter").val()
        if(quarter == 1){
            quarter_firstMonth= 1;
        }
        if(quarter == 2){
            quarter_firstMonth= 4;
        }
        if(quarter == 3){
            quarter_firstMonth= 7;
        }
        if(quarter == 4){
            quarter_firstMonth= 10;
        }

        //console.log("indexArea="+ $("#hid_areaCode").val()+"year=" + $("#hid_year").val() + "quarter_firstMonth="+quarter_firstMonth)
        light.doget("/quota/areaReportForQuarter", {
            indexArea: $("#hid_areaCode").val(),
            year: $("#hid_year").val(),
            month: quarter_firstMonth
        }, function (err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            if (!result) {
                return;
            }

            var jidu_jiafen = 0;
            var jidu_jianfen = 0;
            var f_jiafen = 0;
            var f_jianfen = 0;
            var s_jiafen = 0;
            var s_jianfen = 0;
            var t_jiafen = 0;
            var t_jianfen = 0;
            $(result).each(function(index,element){
                // 01 加分
                if(element.INDEXTYPE == '01'){
                    jidu_jiafen =Number(jidu_jiafen) + Number(element.QUARTER_PERFORMANCEPOINT);
                    f_jiafen =Number(f_jiafen) + Number(element.F_PERFORMANCEPOINT);
                    s_jiafen =Number(s_jiafen) + Number(element.S_PERFORMANCEPOINT);
                    t_jiafen =Number(t_jiafen) + Number(element.T_PERFORMANCEPOINT);
                }
                else{
                    jidu_jianfen =Number(jidu_jianfen) + Number(element.QUARTER_PERFORMANCEPOINT);
                    f_jianfen =Number(f_jianfen) + Number(element.F_PERFORMANCEPOINT);
                    s_jianfen =Number(s_jianfen) + Number(element.S_PERFORMANCEPOINT);
                    t_jianfen =Number(t_jianfen) + Number(element.T_PERFORMANCEPOINT);
                }
            })

            var jidu_Total = parseInt(jidu_jiafen) - parseInt(jidu_jianfen);
            var f_Total = parseInt(f_jiafen) - parseInt(f_jianfen);
            var s_Total = parseInt(s_jiafen) - parseInt(s_jianfen);
            var t_Total = parseInt(t_jiafen) - parseInt(t_jianfen);

            //console.log(result)
            renderQuarterGrid(result,jidu_Total,f_Total,s_Total,t_Total);

        });
    }
    function renderQuarterGrid(result,jidu_Total,f_Total,s_Total,t_Total){
        var grid_selector = "#quarter-grid-table";
        var pager_selector = "";

        //resize to fit page size
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid( 'setGridWidth', $("#page-content").width() );
        })
        //resize on sidebar collapse/expand
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
            if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
                $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
            }
        })

        jQuery(grid_selector).jqGrid({
            data: result,
            datatype: "local",
            height: 'auto',
            autoScroll: true,
            shrinkToFit:false,
            rowNum: result.length,
            colNames:['sort','类别','考核项','单位','类型','任务量','完成量','达标率','绩效点','人均量','任务量','完成量','达标率','绩效点','人均量','任务量','完成量','达标率','绩效点','人均量', '任务量', '完成量', '达标率', '绩效点', '人均量'],
            colModel:[
                {name:'INDEXORDER',index:'INDEXORDER', sorttype:"int",width:180,editable: false,hidden:true},
                {name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:40,editable: false ,sortable: false,align:'left',summaryType:'sum', summaryTpl:'<b class="color: red">合计:</b>'},
                {name:'INDEXNAME',index:'INDEXNAME', width:180,editable: false ,sortable: false,align:'left'},
                {name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:40,editable: false ,sortable: false,align:'left'},
                {name:'INDEXTYPENAME',index:'INDEXTYPENAME', width:40,editable: false ,sortable: false,align:'left'},

                {name:'QUARTER_QUOTA',index:'QUARTER_QUOTA', width:70,editable: false  ,sortable: false,align:'right', sorttype:"int", formatter:"int" },
                {name:'QUARTER_ACT',index:'QUARTER_ACT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int" },
                {name:'QUARTER_STANDARDRATE',index:'QUARTER_STANDARDRATE', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:'',suffix:'%'}},
                {name:'QUARTER_PERFORMANCEPOINT',index:'QUARTER_PERFORMANCEPOINT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''} ,  summaryType:'sum', summaryTpl:'<b>{0}</b>'},
                {name:'QUARTER_PERCAPITA',index:'QUARTER_PERCAPITA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number"  ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}},

                {name:'F_QUOTA',index:'F_QUOTA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int" },
                {name:'F_ACT',index:'F_ACT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int"},
                {name:'F_STANDARDRATE',index:'F_STANDARDRATE', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number",formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:'',suffix:'%'}},
                {name:'F_PERFORMANCEPOINT',index:'F_PERFORMANCEPOINT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number",formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''} ,  summaryType:'sum', summaryTpl:'<b>{0}</b>'},
                {name:'F_PERCAPITA',index:'F_PERCAPITA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''} },

                {name:'S_QUOTA',index:'S_QUOTA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int"},
                {name:'S_ACT',index:'S_ACT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int" },
                {name:'S_STANDARDRATE',index:'S_STANDARDRATE', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number",formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:'',suffix:'%'}},
                {name:'S_PERFORMANCEPOINT',index:'S_PERFORMANCEPOINT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''},  summaryType:'sum', summaryTpl:'<b>{0}</b>'},
                {name:'S_PERCAPITA',index:'S_PERCAPITA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}},

                {name:'T_QUOTA',index:'T_QUOTA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int" },
                {name:'T_ACT',index:'T_ACT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"int", formatter:"int" },
                {name:'T_STANDARDRATE',index:'T_STANDARDRATE', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number",formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:'',suffix:'%'}},
                {name:'T_PERFORMANCEPOINT',index:'T_PERFORMANCEPOINT', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''},  summaryType:'sum', summaryTpl:'<b>{0}</b>'},
                {name:'T_PERCAPITA',index:'T_PERCAPITA', width:70,editable: false  ,sortable: false,align:'right',sorttype:"number", formatter:"number" ,formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}}
            ],
            pager: "",
            rownumbers:true,
            viewrecords: true,
            caption: $("#hid_year").val()+"年"+$("#hid_quarter").val()+"季度-"+$("#hid_areaName").val()+" - 考核指标一览",
            loadComplete: function () {
                $(this).closest('.ui-jqgrid-view').find('.ui-jqgrid-title').html($("#hid_year").val()+"年"+$("#hid_quarter").val()+"季度-"+$("#hid_areaName").val()+" - 考核指标一览");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("text-align","center");
                // ui-jqgrid-title
                $(this).closest('.ui-jqgrid-view').find('span.ui-jqgrid-title').css("float","center");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("color","#777");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("background","white");
                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("font-size","20px");

                $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("color","white");
                $(this).closest('.ui-jqgrid-view').find('tr.jqg-second-row-header').css("border-bottom","1px white solid");
                $(this).closest('.ui-jqgrid-view').find('tr th').css("border","0");

                // 人数 那行高度
//                $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("height",22);

                // 控制 行 高度
                $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("padding",2);
                $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("height",25);

                // 添加一行
                var selectedId = $("#quarter-grid-table").jqGrid("getGridParam", "selrow");
                var ids = jQuery("#quarter-grid-table").jqGrid('getDataIDs');
                var rowid = Math.max.apply(Math,ids);
                var newrowid = rowid+1;

                var tempRow = {
                    INDEXORDER:"",
                    INDEXSMALLNAME:"总计",
                    INDEXNAME:"",
                    INDEXUNITNAME:"",
                    INDEXTYPENAME:"",
                    QUARTER_QUOTA:"",
                    QUARTER_ACT:"",
                    QUARTER_STANDARDRATE:"",
                    QUARTER_PERFORMANCEPOINT:"",
                    QUARTER_PERCAPITA:"",
                    F_QUOTA:"",
                    F_ACT:"",
                    F_STANDARDRATE:"",
                    F_PERFORMANCEPOINT:"",
                    F_PERCAPITA:"",
                    S_QUOTA:"",
                    S_ACT:"",
                    S_STANDARDRATE:"",
                    S_PERFORMANCEPOINT:"",
                    S_PERCAPITA:"",
                    T_QUOTA:"",
                    T_ACT:"",
                    T_STANDARDRATE:"",
                    T_PERFORMANCEPOINT:"",
                    T_PERCAPITA:""
                }
                $("#quarter-grid-table").jqGrid("addRowData", newrowid, tempRow, "last");

                //var rowNew = $("#grid-table").jqGrid("getRowData", newrowid);

                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").html("");
                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").eq(1).html("总计");
                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").eq(8).html(jidu_Total);
                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").eq(13).html(f_Total);
                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").eq(18).html(s_Total);
                $("tr[id=" +newrowid+"]","#quarter-grid-table").children("td").eq(23).html(t_Total);
            },
            sortname: 'INDEXORDER',
            grouping:true,
            groupingView : {
                groupField : ['INDEXTYPENAME'],
                groupColumnShow : [false],
                groupText : ['<b>{0} - {1} 项</b>'],
                groupOrder: ['desc'],
                groupSummary: [true],
                groupCollapse: false
            }

        });
        $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size

        jQuery(grid_selector).jqGrid('setGroupHeaders', {
            useColSpanStyle: false,
            groupHeaders:[
                {startColumnName: 'INDEXSMALLNAME', numberOfColumns:1,align:'center'},// titleText: year+'年',
                {startColumnName: 'INDEXNAME', numberOfColumns: 1},// titleText: '信风内贸公司'
                {startColumnName: 'INDEXUNITNAME', numberOfColumns: 1},// titleText: quarter+'季度'
                {startColumnName: 'QUARTER_QUOTA', numberOfColumns: 5, titleText: $("#hid_quarter").val()+'季度'},
                {startColumnName: 'F_QUOTA', numberOfColumns: 5, titleText: quarter_firstMonth +'月'},
                {startColumnName: 'S_QUOTA', numberOfColumns: 5, titleText: quarter_firstMonth +1+'月'},
                {startColumnName: 'T_QUOTA', numberOfColumns: 5, titleText: quarter_firstMonth +2+'月'}
            ]
        });


        $(grid_selector).jqGrid('setGridParam',{
            data:result,
            datatype: "local",
            caption: $("#hid_year").val()+"年"+$("#hid_quarter").val()+"季度-"+$("#hid_areaName").val()+" - 考核指标一览",
            page:1,
            rowNum:result.length
        }).trigger("reloadGrid")

    }


});