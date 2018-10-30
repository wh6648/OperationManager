/**
 * Created by root on 14-12-7.
 */

$(function () {

    "use strict";
    events();
    render();

    function events () {

    };

    function render() {

        //jQuery.ajax({
        //    url:"http://115.28.50.129:8075/WebReport/ReportServer?op=fs_load&cmd=sso",//单点登录的报表服务器
        //    dataType:"jsonp",//跨域采用jsonp方式
        //    data:{"username":"admin","password":"abc123"},
        //    jsonp:"callback",
        //    timeout:5000,//超时时间（单位：毫秒）
        //    success:function(data) {
        //        if (data.status === "success") {
        //            alertify.success("ok");
        //            //登录成功
        //        } else if (data.status === "fail"){
        //            alert.error("no");
        //            //登录失败（用户名或密码错误）
        //        }
        //    },
        //    error:function(){
        //        alert("error");
        //        // 登录失败（超时或服务器其他错误）
        //    }
        //});

        var report_frame = $("#report_frame").html(""),
            tmplList_reportFrame = $("#tmplList_reportFrame").html();

        report_frame.append(_.template(tmplList_reportFrame));

    };

});