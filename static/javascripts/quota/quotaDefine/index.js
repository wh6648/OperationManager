/**
 * Created by root on 14-12-8.
 */
$(function () {

    // 注册事件
    events();


    // 绑定事件
    function events() {


    }


    var grid_data =
        [
            {aaa:"1",bbb:"加分项",ccc:"出口",ddd:"出口20GP重箱量",eee:"箱", fff:"1"},
            {aaa:"2",bbb:"加分项",ccc:"出口",ddd:"出口40HC重箱量",eee:"箱", fff:"5"},
            {aaa:"3",bbb:"加分项",ccc:"出口",ddd:"出口门起(Dr→)20GP重箱",eee:"箱", fff:"5"},
            {aaa:"4",bbb:"加分项",ccc:"出口",ddd:"出口门起(Dr→)40HC重箱",eee:"箱", fff:"10"},
            {aaa:"5",bbb:"加分项",ccc:"出口",ddd:"出口到门(→Dr)20GP重箱",eee:"箱", fff:"6"},
            {aaa:"6",bbb:"加分项",ccc:"出口",ddd:"出口到门(→Dr)40HC重箱",eee:"箱", fff:"8"},
            {aaa:"7",bbb:"加分项",ccc:"进口",ddd:"进口到门(→Dr)20GP重箱",eee:"箱", fff:"18"},
            {aaa:"8",bbb:"加分项",ccc:"进口",ddd:"进口到门(→Dr)40HC重箱",eee:"箱", fff:"16"},
            {aaa:"9",bbb:"加分项",ccc:"出口",ddd:"出口新客户重箱",eee:"TEU", fff:"1"},
            {aaa:"10",bbb:"加分项",ccc:"出口",ddd:"出口门起陆运(Dr→)盈利",eee:"万元", fff:"100"},
            {aaa:"11",bbb:"加分项",ccc:"海运",ddd:"承揽海运盈利",eee:"万元", fff:"150"},
            {aaa:"12",bbb:"加分项",ccc:"现场",ddd:"疏港船直泊速谴节省额",eee:"万元", fff:"300"},
            {aaa:"13",bbb:"加分项",ccc:"出口",ddd:"出口到门(→Dr)盈利",eee:"万元", fff:"600"},
            {aaa:"14",bbb:"加分项",ccc:"进口",ddd:"进口陆运到门(→Dr)盈亏",eee:"万元", fff:"200"},
            {aaa:"15",bbb:"加分项",ccc:"商务",ddd:"及时收取滞箱/超期堆存/单证费",eee:"万元", fff:"100"},
            {aaa:"16",bbb:"加分项",ccc:"商务",ddd:"促成空重箱堆存费减免额",eee:"万元", fff:"180"},

            {aaa:"17",bbb:"减分项",ccc:"现场",ddd:"港口船滞期损失额",eee:"万元", fff:"-180"},
            {aaa:"18",bbb:"减分项",ccc:"出口",ddd:"等货船期损失额",eee:"万元", fff:"-190"},
            {aaa:"19",bbb:"减分项",ccc:"箱管",ddd:"15天未流动20GP箱*天数",eee:"万元", fff:"-0.5"},
            {aaa:"20",bbb:"减分项",ccc:"箱管",ddd:"15天未流动40HC箱*天数",eee:"万元", fff:"-0.5"},
            {aaa:"21",bbb:"减分项",ccc:"箱管",ddd:"未准确提报箱盘存报表",eee:"万元", fff:"-130"}


        ];

    var subgrid_data =
        [
            {id:"1", name:"sub grid item 1", qty: 11},
            {id:"2", name:"sub grid item 2", qty: 3},
            {id:"3", name:"sub grid item 3", qty: 12},
            {id:"4", name:"sub grid item 4", qty: 5},
            {id:"5", name:"sub grid item 5", qty: 2},
            {id:"6", name:"sub grid item 6", qty: 9},
            {id:"7", name:"sub grid item 7", qty: 3},
            {id:"8", name:"sub grid item 8", qty: 8}
        ];

    jQuery(function($) {
        var grid_selector = "#grid-table";
        var pager_selector = "#grid-pager";

        //resize to fit page size
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid( 'setGridWidth', $(".page-content").width() );
        })
        //resize on sidebar collapse/expand
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
            if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
                $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
            }
        })



        jQuery(grid_selector).jqGrid({

            subGrid : true,
            subGridOptions : {
                plusicon : "ace-icon fa fa-plus center bigger-110 blue",
                minusicon  : "ace-icon fa fa-minus center bigger-110 blue",
                openicon : "ace-icon fa fa-chevron-right center orange"
            },
            //for this example we are using local data
            subGridRowExpanded: function (subgridDivId, rowId) {
                var subgridTableId = subgridDivId + "_t";
                $("#" + subgridDivId).html("<table id='" + subgridTableId + "'></table>");
                $("#" + subgridTableId).jqGrid({
                    datatype: 'local',
                    data: subgrid_data,
                    colNames: ['No','Item Name','Qty'],
                    colModel: [
                        { name: 'id', width: 50 },
                        { name: 'name', width: 150 },
                        { name: 'qty', width: 50 }
                    ]
                });
            },



            data: grid_data,
            datatype: "local",
            height: 400,
            colNames:[' ','序号','加减分类型','类别','指标名称','指标单位名称', '价值'],
            colModel:[
                {name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                    formatter:'actions',
                    formatoptions:{
                        keys:true
                    }
                },
                {name:'aaa',index:'aaa', width:40, sorttype:"int", editable: false,align:'center'},
                {name:'bbb',index:'bbb', width:100, editable:false, sorttype:"date",unformat: pickDate,align:'center'},
                {name:'ccc',index:'ccc', width:80,editable: false,editoptions:{size:"20",maxlength:"30"},align:'center'},
                {name:'ddd',index:'ddd', width:260,editable: false,editoptions:{size:"20",maxlength:"30"}},
                {name:'eee',index:'eee', width:100,editable: false,editoptions:{size:"20",maxlength:"30"},align:'center'},
                {name:'fff',index:'fff', width:80,editable: false,editoptions:{size:"20",maxlength:"30"},align:'center'}
            ],

            viewrecords : true,
            rowNum:10,
            rowList:[10,20,30],
            pager : pager_selector,
            altRows: true,
            //toppager: true,

            multiselect: true,
            //multikey: "ctrlKey",
            multiboxonly: true,

            loadComplete : function() {
            var table = this;
            setTimeout(function(){

            }, 0);
        },

//            gridComplete: function () {
//                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("text-align","center");
//                // ui-jqgrid-title
//                $(this).closest('.ui-jqgrid-view').find('span.ui-jqgrid-title').css("float","center");
//                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("color","#777");
//                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("background","white");
//                $(this).closest('.ui-jqgrid-view').find('div.ui-jqgrid-titlebar').css("font-size","20px");
//            },

//            editurl: "/dummy.html",//nothing is saved
//            caption: "2014年 信风内贸公司 12月"

//            ,shrinkToFit:false
//            ,autowidth: true

        });
        $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size


        //switch element when editing inline
        function aceSwitch( cellvalue, options, cell ) {
            setTimeout(function(){
                $(cell) .find('input[type=checkbox]')
                    .addClass('ace ace-switch ace-switch-5')
                    .after('<span class="lbl"></span>');
            }, 0);
        }
        //enable datepicker
        function pickDate( cellvalue, options, cell ) {
            setTimeout(function(){
                $(cell) .find('input[type=text]')
                    .datepicker({format:'yyyy-mm-dd' , autoclose:true});
            }, 0);
        }


        //navButtons
        jQuery(grid_selector).jqGrid('navGrid',pager_selector,
            { 	//navbar options
                edit: true,
                editicon : 'ace-icon fa fa-pencil blue',
                add: true,
                addicon : 'ace-icon fa fa-plus-circle purple',
                del: true,
                delicon : 'ace-icon fa fa-trash-o red',
                search: true,
                searchicon : 'ace-icon fa fa-search orange',
                refresh: true,
                refreshicon : 'ace-icon fa fa-refresh green',
                view: true,
                viewicon : 'ace-icon fa fa-search-plus grey'
            },
            {

                recreateForm: true
//                beforeShowForm : function(e) {
//                    var form = $(e[0]);
//                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
////                    style_edit_form(form);
//                }
            },
            {
                //new record form
                //width: 700,
                closeAfterAdd: true,
                recreateForm: true,
                viewPagerButtons: false
//                beforeShowForm : function(e) {
//                    var form = $(e[0]);
//                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
//                        .wrapInner('<div class="widget-header" />')
////                    style_edit_form(form);
//                }
            },
            {
                //delete record form
                recreateForm: true,
                beforeShowForm : function(e) {
                    var form = $(e[0]);
                    if(form.data('styled')) return false;

//                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
////                    style_delete_form(form);
//
//                    form.data('styled', true);
                }
                ,
                onClick : function(e) {
                    alert(1);
                }
            },
            {
                //search form
                recreateForm: true,
                afterShowSearch: function(e){
                    var form = $(e[0]);
                    form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
//                    style_search_form(form);
                },
                afterRedraw: function(){
//                    style_search_filters($(this));
                }
                ,
                multipleSearch: true
                /**
                 multipleGroup:true,
                 showQuery: true
                 */
            },
            {
                //view record form
                recreateForm: true,
                beforeShowForm: function(e){
                    var form = $(e[0]);
                    form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                }
            }
        )

        function updatePagerIcons(table) {
            var replacement =
            {
                'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
                'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
                'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
                'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
            };
            $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
                var icon = $(this);
                var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
            })
        }

    });

})


