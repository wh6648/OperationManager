/**
 * Created by root on 14-12-7.
 */

$(function () {

  "use strict";
  events();
  render();
  $("#sidebar").removeClass("menu-min");
  function events () {

//    $("#t1_index").bind("click",function(event){
//      $("#page-content").html("");
//      com.zhixun.setPartials("operation_center/bulk_cargo_department/demurrage_voyage_contrast/demurrage_voyage_contrast.html","page-content");
//    });
//    $("#t2_index").bind("click",function(event){
//      $("#page-content").html("");
//      com.zhixun.setPartials("operation_center/bulk_cargo_department/years_route_cargo/years_route_cargo.html","page-content");
//    });
//    $("#t3_index").bind("click",function(event){
//      $("#page-content").html("");
//      com.zhixun.setPartials("operation_center/bulk_cargo_department/years_profit_cargo/years_profit_cargo.html","page-content");
//    });
//    $("#t4_index").bind("click",function(event){
//      $("#page-content").html("");
//      com.zhixun.setPartials("operation_center/bulk_cargo_department/volume_analysis/volume_analysis.html","page-content");
//    });
//
//    $("#t5_index").bind("click",function(event){
//      $("#page-content").html("");
//      com.zhixun.setPartials("operation_center/bulk_cargo_department/large_customer_benefits_analysis/large_customer_benefits_analysis.html","page-content");
//    });

    $("#t1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKGOODS.cpt&YEAR_XN=&year_XN=&YEAR_QN=&year_QN=");
    });
    $("#t2_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKVOY.cpt&year_XN=&year_QN=");
    });
    $("#t3_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKYINGKUI.cpt");
    });
    $("#t4_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKZHIQI.cpt");
    });

    $("#t5_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKCUSRECEIVE.cpt");
    });

    $("#t6_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKCUSTOMGOODS.cpt");
    });

    $(".nav-list2 li").bind("click",function(){
      $(".nav-list2 li").removeClass("active");
      $(this).addClass("active");
    })

  };

  function render() {

    // 设置默认显示的页面
//    com.zhixun.setPartials("operation_center/bulk_cargo_department/demurrage_voyage_contrast/demurrage_voyage_contrast.html","page-content");

//    **************************
    com.zhixun.setPartials("operation_center/bulk_cargo_department/bulk_default.html","page-content");

  };

});