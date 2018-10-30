/**
 * Created by root on 14-12-7.
 */

$(function () {

    "use strict";
    events();
    render();
    $("#sidebar").removeClass("menu-min");
    function events () {

        $("#t1_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/quotaDefine/index.html","page-content");
        });

        $("#t2_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/quotaDefine/index_t2.html","page-content");
        });

        $("#t3_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t4_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t5_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t6_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $(".nav-list2 li").bind("click",function(){
            $(".nav-list2 li").removeClass("active");
            $(this).addClass("active");
        })

    };

    function render() {

        // 设置默认显示的页面
        com.zhixun.setPartials("quota/quotaDefine/index.html","page-content");

    };

});