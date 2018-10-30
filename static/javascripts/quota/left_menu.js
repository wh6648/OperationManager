/**
 * Created by root on 14-12-8.
 */
$(function () {

    "use strict";
    // 注册事件

    render();
    $("#sidebar").removeClass("menu-min");
    // 绑定事件
    function events() {

        //// 指标点击事件
        //$("#OfficeReport1").bind("click", function(event){
        //    //
        //    // com.zhixun.setPartials("quotaReport/index.html","page-content");
        //    alert(11)
        //    com.zhixun.setPartials("quota/quotaDefine/index.html","page-content");
        //});
        //
        //// 指标点击事件
        //$("#OfficeReport").bind("click", function(event){
        //    // com.zhixun.setPartials("quotaReport/index.html","page-content");
        //    alert(22)
        //    com.zhixun.setPartials("quota/quotaReport/OfficeReport.html","page-content");
        //});

        // 各办报表
        $(".departmentReport").bind("click", function(event){
            // com.zhixun.setPartials("quotaReport/index.html","page-content");
            $("#hid_departmentCode").val($(this).attr("data-code"));
            $("#hid_departmentName").val($(this).attr("data-name"));
            $("#hid_departmentPersonCount").val('');
            com.zhixun.setPartials("quota/departmentReport/departmentReport.html","page-content");

        });

        //点击选中状态
        $(".submenu li").bind("click",function(){
            $(".submenu li").removeClass("active");
            $(this).addClass("active");
        })


    }

    function render () {

        //刚进入此界面，将中间区域清空  -- 暂时写法--
        $("#page-content").html("");

        bindLeftMenuStyleEvent();
        getAreaList();


    }

    /**
     * 获取各办数据
     */
    function getAreaList(){
        //departmentList
        //<li class="" name="">
        //    <a href="top-menu.html">
        //    <i class="menu-icon fa fa-caret-right"></i>
        //    Top Menu
        //    </a>
        // </li>
        light.doget("/common/getCurrYearMonth",function(err, result) {
            if (err) {
                console.log("@@@@@@@@@@@@@@@ error @@@@@@@@@@@@@@@", err);
                if("<!DOCTYPE" == err.responseText.substr(0, 9)) {
                    window.location = "/site/login";
                }
            }
            if (!result) {
                return;
            }

            var date_year = result[0]["YEARS"];
            var date_quarter = result[0]["MONTHS"];

            light.doget("/quota/getAllDepartment",{year:date_year,month:date_quarter},function(err, result) {

                if(!result){
                    return;
                }

                var deptList = $("#deptList_tmp").html();
                var sdata = $("#departmentList");
                sdata.html("");
                $.each(result,function(index,item){
                    sdata.append(_.template(deptList, item));
                })
                events();
            });
        })
    }

    function bindLeftMenuStyleEvent(){
        $(".submenu li", $("#left_menu")).bind("click", function(event){

            $("#menu_2").html($(this).attr("name"));
        });
    }

});


