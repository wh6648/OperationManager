
$(function () {
  "use strict";
  var InterValObj; // timer变量，控制时间
  var curCount = 180; // 当前剩余秒数
  var uname;
  var pwd;

  // 注册事件
  events();
  render();

  function events() {

    //用户名或密码失去焦点的时候，判断是不是需要验证码
    $("#name, #pass").on("blur", function (err) {
      checkUser();
    });

    //点击登陆按钮
    $("#signIn").bind("click", function(event){

      var username = $("#name").val()
          ,password = $("#pass").val()
          ,random = $("#random-num").val();

      if (username.length <= 0 || password.length <= 0) {
        alert("请输入用户名和密码。");
      } else {
        //判断这个用户是不是人事，和区域组
        light.doget("/performance/getUserGroup", {id:username,password:password}, function(err, result) {
          if (result) {
            var groupName = result.items[0].name;
            if (groupName === '人事组' || groupName === '区域组') {

              $(".random").removeClass("random-hid");

              if(random.length <= 0) {
                alertify.log("请输入验证码！");
              }else {

                //获得上次验证码的时间
                light.doget("/performance/getUserCodeTime", {name: username, password: password}, function(err, result) {
                  if(result) {
                    //判断验证码是否可用－时间
                    var eTime,nTime,surplus_time;
                    //获得当前日期
                    var dd = moment(result.items[0].extend.codeCreateTime).format('YYYY-MM-DD HH:mm:ss');
                    var nowDate = new Date();

                    var aa = [parseInt(dd.split("-")[0]), parseInt(dd.split("-")[1]), parseInt(dd.split("-")[2]), parseInt(moment(dd).format("H")), parseInt(dd.split(":")[1]), parseInt(moment(result.items[0].extend.codeCreateTime).format("s"))];
                    var bb = [parseInt(moment(nowDate).format("YYYY")), parseInt(moment(nowDate).format("M")), parseInt(moment(nowDate).format("D")), parseInt(moment(nowDate).format("H")), parseInt(moment(nowDate).format("m")), parseInt(moment(nowDate).format("s"))];
                    //alert("aa:"+aa);
                    //alert("aa:"+parseInt((dd.split(":")[0]).split(' ')[1]));
                    //alert(parseInt(moment(dd).format("H")));
                    eTime = moment(aa);
                    nTime = moment(bb);
                    surplus_time = nTime.diff(eTime, 'seconds');

                    if(surplus_time < 180) {//3分钟
                      light.doget("/login", {name: username, password: password, random:random}, function(err, result) {
                        if (err) {
                          return alert("验证码不正确，请确认！");
                        }
                        window.location = "/site/home";
                      });
                    }else {
                      return alert("验证码不正确，请确认！");
                    }

                  }else {
                    return alert("验证码不正确，请确认！");
                  }
                });

              }
            }else {
              $(".random").addClass("random-hid");

              random = "";
              light.doget("/login", {name: username, password: password, random:random}, function(err, result) {
                if (err) {
                  return alert("用户名或密码不正确，请重新输入。");
                }
                window.location = "/site/home";
              });
            }
          }else {
            random = "";
            light.doget("/login", {name: username, password: password, random:random}, function(err, result) {
              if (err) {
                return alert("用户名或密码不正确，请重新输入。");
              }
              window.location = "/site/home";
            });
          }

        });

      }

      return false;
    });

    /**
     * 点击获得验证码
     */
    $("#get-random-num").on("click", function (event) {

      var username = $("#name").val()
          , password = $("#pass").val();

      uname = username;
      pwd = password;

      if (username.length <= 0 || password.length <= 0) {
        alert("请输入用户名和密码。");
      } else {
        light.doget("/performance/createMessage", {name: username, password: password}, function (err, result) {
          console.log(result);
          if(result) {
            if(result === true) {
              alertify.success("获得验证码成功，请输入验证码！");
              InterValObj = window.setInterval(SetRemainTime, 1000); // 启动计时器，1秒执行一次
            }else {
              alertify.error("获得验证码失败，请联系客服！");
            }
          }else {
            alertify.error("获得验证码失败，请联系客服！");
          }
        });
      }
      return false;

    });

  }

  // random show backgroup imgs
  function render(){
    var imgcount = Math.floor(Math.random()*5+1);
    $("body").addClass("bg" + imgcount);

    //判断用户的权限
    checkUser();
  }

  /**
   * 设置倒计时提醒
   */
  function SetRemainTime() {

    if (curCount == 0) {

      curCount = 180;
      window.clearInterval(InterValObj); // 停止计时器

      //light.doget("/performance/resetMessage", {username:uname, password:pwd}, function (err, result) {
      //
      //  if (result) {
      //    window.clearInterval(InterValObj); // 停止计时器
          $("#get-random-num").attr("disabled", false);
          $("#get-random-num").children("span").html("发送验证码");
      //  } else {
      //    window.clearInterval(InterValObj); // 停止计时器
      //  }
      //});

    } else {
      curCount--;
      $("#get-random-num").attr("disabled", true);
      $("#get-random-num").children("span").html("重新发送("+curCount+")");
    }
  }

  function checkUser() {
    var username = $("#name").val()
        , password = $("#pass").val();

    //判断这个用户是不是人事，和区域组
    light.doget("/performance/getUserGroup", {id:username,password:password}, function(err, result) {

      if (result) {
        var groupName = result.items[0].name;
        if (groupName === '人事组' || groupName === '区域组') {
          $(".random").removeClass("random-hid");
        }else {
          $(".random").addClass("random-hid");
        }
      }else {
        $(".random").addClass("random-hid");
      }

    });
  };

});
