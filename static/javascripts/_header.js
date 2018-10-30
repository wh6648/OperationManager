/**
 * Created by wsights on 14-12-19.
 */
$(function () {
  "use strict";
  var oldPassword
    , password1
    , password2
    , p
    , p1
    , p2
    , username = $("#id").val()
    , id = $("#_id").val();

  function events(){

    $("#psUpdate").click(function(){

      $("#oldPassword").val("");
      $("#password1").val("");
      $("#password2").val("");
      $("#ok").addClass("hidden");
      $("#err").addClass("hidden");
      $("#tip1").addClass("hidden");
      $("#tip2").addClass("hidden");

      $("#passwordUpdate").modal("show");

      $("#oldPassword").blur(function(){

        oldPassword = $("#oldPassword").val();

        light.doget("/user/judgePass", {name: username, password: oldPassword}, function(err, result) {

          if (err) {
            $("#err").removeClass("hidden");
            $("#ok").addClass("hidden");
            p = "no";
          }else if(result = true){
            $("#ok").removeClass("hidden");
            $("#err").addClass("hidden");
            p = "yes";
          }else {
            $("#err").removeClass("hidden");
            $("#ok").addClass("hidden");
            p = "no";
          }

        });

      });
      $("#oldPassword").focus(function(){
        $("#ok").addClass("hidden");
        $("#err").addClass("hidden");
      });

      $("#password1").blur(function(){
        password1 = $("#password1").val();
        if(password1 == ""){
          $("#tip1").removeClass("hidden");
          p1 = "no";
        }else{
          p1= "yes";
        }
      });

      $("#password1").focus(function(){
        $("#tip1").addClass("hidden");
      });

      $("#password2").blur(function(){
        password2 = $("#password2").val();
        if(password1 != password2){
          $("#tip2").removeClass("hidden");
          p2 ="no";
        }else{
          p2 ="yes";
        }
      });

      $("#password2").focus(function(){
        $("#tip2").addClass("hidden");
      });

      $("#newPsSave").on("click",function(){

        if(p === "yes" && p1 === "yes" && p2 === "yes" ){

          light.doput("/user/resetPassword", {oldPass: oldPassword, newPass: password1, conPass: password2, id: username}, function(err, result) {

            $("#passwordUpdate").modal("hide");
            window.location = "/site/login";
//            alertify.success("修改密码成功,请重新登录!");

          });

        }else{
          alertify.error("修改密码失败!");
        }

      });

    });

    $("#header_name").bind("click",function(){
      window.location = "/site/home";
    });
    $("#home_btn").bind("click",function(){
      window.location = "/site/home";
    });

  }

  function render(){
    $("#psUpdate").css({'cursor':'pointer'});//显示成小手
    $("#home_btn").css({'cursor':'pointer'});
  }
  events();
  render();
});
