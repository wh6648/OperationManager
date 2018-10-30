/**
 * Created by root on 14-12-8.
 */
$(function () {

    //// 当前选中的年
    //var year;
    ////当前选中的季度
    //var quarter;
    ////当前选中的月
    //var month;
    ////当前选中的是季报还是月报
    //var month_quarter;
    var quarter_firstMonth;
    //var currentReport="month"
    //
    var colNames =  ['sort','类别', '考核项', '单位', '分值','type'];
    var colModel=[]
    if($("#hid_type").val() == 'gpoint'){
        colModel=
            [
                //{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                //    formatter:'actions',
                //    formatoptions:{
                //        keys:true,
                //
                //        delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
                //        //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                //    }
                //},
                {name:'INDEXORDER',index:'INDEXORDER', sorttype:"int",width:180,editable: false,hidden:true},
                {name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:40,editable: false,sortable: false,  summaryType:'sum', summaryTpl:'<b class="color: red">合计:</b>'},
                {name:'INDEXNAME',index:'INDEXNAME', width:180,editable: false,sortable: false},
                {name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:40,editable: false,sortable: false},
                {name:'INDEXVALUE',index:'INDEXVALUE', width:40, sorttype:"int", editable: false,sortable: false,align:'right'},
                {name:'INDEXTYPE',index:'INDEXTYPE', width:40,editable: false,sortable: false}
            ];
    }else{
        colModel=
            [
                //{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                //    formatter:'actions',
                //    formatoptions:{
                //        keys:true,
                //
                //        delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
                //        //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                //    }
                //},
                {name:'INDEXORDER',index:'INDEXORDER', sorttype:"int",width:180,editable: false,hidden:true},
                {name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:40,editable: false,sortable: false},
                {name:'INDEXNAME',index:'INDEXNAME', width:180,editable: false,sortable: false},
                {name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:40,editable: false,sortable: false},
                {name:'INDEXVALUE',index:'INDEXVALUE', width:40, sorttype:"int", editable: false,sortable: false,align:'right'},
                {name:'INDEXTYPE',index:'INDEXTYPE', width:40,editable: false,sortable: false}
            ];
    }


    var groupHeaders=
        [
            {startColumnName: 'INDEXSMALLNAME', numberOfColumns:1, titleText: '人数',align:'center'}
        ];

    setPageEvent();
    setPageInitData();


//    loadGridData();

    function setPageEvent(){

        $(".yearGroup").bind("click",function(){

            // toggle 的意思是 隐藏和显示相互切换
            $(".yearGroup").removeClass("active");
            $(this).addClass("active");

            $("#hid_year").val($(this).html());
            year = $(this).html()

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
            quarter = $(this).attr("role-type");
            loadQuarterGrid();
        });

        $(".monthGroup").bind("click",function(){
            // toggle 的意思是 隐藏和显示相互切换
            $(".monthGroup").removeClass("active");
            $(this).addClass("active");
            $("#hid_month").val($(this).attr("role-type"));

            month = $(this).attr("role-type");
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

    function setPageInitData() {
        var date_year,date_quarter;
        if($("#hid_year").val() == "") {
            light.doget("/common/getCurrYearMonth", function (err, result) {
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

                var quarter;
                // 当前 月份 被选中
                $(".quarterGroup").removeClass("active");
                // 当前 季度 被选中
                if (date_quarter <= 3) {
                    $("#quarter_1").addClass("active");
                    //$("#hid_quarter").val(1);
                    quarter = 1;
                } else if (date_quarter > 3 && date_quarter <= 6) {
                    $("#quarter_2").addClass("active");
                    //$("#hid_quarter").val(2);
                    quarter = 2;
                } else if (date_quarter > 6 && date_quarter <= 9) {
                    $("#quarter_3").addClass("active");
                    //$("#hid_quarter").val(3);
                    quarter = 3;
                } else {
                    $("#quarter_4").addClass("active");
                    //$("#hid_quarter").val(4);
                    quarter = 4;
                }
                $(".monthGroup").removeClass("active");
                $("#month_" + date_quarter).addClass("active");


                $("#hid_year").val(date_year);
                $("#hid_quarter").val(quarter);
                $("#hid_month").val(date_quarter);

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
            //if(date_year == $("#hid_date_year_y").val()){
            //    $(".yearGroup").removeClass("active");
            //    $("#year_y").addClass("active");
            //}
            //if(date_year == $("#hid_date_year_2y").val()){
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

    function loadMonthGrid(){
        $("#hid_currentReport").val("month");
        // 获取动态列
        loadMonthGridcol();
    }


    /**
     * 获取动态列
     */
    function loadMonthGridcol(){

        $("#monthGrid").show();
        $("#quarterGrid").hide();

        //$("#hid_year").val()
        //$("#hid_month").val()

        light.doget("/quota/getAllDepartment",{year:$("#hid_year").val(),month:$("#hid_month").val()},function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            //console.log(result)
            if(!result){
                return;
            }
            $.each(result,function(index,element){
                //console.log(element['DEPTNAME'])
                colNames[index+6] = element['DEPTNAME'];
                // {name:'001',index:'市场部', width:60, sorttype:"int", editable: false}
                //console.log(element['DEPTCODE'])

                if($("#hid_type").val() == 'gpoint'){
                    var col = {
                        name:element['DEPTCODE'],
                        index:element['DEPTCODE'],
                        width:65,
//                        formatter:"number",
                        sorttype:"int",
                        sortable: false,
                        editable: false,
                        align:'right',
//                        formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''},
                        summaryType:'sum',
                        summaryTpl:'<b>{0}</b>'
                    }
                    colModel[index+6] = col;
                }
                else{
                    var col = {
                        name:element['DEPTCODE'],
                        index:element['DEPTCODE'],
                        width:65,
//                        formatter:"number",
                        sorttype:"int",
                        sortable: false,
                        editable: false,
                        align:'right'
//                        formatoptions:{decimalPlaces: 0, defaulValue: 0,thousandsSeparator:''}
                    }

                    colModel[index+6] = col;
                }


                //var groupHeaders=
                //    [
                //        {startColumnName: 'INDEXSMALLNAME', numberOfColumns:1, titleText: '人数 :',align:'center'},
                //        {startColumnName: 'INDEXNAME', numberOfColumns: 1, titleText: $("#hid_areaPersonCount").val()+'人'}
                //    ];

                var header =
                {
                    startColumnName :element['DEPTCODE'],
                    numberOfColumns:1,
                    titleText:element['DEPTPERSONS']
                }

                groupHeaders[index+1] = header;

            })
            //console.log(result)
            //console.log(colModel)
            // console.log(colNames)
            rendorMonthGridData();
        });

    }

    function rendorMonthGridData() {

// 暂时 < || "quota"  >  为了让指标填报那块不死的写法，是暂时的...

        light.doget("/quota/companyQuotaMonthReport",{p_monthQuarter:'month',p_type: $("#hid_type").val() || "quota",p_year:$("#hid_year").val(),p_month:$("#hid_month").val()},function(err, result) {
            //console.log("%%%%%%%%%%" ,result);
        //light.doget("/quota/companyQuotaMonthReport",{type: $("#hid_type").val(),year:year,month:month},function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            if(!result){
                return;
            }

            //console.log(result.returnParam);

            //console.log(colNames);
            //console.log(colModel);

            var month_grid_data = result.returnParam;
            var month_rowNum = month_grid_data.length;
            //console.log(month_grid_data)
            jQuery(function($) {
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

                jQuery(grid_selector).jqGrid({
                    data:month_grid_data,
                    datatype: "local",
                    height: "auto",
                    autoScroll: true,
                    shrinkToFit:false,
                    rowNum:month_rowNum,
                    colNames:colNames,
                    colModel:colModel,
                    viewrecords : true,
                    pager : pager_selector,
                    rownumbers:true,
                    caption: $("#hid_year").val()+"年"+$("#hid_month").val()+"月-"+$("#hid_company_name").val()+"报表一览",
                    gridComplete: function () {
                        $(this).closest('.ui-jqgrid-view').find('.ui-jqgrid-title').html($("#hid_year").val()+"年"+$("#hid_month").val()+"月-"+$("#hid_company_name").val()+"报表一览");
                        $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("text-align","center");
                        // ui-jqgrid-title
                        $(this).closest('.ui-jqgrid-view').find('span.ui-jqgrid-title').css("float","center");
                        $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("color","#777");
                        $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("background","white");
                        $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("font-size","20px");


                        // jqg-second-row-header height: 45px !important;  ui-th-column-header
//                        $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("color","white");
//                        $(this).closest('.ui-jqgrid-view').find('tr.jqg-second-row-header').css("border-bottom","1px white solid");
//                        $(this).closest('.ui-jqgrid-view').find('tr th').css("height","35px");
//                        // jqg-third-row-header
//                        $(this).closest('.ui-jqgrid-view').find('.jqg-first-row-header').css("display","none");
//
//                        $(this).closest('.ui-jqgrid-view').find('tr th').css("border","0");

                        $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("color","white");
                        $(this).closest('.ui-jqgrid-view').find('tr.jqg-second-row-header').css("border-bottom","1px white solid");
                        $(this).closest('.ui-jqgrid-view').find('tr th').css("border","0");

                        // 人数 那行高度
//                $(this).closest('.ui-jqgrid-view').find('.ui-th-column-header').css("height",22);

                        // 控制 行 高度
                        $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("padding",2);
                        $(this).closest('.ui-jqgrid-view').find('tr.ui-row-ltr td, .ui-jqgrid tr.ui-row-rtl td').css("height",25);

                    },
                    sortname: 'INDEXORDER',
                    grouping:true,
                    groupingView : {
                        groupField : ['INDEXTYPE'],
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

                jQuery(grid_selector).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:groupHeaders
                });

                jQuery(grid_selector).jqGrid('setGridParam',{
                    data:month_grid_data,
                    datatype: "local",
                    page:1,
                    rowNum:month_rowNum
                }).trigger("reloadGrid")
            });


        });
    }

    function loadQuarterGrid(){
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
        light.doget("/quota/getAllDepartmentForQuarter",{year:$("#hid_year").val(),month:quarter_firstMonth},function(err, result) {

            //console.log(result)
            if(!result){
                return;
            }
            $.each(result,function(index,element){
                //console.log(element['DEPTNAME'])

                colNames[index+6] = element['DEPTNAME'];

                // {name:'001',index:'市场部', width:60, sorttype:"int", editable: false}
                //console.log(element['DEPTCODE'])
                if($("#hid_type").val() == 'gpoint'){
                    var col = {
                        name:element['DEPTCODE'],
                        index:element['DEPTCODE'],
                        width:65,
//                        formatter:"number",
                        sorttype:"number",
                        sortable: false,
                        editable: false,
                        align:'right',
//                        formatoptions:{decimalPlaces: 0, defaulValue: 0.00,thousandsSeparator:''},
                        summaryType:'sum',
                        summaryTpl:'<b>{0}</b>'
                    }

                    colModel[index+6] = col;
                }else{
                    var col = {
                        name:element['DEPTCODE'],
                        index:element['DEPTCODE'],
                        width:65,
//                        formatter:"number",
                        sorttype:"int",
                        sortable: false,
                        editable: false,
                        align:'right'
//                        formatoptions:{decimalPlaces: 2, defaulValue: 0.00,thousandsSeparator:''}
                    }

                    colModel[index+6] = col;
                }


                var header =
                {
                    startColumnName :element['DEPTCODE'],
                    numberOfColumns:1,
                    titleText:element['DEPTPERSONS']
                }

                groupHeaders[index+1] = header;


            })
            //console.log(result)
            //console.log(colModel)
            // console.log(colNames)
            renderQuarterGrid();
        });
    }

    function renderQuarterGrid(result){
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
       //console.log("quarter grid p_type=" +$("#hid_type").val()+ ";year=" + year+";month=" + quarter_firstMonth);
        //light.doget("/quota/companyQuotaQuarterReport",{type: $("#hid_type").val(),year:year,month:quarter_firstMonth},function(err, result) {
        light.doget("/quota/companyQuotaMonthReport",{p_monthQuarter:'quarter',p_type: $("#hid_type").val(),p_year:$("#hid_year").val(),p_month:quarter_firstMonth},function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            if(!result){
                return;
            }
            grid_data = result.returnParam;
            rowNum = grid_data.length;
            //console.log(grid_data)
            jQuery(function($) {
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
                    //direction: "rtl",

                    //subgrid options
                    subGrid : false,
                    data: grid_data,
                    datatype: "local",
                    height: "100%",
                    colNames:colNames,
                    colModel:colModel,
                    viewrecords : true,
                    rowNum:rowNum,
                    //rowList:[10,20,30],
                    pager : '',
                    //toppager: true,
                    shrinkToFit:false,
                    autoScroll: true,
                    multiselect: false,
                    //multikey: "ctrlKey",
                    multiboxonly: false,

                    //editurl: "/dummy.html",//nothing is saved
                    caption: $("#hid_year").val()+"年"+$("#hid_quarter").val()+"季度-"+$("#hid_company_name").val()+"报表一览",
                    gridComplete: function () {
                        $(this).closest('.ui-jqgrid-view').find('.ui-jqgrid-title').html($("#hid_year").val()+"年"+$("#hid_quarter").val()+"季度-"+$("#hid_company_name").val()+"报表一览");
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
                    },
                    sortname: 'INDEXORDER',
                    grouping:true,
                    groupingView : {
                        groupField : ['INDEXTYPE'],
                        groupColumnShow : [false],
                        groupText : ['<b>{0} - {1} 项</b>'],
                        groupOrder: ['desc'],
                        groupSummary: [true],
                        groupCollapse: false
                    }
                    //,autowidth: true,


                    /**
                     ,
                     grouping:true,
                     groupingView : {
						 groupField : ['name'],
						 groupDataSorted : true,
						 plusicon : 'fa fa-chevron-down bigger-110',
						 minusicon : 'fa fa-chevron-up bigger-110'
					},
                     caption: "Grouping"
                     */

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

                jQuery(grid_selector).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:groupHeaders
                });

                $(grid_selector).jqGrid('setGridParam',{
                    data:grid_data,
                    datatype: "local",
                    page:1,
                    rowNum:rowNum
                }).trigger("reloadGrid")
            });


        });

    }
})

