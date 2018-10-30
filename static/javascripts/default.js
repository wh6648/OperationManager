/**
 * Created by root on 14-12-7.
 */

$(function () {

    //ui-jqgrid-resize ui-jqgrid-resize-ltr
    $(".ui-jqgrid-resize").remove();




    "use strict";
    events();
    render();

    var i = 0;

    function events () {


    };

    function render() {
        // 设置默认显示的页面
        com.zhixun.setPartials("quota/left_index_fill.html","sidebar");
        //$("#sidebar").removeClass("menu-min");
    };

});