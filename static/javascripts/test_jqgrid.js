/**
 * Created by root on 14-12-8.
 */
$(function () {

  "use strict";

  events();
  render();

  // 绑定事件
  function events() {


  }

  // 绑定事件
  function render() {

    var grid_data =
      [
        {id: "1", invdate: "加分项", name: "出口", amount: "出口20GP重箱量", tax: "箱", total: "1", note: "1"},
        {id: "2", invdate: "加分项", name: "出口", amount: "出口20GP重箱量", tax: "箱", total: "1", note: "1"},
        {id: "3", invdate: "加分项", name: "出口", amount: "出口20GP重箱量", tax: "箱", total: "1", note: "1"},
        {id: "4", invdate: "加分项", name: "出口", amount: "出口20GP重箱量", tax: "箱", total: "1", note: "1"},
        {id: "5", invdate: "加分项", name: "出口", amount: "出口20GP重箱量", tax: "箱", total: "1", note: "1"}
      ]

    jQuery("#sortrows").jqGrid({

//    url:'server.php?q=2',
      data: grid_data,
      datatype: "local",
      colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
      colModel: [
        {name: 'id', index: 'id', width: 55},
        {name: 'invdate', index: 'invdate', width: 90},
        {name: 'name', index: 'name asc, invdate', width: 100},
        {name: 'amount', index: 'amount', width: 80, align: "right"},
        {name: 'tax', index: 'tax', width: 80, align: "right"},
        {name: 'total', index: 'total', width: 80, align: "right"},
        {name: 'note', index: 'note', width: 150, sortable: false}
      ],
      rowNum: 10,
      width: 700,
      rowList: [10, 20, 30],
      pager: '#psortrows',
      sortname: 'invdate',
      viewrecords: true,
      sortorder: "desc",
      caption: "Sortable Rows Example"
    });
//    jQuery("#sortrows").jqGrid('navGrid', '#psortrows', {edit: false, add: false, del: false});
//    jQuery("#sortrows").setRowData ('1', true, 'unsortable');
//    jQuery("#sortrows",jQuery("#sortrows")[0]).addClass('unsortable');
    jQuery("#sortrows tr td:eq(0)").jqGrid('sortableRows').addClass('unsortable');
    jQuery("#sortrows").jqGrid('sortableRows', {
      update: function(event, ui) {
//        updateOrder()
        alert(123);       //ok
      }
    });

//    jQuery("#sortrows").jqGrid('sortableRows',
//
//      options = { update : function(e,ui){alert("hi");}
//
//    });

//    $("#sortrows tr td:eq(0)").sortable("destroy");
//    jQuery("#sortrows tr td:eq(0)").jqGrid('sortableRows', {disabled: true});
//    jQuery("#sortrows tr td:eq(0)").jqGrid('sortableRows', {destroy: true});
//    jQuery("#sortrows").setRowData ('sortrows tr td:eq(0)', false, 'unsortable');


//    jQuery("#sortrows").jqGrid('sortableRows', { items: '.jqgrow:not(.unsortable)'});

//    jQuery("#sortrows").jqGrid('sortableRows', {disabled: false});

//    jQuery("#sortrows").jqGrid('sortableRows', {destroy: false});

  }

});