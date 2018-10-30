/**
 * Created by wights on 15-8-11.
 */
$(function (){
    "use strict";
    events();
    render();
    var input_tag;

    function events(){
        //备注编辑div确定取消按钮
        $("#area_ok").on("click",function (){
            input_tag.val($("textarea.note_area").val());
            $("#change_note").modal("hide");
        });
        $("#area_cancle").on("click",function (){
            $("#change_note").modal("hide");
        });

       /* //移动到备注显示全部备注内容
        $("table").on("mouseover","[data-rel=tooltip]", function() {
            $(this).tooltip();
        });*/
        //点击备注input弹出备注编辑div
        $("table").on("focus","input.note_input_tag",function (){
            $("#change_note").modal("show");
            input_tag = $(this);
            $("textarea.note_area").val($(this).val());
            $(this).trigger("blur");
            setTimeout(function (){
                $("textarea.note_area").focus();
            }, 500);//延时获得焦点，不是好的解决方式，暂时使用
            //$("textarea.note_area").prop("autofocus",true);
        });
    };
    function render(){

    };



})