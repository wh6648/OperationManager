/**
 * Created by root on 14-12-7.
 */

$(function () {

  // 注册事件
  events();
  // 共通方法，设置menu状态
  commonMenuEvent();
  var i = 1;

  function events() {

    // 点击运营中心menu
    $("#operation_menu").bind("click", function(event){
      com.zhixun.setPartials("operation_center/shipping_department/left_shipping_menu.html","sidebar");
      //$("#sidebar").removeClass("menu-min");
    });

    // 点击航运事业部menu
    $("#shipping_menu").bind("click", function(event){
      com.zhixun.setPartials("operation_center/shipping_department/left_shipping_menu.html","sidebar");
      //$("#sidebar").removeClass("menu-min");
    });

    // 点击散杂货事业部menu
    $("#bulk_cargo_menu").bind("click", function(event){
      com.zhixun.setPartials("operation_center/bulk_cargo_department/left_bulk_cargo_menu.html","sidebar");
      //$("#sidebar").removeClass("menu-min");
    });

    $("#topmenuCollapse").bind("click", function(event){
      $("#sidebar1").removeClass("collapse");
      $("#sidebar1").toggle();

      if (i%2 == 0) {
        $("#up_down_btn").removeClass("fa-angle-double-down");
        $("#up_down_btn").addClass("fa-angle-double-up");
        i++;
      } else {
        $("#up_down_btn").removeClass("fa-angle-double-up");
        $("#up_down_btn").addClass("fa-angle-double-down");
        i++;
      }


    });
  }





  /**
   * 共通方法，设置menu状态
   * @param target
   */
  function commonMenuEvent(target){

    $(".nav-list li").bind("click", function(event){
      $(".nav-list li", $("#sidebar1")).removeClass("active");
      $(this).addClass("active");
      $("#menu_1").html($(this).attr("name"));
    });


  }



});