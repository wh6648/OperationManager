$(function() {

    "use strict";
    render();
    events();
    var groupName,operationstatus;
    function judgeTime(name,url){
        //if (operationstatus === '10') {
        //    light.doget("/performance/getTime", {name:name}, function(err, result) {
        //        var cre_time = moment(result[0].CRE_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
        //            end_time = moment(result[0].END_TIME).subtract('hour', 8).format("YYYY-MM-DD HH:mm:ss"),
        //            nowTime = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
        //        console.log("###"+nowTime+"****"+cre_time);
        //        if((cre_time<nowTime)&&(nowTime<end_time)){
                    window.location = url;
        //        }else{
        //            alert("当前时间不可操作");
        //        }
        //    });
        //}else{
        //    alert("绩效考评未开始");
        //}
    }
    function events() {

        $("#ls_group").on("click",function(){
            var $this = $(this);
            if ($this.hasClass("active"))
            {
                $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
            else
            {
                $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
            }
            //if (groupName === '公司组') {
            //    judgeTime("总奖金分配","/site/bonusDistribution?name=绩效考核");
            //}else{
            //    alert("您没有权限进行该操作");
            //    return false;
            //}
        });

        $("#ls_hr").on("click",function(){
            //if (groupName === '人事组') {
                var $this = $(this);
                if ($this.hasClass("active"))
                {
                    $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                }
                else
                {
                    $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                    $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
                }
            //}else{
            //    alert("您没有权限进行该操作");
            //    return false;
            //}
        });
        $("#ls_office").on("click",function(){
            var $this = $(this);
            if ($this.hasClass("active"))
            {
                $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
            else
            {
                $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
            }
            //if (groupName === '办事处主任组') {
            //}else{
            //    alert("您没有权限进行该操作");
            //    return false;
            //}
        });
        $("#ls_area").on("click",function(){
            //if (groupName === '区域组') {
                var $this = $(this);
                if ($this.hasClass("active"))
                {
                    $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                }
                else
                {
                    $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                    $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
                }
            //}else{
            //    alert("您没有权限进行该操作");
            //    return false;
            //}
        });
        $("#ls_company").on("click",function(){
            //if (groupName === '公司组') {
                var $this = $(this);
                if ($this.hasClass("active"))
                {
                    $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                }
                else
                {
                    $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                    $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
                }
            //}else{
            //    alert("您没有权限进行该操作");
            //    return false;
            //}
        });
        $("#ls_hr_demo").on("click",function(){
            judgeTime("各办奖金分配","/site/bonus?name=绩效考核");
        });
        $("#ls_hr_office").on("click",function(){
            judgeTime("各办系数设置","/site/officeSet?name=绩效考核");
        });
        $("#checkoperation").on("click",function(){
            judgeTime("公司会审","/site/checkoperation?name=绩效考核");
        });
        //$("#ls_office").on("click",function(){
        //    judgeTime("主管申报","/site/office_fill?name=绩效考核");
        //});
        $("#ls_area_check").on("click",function(){
            judgeTime("上级审批","/site/check_office_submit?name=绩效考核");
        });
        //$(".m1:has(.m2)").on("click", function (){
        //    var $this = $(this);
        //    if ($this.hasClass("active"))
        //    {
        //        $this.removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
        //    }
        //    else
        //    {
        //        //保证同一时间只有一个菜单是打开的，问是否有必要
        //        $(".m1.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
        //        $this.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
        //    }
        //});
        $(".m2:has(.m3)").on("click", function (event){
            var $this = $(this);
            if ($this.hasClass("active"))
            {
                $this.removeClass("active").removeClass("open").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
            else
            {
                //保证同一时间只有一个菜单是打开的
                $(".m2.active").removeClass("active").children("a").children("b").removeClass("fa-angle-up").addClass("fa-angle-down");
                $this.addClass("active").addClass("open").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");;
            }
            event.stopPropagation();
        });
        $(".m2:not(:has('.m3'))").on("click", function (event) {
            event.stopPropagation();
        });
        $(".m3").on("click", function (event) {
            event.stopPropagation();
        });
    }

    function getAll(){
        var groupId = $("#hid-user-groups").val();
        light.doget("/group/get", {id:groupId}, function(err, result) {
            groupName = result.name;
        });
        light.doget("/performance/getNowTime", {}, function(err, result) {
            operationstatus = result[0].OPERATIONSTATUS;
        });
    }
    function render() {
        getAll();
        var id_val = "#"+$("body").data("value");
        var id = $(id_val);
        if (id.hasClass("m1"))
        {
            id.addClass("active");
        }
        else if(id.hasClass("m2"))
        {

            var par_id = $(".m1:has("+id_val+")");
            par_id.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
            id.addClass("active");
        }
        else if(id.hasClass("m3"))
        {
            var par_par_id = $(".m1:has("+id_val+")");
            var par_id = $(".m2:has("+id_val+")");
            par_par_id.addClass("active").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
            par_id.addClass("active").addClass("open").children("a").children("b").removeClass("fa-angle-down").addClass("fa-angle-up");
            id.addClass("active");
        }
        else
        {
            //错误的选项编码
        }
    }
});