$(function() {
    "use strict";
    var list_status = 0;//未读列表
    var button_busy = 0;//按钮空闲状态
    events();
    render();

    function events() {

        $("#msg_list_change_b").on("click", function (events){
            if (button_busy == 0)
            {
                var $this = $(this);
                var $first_msg_n = $("#first_msg_n");
                var userCode = $("#hid-user-code").val();
                var userOrgId = $("#hid-user").val();
                button_busy = 1;
                if (list_status == 1)
                {
                    $this.html("查看已读");
                    $first_msg_n.siblings().remove();
                    light.doget("/performance/getUserMsg", {
                        userCode:userCode,
                        userOrgId:userOrgId,
                        read_type:false//未读
                    }, function(err, result) {
                        if(result) {
                            if (result.result_type)
                            {

                                var get_data = result.get_data;
                                //get the object of msg_div
                                var $msg_div = $("#msg_div");
                                //set msg number
                                $("#msg_num").html(get_data.length);
                                $("#show_msg_num").html(get_data.length);

                                //set msg context
                                for (var i=0; i < get_data.length; i++)
                                {
                                    var $new_item = $(
                                        "<li> " +
                                        "<a href='javascript:void(0)'> " +
                                        "<i class='btn btn-xs btn-primary fa fa-user'></i>"+
                                        get_data[i].CONTENT+
                                        "(" +  moment(get_data[i].SUB_TIME).subtract('hours', 8).format('YY-MM-DD HH:mm') +
                                        ")" +
                                        "<span class='pull-right badge'>关闭" +
                                        "<p hidden>" +
                                        get_data[i].ID+
                                        "</p>" +
                                        "</span>" +
                                        "</a> " +
                                        "</li>"
                                    );
                                    $msg_div.append($new_item);
                                }
                            }
                            else
                            {
                                alert("数据不对！");
                            }
                        }else {
                            alert("数据不对！");
                        }
                        button_busy = 0;//回复按钮状态
                    });
                }
                else
                {
                    $this.html("查看未读");
                    $first_msg_n.siblings().remove();
                    light.doget("/performance/getUserMsg", {
                        userCode:userCode,
                        userOrgId:userOrgId,
                        read_type:true}, function(err, result) {
                        if(result) {
                            if (result.result_type)
                            {

                                var get_data = result.get_data;
                                //get the object of msg_div
                                var $msg_div = $("#msg_div");

                                //set msg context
                                for (var i=0; i < get_data.length; i++)
                                {
                                    var $new_item = $(
                                        "<li> " +
                                        "<a href='javascript:void(0)'> " +
                                        "<i class='btn btn-xs btn-primary fa fa-user'></i>"+
                                        get_data[i].CONTENT +
                                        "(" +  moment(get_data[i].SUB_TIME).subtract('hours', 8).format('YY-MM-DD HH:mm') +
                                        ")" +
                                        "</a> " +
                                        "</li>"
                                    );
                                    $msg_div.append($new_item);

                                }
                            }
                            else
                            {
                                alert("数据不对！");
                            }
                        }else {
                            alert("数据不对！");
                        }
                        button_busy = 0;//回复按钮状态
                    });
                }
                list_status = (list_status + 1)%2;
            }
            else
            {
                alert("消息正在刷新，请不要点击太快哟。");
            }
            events.stopPropagation();
        });
        $("#msg_div").on("mouseover","span",function (){
            $(this).addClass("badge-info");
        });
        $("#msg_div").on("mouseleave","span",function (){
            $(this).removeClass("badge-info");
        });
        $("#msg_div").on("click","span",function (events){
            var $this = $(this);
            //待修改状态的消息的ID
            var change_id = $this.children("p").eq(0).html();

            //修改消息状态
            //
            light.doget("/performance/msgChangeStatus", {c_id:change_id,
                read_type:false}, function (err, result){
                if(result) {
                    if (result.result_type)
                    {
                        $this.parent().parent().remove();
                        $("#msg_num").html($("#msg_num").html()-1);
                        $("#show_msg_num").html($("#show_msg_num").html()-1);
                    }
                    else
                    {
                        alert("关闭消息失败");
                    }
                }else {
                    alert("关闭消息失败");
                }
            });
            events.stopPropagation();
        });

    }

    function render() {

        var userCode = $("#hid-user-code").val();
        var userOrgId = $("#hid-user").val();
        //通过用户code查出该用户的员工msg
        light.doget("/performance/getUserMsg", {
            userCode:userCode,
            userOrgId:userOrgId,
            read_type:false}, function(err, result) {
            if(result) {
                if (result.result_type)
                {

                    var get_data = result.get_data;

                    //语音提醒
                    if(get_data.length > 0) {
                        var index_audio = 0,
                            index_audio1 = 0;

                        $('<audio id="chatAudio">' +
                        '<source src="/static/audio/bell-ringing.mp3" type="audio/mpeg">' +                 //铃声
                        '<source src="/static/audio/bell-ringing.ogg" type="audio/mpeg">' +                 //铃声
                        '</audio>').appendTo('body');//载入声音文件

                        $('<audio id="chatAudio1">' +
                        '<source src="/static/audio/haveNoReadInfo.mp3" type="audio/mpeg">' +               //有未读信息
                        //'<source src="/static/audio/haveNewInfo.mp3" type="audio/mpeg">' +                //有信息消息
                        //'<source src="/static/audio/superiorExamine.mp3" type="audio/mpeg">' +            //上级已审核
                        '</audio>').appendTo('body');//载入声音文件

                        $('#chatAudio')[0].addEventListener('ended', function () {
                            setTimeout(function () {if(index_audio<1){ $('#chatAudio')[0].play(); index_audio++}}, 500);
                        }, false);
                        $('#chatAudio1')[0].addEventListener('ended', function () {
                            setTimeout(function () {if(index_audio1<1){ $('#chatAudio1')[0].play(); index_audio1++}}, 700);
                        }, false);

                        $('#chatAudio')[0].play(); //播放声音
                        $('#chatAudio1')[0].play(); //播放声音
                    }

                    //get the object of msg_div
                    var $msg_div = $("#msg_div");
                    //set msg number
                    $("#msg_num").html(get_data.length);
                    $("#show_msg_num").html(get_data.length);

                    //set msg context
                    for (var i=0; i < get_data.length; i++)
                    {
                        var $new_item = $(
                            "<li> " +
                                "<a href='javascript:void(0)'> " +
                                    "<i class='btn btn-xs btn-primary fa fa-user'></i>"+
                                    get_data[i].CONTENT+
                                    "(" + moment(get_data[i].SUB_TIME).subtract('hours', 8).format('YY-MM-DD HH:mm') +
                                    ")" +
                                    "<span class='pull-right badge'>关闭" +
                                        "<p hidden>" +
                                        get_data[i].ID+
                                        "</p>" +
                                    "</span>" +
                                "</a> " +
                            "</li>"
                        );
                        $msg_div.append($new_item);
                    }
                }
                else
                {
                    //alert("no");
                }
            }else {
                //alert("no");
            }
        });


    }

});