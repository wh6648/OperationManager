/**
 * Created by root on 15-03-10.
 */

$(function () {

  $(".ui-jqgrid-resize").remove();

  "use strict";
  events();
  render();

  function events () {


  };

  function render() {
    // 设置默认显示的页面
    com.zhixun.setPartials("operation_center/shipping_department/left_shipping_menu.html","sidebar");

  };

});