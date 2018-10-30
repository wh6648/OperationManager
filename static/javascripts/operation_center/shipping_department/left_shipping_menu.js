/**
 * Created by root on 14-12-7.
 */

$(function () {

  "use strict";
  events();
  render();
  $("#sidebar").removeClass("menu-min");
  function events () {

    $("#t1_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B516c%5D%5B53f8%5D%5B4e1a%5D%5B52a1%5D%5B5206%5D%5B89e3%5D%5B8868%5D.cpt&YEAR=");
    });
    $("#t1_2_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B4e1a%5D%5B52a1%5D%5B91cf%5D%5B5b8c%5D%5B6210%5D%5B60c5%5D%5B51b5%5D%5B8868%5D.cpt");
    });
    $("#t1_3_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FChain.cpt&diqu=");
    });
    $("#t1_4_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FChain1.cpt&diqu=");
    });

    $("#t2_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B96c6%5D%5B88c5%5D%5B7bb1%5D%5B76d8%5D%5B5b58%5D%5B9884%5D%5B8b66%5D.cpt");
    });

    $("#t3_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B5355%5D%5B8239%5D%5B822a%5D%5B6b21%5D%5B5229%5D%5B6da6%5D.cpt&year=&zhou=&shipname=&hangxian=&yue=");
    });
    $("#t3_2_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B822a%5D%5B7ebf%5D%5B6536%5D%5B76ca%5D.cpt");
    });
    $("#t3_3_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B8239%5D%5B8236%5D%5B6548%5D%5B76ca%5D.cpt");
    });
    $("#t3_4_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B8239%5D%5B8236%5D%5B822a%5D%5B7ebf%5D%5B5206%5D%5B6790%5D%5B8868%5D.cpt&shipname=");
    });
    $("#t3_5_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B5468%5D%5B62a5%5D%5B5206%5D%5B6790%5D.cpt&%5B5e74%5D=&%5B5468%5D=");
    });
    $("#t3_6_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B62d6%5D%5B8f66%5D%5B6536%5D%5B4ed8%5D%5B60c5%5D%5B51b5%5D%5B6c47%5D%5B603b%5D.cpt");
    });
    $("#t3_7_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B62d6%5D%5B8f66%5D%5B6536%5D%5B4ed8%5D%5B60c5%5D%5B51b5%5D%5B660e%5D%5B7ec6%5D.cpt");
    });

    $("#t4_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B7533%5D%5B8bf7%5D%5B6280%5D%5B672f%5D%5B90e8%5D%5B6539%5D%5B5355%5D%5B60c5%5D%5B51b5%5D.cpt&OFFICE_NAME=");
    });
    $("#t4_2_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B7cfb%5D%5B7edf%5D%5B6539%5D%5B5355%5D%5B60c5%5D%5B51b5%5D.cpt");
    });

    $("#t5_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FTop10%5B6392%5D%5B884c%5D.cpt");
    });

    $("#t6_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B7ade%5D%5B4e89%5D%5B5bf9%5D%5B624b%5D%5B60c5%5D%5B51b5%5D.cpt&zhou=&yue=&nian=&banshichu=&wanglaidanwei=");
    });
    $("#t7_1_index").bind("click",function(event){
      $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B6d77%5D%5B8fd0%5D%5B8d39%5D%5B62a5%5D%5B4ef7%5D.cpt&mudigang=&qishigang=&shijianduan=");
    });

    $(".nav-list2 .list").bind("click",function(){
      $(".nav-list2 .list").removeClass("active");
      $(this).addClass("active");
    });
    $(".submenu li").bind("click",function(){
      $(".submenu li").removeClass("active");
      $(this).addClass("active");
    });

  };

  function render() {

    // 设置默认显示的页面
    com.zhixun.setPartials("operation_center/shipping_department/ship_default.html","page-content");

  };

});