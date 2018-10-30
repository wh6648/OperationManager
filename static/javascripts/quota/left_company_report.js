/**
 * Created by root on 14-12-7.
 */

$(function () {

    "use strict";
    events();
    render();

    function events () {

        $("#t1_company").bind("click",function(event){
            $("#page-content").html("");
            $("#hid_type").val("quota");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t2_company").bind("click",function(event){
            $("#page-content").html("");
            $("#hid_type").val("act");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t3_company").bind("click",function(event){
            $("#page-content").html("");
            $("#hid_type").val("gpoint");
            com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");
        });

        $("#t4_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/test.html","page-content");
        });

        $("#t5_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/test2.html","page-content");
        });

        $("#t6_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/test3.html","page-content");
        });

        $("#t7_index").bind("click",function(event){
            $("#page-content").html("");
            com.zhixun.setPartials("quota/test4.html","page-content");
        });

        $(".nav-list2 li").bind("click",function(){
            $(".nav-list2 li").removeClass("active");
            $(this).addClass("active");
            $("#hid_company_name").val($.trim($(this).find("span").html()));
        })

    };

    function render() {

        //设置默认进入界面 表头上面显示 任务量
        $("#hid_company_name").val("任务量");
        // 设置默认显示的页面
        com.zhixun.setPartials("quota/companyReport/company_t1.html","page-content");

        $("#tmpHidReport").remove();
        //$("#page-content").html("");
    };




});