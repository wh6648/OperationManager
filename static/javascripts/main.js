/**
 * Created by root on 14-12-8.
 */
$(function () {

    // 初始化头部
    initHeader();
    // 初始化左侧菜单
    initNav();
    // 注册事件
    events();


    // 初始化头部
    function initHeader(){

    }


    // 初始化左侧菜单
    function initNav(){

    }



    // 绑定事件
    function events() {
        // 指标定义
        $("#quotaDefine").bind("click", function(event){

            // 方法简介：获取HTML代码片段插入到指定的容器中
            // 参数一：views下的html代码片段位置，从view下开始算起，前面不加/
            //参数二：要插入到的容器ID
            com.zhixun.setPartials("quotaDefine/index.html","page-content");
        });
       // 左侧菜单事件绑定

        // 指标完成度一览事件
        $("#quotaReport").bind("click", function(event){

            // 方法简介：获取HTML代码片段插入到指定的容器中
            // 参数一：views下的html代码片段位置，从view下开始算起，前面不加/
            //参数二：要插入到的容器ID
            com.zhixun.setPartials("quotaReport/index.html","page-content");
        });


    }


});