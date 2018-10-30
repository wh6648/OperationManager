/**
 * Created by root on 14-12-8.
 */
$(function () {

    var rowNum = 10;
    var colNames =  ['类别', '考核项', '单位', '分值'];
    var colModel=
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
            {name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:60,editable: false},
            {name:'INDEXNAME',index:'INDEXNAME', width:60,editable: false},
            {name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:60,editable: false},
            {name:'INDEXVALUE',index:'INDEXVALUE', width:60, sorttype:"int", editable: false}
        ];
    var grid_data;


    loadGridcol();
    /**
     * 获取动态列
     */
    function loadGridcol(){
        light.doget("/quota/getAllDepartment",function(err, result) {

            //console.log(result)
            if(!result){
                return;
            }
            $.each(result,function(index,element){
                //console.log(element['DEPTNAME'])

                colNames[index+4] = element['DEPTNAME'];

                // {name:'001',index:'市场部', width:60, sorttype:"int", editable: false}
                //console.log(element['DEPTCODE'])
                var col = {
                    name:element['DEPTCODE'],
                    index:element['DEPTCODE'],
                    width:60,
                    formatter:"number",
                    sorttype:"number",
                    editable: false
                }

                colModel[index+4] = col;
            })
            //console.log(result)
            //console.log(colModel)
           // console.log(colNames)
            loadGridData();
        });

    }


    // 绑定事件
    function loadGridData() {

        light.doget("/quota/quotaOfficeReport",function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
            }
            if(!result){
                return;
            }
            rowNum = result.length;
            grid_data = result;
            //console.log(grid_data)
            jQuery(function($) {
                var grid_selector = "#grid-table";
                var pager_selector = "#grid-pager";

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
                    //    [
                    //    ' ',
                    //    '类别',
                    //    '考核项',
                    //    '单位',
                    //    '价值',
                    //    //'Years',
                    //    //'Months',
                    //    //'IndexOrder',
                    //    '市场部',
                    //    '龙口办',
                    //    '温州办',
                    //    '湛江办',
                    //    '丹东办',
                    //    '泉州办',
                    //    '江阴办',
                    //    '日照办',
                    //    '锦州办',
                    //    '漳州办',
                    //    '大连办',
                    //    '航线组',
                    //    '福州办',
                    //    '茂名办',
                    //    '潍坊办',
                    //    '盘锦办',
                    //    '黄骅办',
                    //    '台州办',
                    //    '椒江办',
                    //    '沈阳办',
                    //    '长春办',
                    //    '厦门办',
                    //    '宁波办',
                    //    '广州办',
                    //    '青岛办',
                    //    '天津办',
                    //    '上海办',
                    //    '乍浦办',
                    //    '京唐办'
                    //
                    //],
                    colModel:colModel,
                        //[
                        //{name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                        //    formatter:'actions',
                        //    formatoptions:{
                        //        keys:true,
                        //
                        //        delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback}
                        //        //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                        //    }
                        //},
                        //{name:'INDEXSMALLNAME',index:'INDEXSMALLNAME', width:60,editable: false},
                        //{name:'INDEXNAME',index:'INDEXNAME', width:60,editable: false},
                        //{name:'INDEXUNITNAME',index:'INDEXUNITNAME', width:60,editable: false},
                        //{name:'INDEXVALUE',index:'INDEXVALUE', width:60, sorttype:"int", editable: false},
                        //{name:'001',index:'市场部', width:60, sorttype:"int", editable: false},
                        //{name:'010',index:'龙口办', width:60, sorttype:"int", editable: false},
                        //{name:'011',index:'温州办', width:60, sorttype:"int", editable: false},
                        //{name:'012',index:'湛江办', width:60, sorttype:"int", editable: false},
                        //{name:'013',index:'丹东办', width:60, sorttype:"int", editable: false},
                        //{name:'014',index:'泉州办', width:60, sorttype:"int", editable: false},
                        //{name:'015',index:'江阴办', width:60, sorttype:"int", editable: false},
                        //{name:'016',index:'日照办', width:60, sorttype:"int", editable: false},
                        //{name:'017',index:'锦州办', width:60, sorttype:"int", editable: false},
                        //{name:'018',index:'漳州办', width:60, sorttype:"int", editable: false},
                        //{name:'019',index:'大连办', width:60, sorttype:"int", editable: false},
                        //{name:'002',index:'航线组', width:60, sorttype:"int", editable: false},
                        //{name:'020',index:'福州办', width:60, sorttype:"int", editable: false},
                        //{name:'021',index:'茂名办', width:60, sorttype:"int", editable: false},
                        //{name:'022',index:'潍坊办', width:60, sorttype:"int", editable: false},
                        //{name:'023',index:'盘锦办', width:60, sorttype:"int", editable: false},
                        //{name:'024',index:'黄骅办', width:60, sorttype:"int", editable: false},
                        //{name:'025',index:'台州办', width:60, sorttype:"int", editable: false},
                        //{name:'026',index:'椒江办', width:60, sorttype:"int", editable: false},
                        //{name:'027',index:'沈阳办', width:60, sorttype:"int", editable: false},
                        //{name:'028',index:'长春办', width:60, sorttype:"int", editable: false},
                        //{name:'029',index:'厦门办', width:60, sorttype:"int", editable: false},
                        //{name:'003',index:'宁波办', width:60, sorttype:"int", editable: false},
                        //{name:'004',index:'广州办', width:60, sorttype:"int", editable: false},
                        //{name:'005',index:'青岛办', width:60, sorttype:"int", editable: false},
                        //{name:'006',index:'天津办', width:60, sorttype:"int", editable: false},
                        //{name:'007',index:'上海办', width:60, sorttype:"int", editable: false},
                        //{name:'008',index:'乍浦办', width:60, sorttype:"int", editable: false},
                        //{name:'009',index:'京唐办', width:60, sorttype:"int", editable: false}
                        //],

                    viewrecords : true,
                    rowNum:rowNum,
                    //rowList:[10,20,30],
                    pager : pager_selector,
                    altRows: true,
                    //toppager: true,
                    shrinkToFit:false,
                    autoScroll: true,
                    multiselect: false,
                    //multikey: "ctrlKey",
                    multiboxonly: false,
                    footerrow:true,
                    loadComplete : function() {
                        var table = this;
                        setTimeout(function(){
                            //styleCheckbox(table);

                            //updateActionIcons(table);
                            //updatePagerIcons(table);
                            //enableTooltips(table);
                        }, 0);
                    },
                    gridComplete:function(){
                        if(rowNum>0){
                            $(".ui-jqgrid-sdiv").show();
                            var that = $(this);
                            var colSums = {"INDEXSMALLNAME":"合计"};

                            //console.log(colModel)
                            $.each(colModel,function(index,element){
                                if(index>2){
                                    var colSum =that.getCol(element["name"],false,"sum");
                                    //console.log(element["name"] +":" + colSum)
                                    colSums[element["name"]]=colSum;
                                }
                            });
                            //console.log(colSums)
                            $(this).footerData("set",colSums);
                            //将合计值显示出来
                        }else{
                            $(".ui-jqgrid-sdiv").hide();
                        }
                    },
                    //editurl: "/dummy.html",//nothing is saved
                    caption: "办事处报表一览"

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
                        search: true,
                        searchicon : 'ace-icon fa fa-search orange',
                        refresh: true,
                        refreshicon : 'ace-icon fa fa-refresh green'
                        //view: true,
                        //viewicon : 'ace-icon fa fa-search-plus grey'
                    }

                )
            });


        });
    }
})


