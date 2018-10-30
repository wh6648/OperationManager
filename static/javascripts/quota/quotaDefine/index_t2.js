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
            {aaa:"1",bbb:"市场部",ccc:"市场部",ddd:"43"},
            {aaa:"2",bbb:"航线组",ccc:"航线部",ddd:"23"},
            {aaa:"3",bbb:"宁波办",ccc:"华南·华北区域",ddd:"43"},
            {aaa:"4",bbb:"广州办",ccc:"华东区域",ddd:"34"},
            {aaa:"5",bbb:"青岛办",ccc:"华东区域",ddd:"25"},
            {aaa:"6",bbb:"鲅鱼圈办",ccc:"华东区域",ddd:"52"},
            {aaa:"7",bbb:"上海办",ccc:"华东区域",ddd:"3"},
            {aaa:"8",bbb:"虎门办",ccc:"华南·华北区域",ddd:"26"},
            {aaa:"9",bbb:"温州办",ccc:"市场部",ddd:"35"},
            {aaa:"10",bbb:"丹东办",ccc:"华南·华北区域",ddd:"35"},
            {aaa:"11",bbb:"泉州办",ccc:"华南·华北区域",ddd:"33"},
            {aaa:"12",bbb:"锦州办",ccc:"华南·华北区域",ddd:"55"},
            {aaa:"13",bbb:"日照办",ccc:"市场部",ddd:"43"},
            {aaa:"14",bbb:"乍浦办",ccc:"华南·华北区域",ddd:"32"},
            {aaa:"15",bbb:"大连办",ccc:"华南·华北区域",ddd:"23"},
            {aaa:"16",bbb:"福州办",ccc:"航线部",ddd:"11"},
            {aaa:"17",bbb:"盘锦办",ccc:"航线部",ddd:"15"}


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
            //direction: "rtl",

            //subgrid options
            subGrid : true,
            //subGridModel: [{ name : ['No','Item Name','Qty'], width : [55,200,80] }],
            //datatype: "xml",
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
            colNames:[' ','序号','考核单位名称','区域名称','人数'],
            colModel:[
                {name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                    formatter:'actions',
                    formatoptions:{
                        keys:true

//                        delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
                        //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                    }
                },
                {name:'aaa',index:'aaa', width:10, sorttype:"int", editable: true,align:'center'},
                {name:'bbb',index:'bbb', width:20, editable:true, sorttype:"date",unformat: pickDate},
                {name:'ccc',index:'ccc', width:30,editable: true,editoptions:{size:"20",maxlength:"30"}},
                {name:'ddd',index:'ddd', width:30,editable: true,editoptions:{size:"20",maxlength:"30"}}
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
                    styleCheckbox(table);

//                    updateActionIcons(table);
//                    updatePagerIcons(table);
//                    enableTooltips(table);
                }, 0);
            },

//            editurl: "/dummy.html",//nothing is saved
//            caption: "2014年 信风内贸公司 12月"
//
            autowidth: true


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



        //enable search/filter toolbar
        //jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})
        //jQuery(grid_selector).filterToolbar({});


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
                //edit record form
                //closeAfterEdit: true,
                //width: 700,
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



//        function style_edit_form(form) {
//            //enable datepicker on "sdate" field and switches for "stock" field
//            form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
//                .end().find('input[name=stock]')
//                .addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
//            //don't wrap inside a label element, the checkbox value won't be submitted (POST'ed)
//            //.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');
//
//            //update buttons classes
//            var buttons = form.next().find('.EditButton .fm-button');
//            buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();//ui-icon, s-icon
//            buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
//            buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')
//
//            buttons = form.next().find('.navButton a');
//            buttons.find('.ui-icon').hide();
//            buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
//            buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
//        }

        //  ok 没问题---点击事件
        function style_delete_form(form) {
            var buttons = form.next().find('.EditButton .fm-button');
            buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
            buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
            buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
        }

        function style_search_filters(form) {
            form.find('.delete-rule').val('X');
            form.find('.add-rule').addClass('btn btn-xs btn-primary');
            form.find('.add-group').addClass('btn btn-xs btn-success');
            form.find('.delete-group').addClass('btn btn-xs btn-danger');
        }
        function style_search_form(form) {
            var dialog = form.closest('.ui-jqdialog');
            var buttons = dialog.find('.EditTable')
            buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
            buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
            buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
        }

        function beforeDeleteCallback(e) {
            var form = $(e[0]);
            if(form.data('styled')) return false;

            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
//            style_delete_form(form);

            form.data('styled', true);
        }

        function beforeEditCallback(e) {
            var form = $(e[0]);
            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
            style_edit_form(form);
        }



        //it causes some flicker when reloading or navigating grid
        //it may be possible to have some custom formatter to do this as the grid is being created to prevent this
        //or go back to default browser checkbox styles for the grid
        function styleCheckbox(table) {
            /**
             $(table).find('input:checkbox').addClass('ace')
             .wrap('<label />')
             .after('<span class="lbl align-top" />')


             $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
             .find('input.cbox[type=checkbox]').addClass('ace')
             .wrap('<label />').after('<span class="lbl align-top" />');
             */
        }


        //unlike navButtons icons, action icons in rows seem to be hard-coded
        //you can change them like this in here if you want
        function updateActionIcons(table) {
            /**
             var replacement =
             {
                 'ui-ace-icon fa fa-pencil' : 'ace-icon fa fa-pencil blue',
                 'ui-ace-icon fa fa-trash-o' : 'ace-icon fa fa-trash-o red',
                 'ui-icon-disk' : 'ace-icon fa fa-check green',
                 'ui-icon-cancel' : 'ace-icon fa fa-times red'
             };
             $(table).find('.ui-pg-div span.ui-icon').each(function(){
						var icon = $(this);
						var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
						if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
					})
             */
        }

        //replace icons with FontAwesome icons like above
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

        function enableTooltips(table) {
            $('.navtable .ui-pg-button').tooltip({container:'body'});
            $(table).find('.ui-pg-div').tooltip({container:'body'});
        }

        //var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');


    });

})


