/**
 * Created by root on 14-12-8.
 */
$(function () {

    "use strict";
    // 注册事件

    render();
    $("#sidebar").removeClass("menu-min");
    var loading = "<img id='img' src='../../assets/img/loading.gif'/>";

    // 绑定事件
    function events() {


        $(".areaReport").bind("click", function(event){
            $("#area_office > li").removeClass("active");
            $(this).parent("li").addClass("active");
        });


        // 各区域报表
        $(".areaReport").bind("click", function(event){

            // com.zhixun.setPartials("quotaReport/index.html","page-content");
            $("#hid_areaCode").val($(this).attr("data-code"));
            $("#hid_areaName").val($(this).attr("data-name"));
            $("#hid_areaPersonCount").val('');
            $("#page-content").html("");
            com.zhixun.setPartials("quota/areaReport/area_t1.html","page-content");

            var areaChid = $(this).parent().children("ul");
            var areaListChild = $("#areaListChild_tmp").html();

            var reportCode = $(this).attr("data-code");

            light.doget("/quota/getAllAreaChildReport",{reportCode:reportCode},function(err, result) {
                areaChid.html("");
                if(!result){
                  return;
                }

                $.each(result,function(index,item){
                  areaChid.append(_.template(areaListChild, item));
                });

                //点击办事处获得信息
                $(".areaReportChild").on("click", function(event){

                    $("#hid_departmentCode").val($(this).attr("data-code"));
                    $("#hid_departmentName").val($(this).attr("data-name"));
                    $("#hid_departmentPersonCount").val($(this).attr("data-persons"));

                    $(this).closest("ul").find("li").removeClass("active");
                    $(this).parent("li").addClass("active");
                    com.zhixun.setPartials("quota/departmentReport/departmentReport.html","page-content");

                });

            });

        });



    }

    function render () {

        //刚进入此界面，将中间区域清空  -- 暂时写法--
        $("#page-content").html("");

        bindLeftMenuStyleEvent();
        getAreaList();

    }

    /**
     * 获取各区域数据
     */
    function getAreaList(){
        var area_office = $("#area_office");
        var areaList = $("#areaList_tmp").html();

        area_office.html(loading);

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


            light.doget("/quota/getAllAreaReport",{year:date_year,month:date_quarter},function(err, result) {

                area_office.html("");
                if(!result){
                    return;
                }

                $.each(result,function(index,item){
                    area_office.append(_.template(areaList, item));
                });
                events();
            });
            });
    }

    function bindLeftMenuStyleEvent(){
        $(".submenu li", $("#left_area_report")).bind("click", function(event){

            $("#menu_2").html($(this).attr("name"));
        });
    }

});


