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

        // 指标点击事件
        $("#quota").bind("click", function(event){
           // com.zhixun.setPartials("quotaReport/index.html","page-content");
            //commonMenuEvent(this);
            com.zhixun.setPartials("quota/left_menu.html","sidebar");
            //$("#sidebar").removeClass("menu-min");
        });

        // 点击指标填报menu
        $("#index_menu").bind("click", function(event){
            com.zhixun.setPartials("quota/left_index_fill.html","sidebar");
            //$("#sidebar").removeClass("menu-min");
        });

        // 点击公司报表menu
        $("#company_menu").bind("click", function(event){
            com.zhixun.setPartials("quota/left_company_report.html","sidebar");
            $("#sidebar").removeClass("menu-min");
        });

        // 点击区域报表menu
        $("#area_menu").bind("click", function(event){
            com.zhixun.setPartials("quota/left_area_report.html","sidebar");
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