/**
 * Created by root on 14-12-7.
 */

$(function () {

  "use strict";
  var tmp_home;

  function events() {

    /**
     * 指标考核
     * bind quota Assess event
     */
    $("#quotaAssess").bind("click", function(event){
      var groupId = $("#groupId").val();
      tmp_home = $(this).attr("title");
      light.doget("/group/get", {id:groupId}, function(err, result) {
        if (result.name === '运管组') {
          window.location = "/site/default?name="+tmp_home+"";
        }else {
          alertify.log("您没有访问权限！");
        }
      });


      return false;
    });
    /**
     * 运营中心
     */
    $("#operationCenter").bind("click", function(event){
      var groupId = $("#groupId").val();
      tmp_home = $(this).attr("title");
      light.doget("/group/get", {id:groupId}, function(err, result) {

        if (result.name === '运管组') {
          window.location = "/site/operation_default?name="+tmp_home+"";
        }else {
          alertify.log("您没有访问权限！");
        }
      });


      return false;
    });
    /**
     * 绩效考核
     */
    $("#performance").on("click", function(event){
      var groupId = $("#groupId").val();

      tmp_home = $(this).attr("title");
      light.doget("/group/get", {id:groupId}, function(err, result) {
        if (result.name === '区船管组' ||result.name === '区运管组'  ||result.name === '区箱管组'  ||result.name === '区商务组'  ||result.name === '商务组'  ||result.name === '箱管组'  ||result.name === '办事处主任组'  ||result.name === '区域组'  ||result.name === '公司组'  ||result.name === '人事组'  ||result.name === '董事组'  ||result.name === '运管组'  ||result.name === '船管组' ||result.name === '区物流事业部组' ) {
          window.location = "/site/flowChart?name="+tmp_home+"";
        }else {
          alertify.log("您没有访问权限！");
        }
      });

      return false;
    });
  }

  function render(){

  }

  render();
  // 注册事件
  events();

});
