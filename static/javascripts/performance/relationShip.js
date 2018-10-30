$(function(){
    var respon;
    render();
    function render() {
        var groupId = $("#hid-user-groups").val();
        light.doget("/group/get", {id:groupId}, function(err, result) {
            if (result.name === '人事组') {
                events();
                companyRender();
            }else{
                alert("您没有权限进行该操作");
            }
        });
    }

    function companyRender(){
        light.doget("/performance/getAllCompany", function(err, result){
            for(var i=0;i<result.length;i++){
                $("#select_company").append("<li class='' id='"+result[i].ID+"'><a data-toggle='tab' href='#home4'>"+result[i].NAME+"</a></li>");
            }
            $("#"+result[0].ID).addClass("active");
            areaRender(result[0].ID);
            $("#select_respon").append("<option class='area'>---请选择---</option>");
            $('#select_respon').chosen();
        });
    }
    function areaRender(companyId){
        $("#select_area").empty();
        $("#select_area").append("<option class='area'>---请选择---</option>");
        light.doget("/performance/getAreaByCompanyId",{companyId:companyId}, function(err, result){
            for(var i=0;i<result.length;i++){
                $("#select_area").append("<option id='"+result[i].ID+"' class='area'>"+result[i].NAME+"</option>");
            }
            $('#select_area').chosen();
        });
    }
    function officeRender(areaId,responId){
        light.doget("/performance/getOfficeByAreaId",{areaId:areaId, responId:responId}, function(err, result){
            officeEmpty();
            for(var i=0;i<result.length;i++){
                if(result[i].RESPONSIBLEPER===null){
                    $("#select_office1").append("<div id='"+result[i].ID+"' style='width: 65px;height: 40px' class='left yes'><span class='btn btn-info btn-sm tooltip-info'>"+result[i].NAME+"</span></div>");
                }else{
                    $("#select_office2").append("<div id='"+result[i].ID+"' style='width: 65px;height: 40px' class='right yes'><span class='btn btn-info btn-sm tooltip-info'>"+result[i].NAME+"</span></div>");
                }
            }
            respon = $("#select_respon").find("option:selected").attr("id");
        });
    }
    function responRender(areaId){
        $("#select_respon").empty();
        $("#select_respon").append("<option class='area'>---请选择---</option>");
        light.doget("/performance/getResponByAreaId",{areaId:areaId}, function(err, result){
            for(var i=0;i<result.length;i++){
                $("#select_respon").append("<option id='"+result[i].ID+"'>"+result[i].NAME+"</option>");
            }
            $('#select_respon').chosen();
        });
    }

    function companyClick(companyId){
        $("#select_area").chosen("destroy");
        areaRender(companyId);
        $("#select_respon").chosen("destroy");
        $("#select_respon").empty();
        $("#select_respon").append("<option class='area'>---请选择---</option>");
        $("#select_respon").chosen();
        officeEmpty();
    }
    function areaClick(){
        var areaId = $("#select_area").find("option:selected").attr("id");
        $("#select_respon").chosen("destroy");
        if(areaId === undefined){
            $("#select_respon").empty();
            $("#select_respon").append("<option class='area'>---请选择---</option>");
            $("#select_respon").chosen();
        }else{
            responRender(areaId);
        }
        officeEmpty();
    }
    function responClick(){
        var areaId = $("#select_area").find("option:selected").attr("id");
        var responId = $("#select_respon").find("option:selected").attr("id");
        if(responId === undefined){
            officeEmpty();
        }else{
            officeRender(areaId,responId);
        }
    }
    function events(){
        $("#select_company").on("click","li",function(){
            var companyId = $(this)[0].id;
            if($(".no").length>0){
                var aa = window.confirm("页面已发生修改，是否保存？");
                if(aa === true) {
                    subOffice(respon);
                    alertify.success("保存成功！");
                    companyClick(companyId);
                }else {
                    alertify.log("已取消保存！");
                    companyClick(companyId);
                }
            }else{
                companyClick(companyId);
            }
            respon = $("#select_respon").find("option:selected").attr("id");
        });
        $("#select_area").change(function(){
            if($(".no").length>0){
                var aa = window.confirm("页面已发生修改，是否保存？");
                if(aa === true) {
                    subOffice(respon);
                    alertify.success("保存成功！");
                    areaClick();
                }else {
                    alertify.log("已取消保存！");
                    areaClick();
                }
            }else{
                areaClick();
            }
            respon = $("#select_respon").find("option:selected").attr("id");
        });
        $("#select_respon").change(function(){
            if($(".no").length>0){
                var aa = window.confirm("页面已发生修改，是否保存？");
                if(aa === true) {
                    subOffice(respon);
                    alertify.success("保存成功！");
                    responClick();
                    respon = $("#select_respon").find("option:selected").attr("id");
                }else {
                    alertify.log("已取消保存！");
                    responClick();
                    respon = $("#select_respon").find("option:selected").attr("id");
                }
            }else{
                responClick();
                respon = $("#select_respon").find("option:selected").attr("id");
            }
        });
        $("#office_table").on("click", ".left", function(){
            $("#select_office2").append($(this));
            $(this).toggleClass("left right yes no");
        });
        $("#office_table").on("click", ".right", function(){
            $("#select_office1").append($(this));
            $(this).toggleClass("left right yes no");
        });
        $("#subBonus").bind("click",function(){
            alertify.confirm("是否确定提交？", function(state) {
                if(state) {
                    subOffice(respon);
                    alertify.success("提交成功！");
                }else {
                    alertify.log("已取消提交！");
                }
            });
        });
    }
    function subOffice(respon){
        var array = [];
        var officeId;
        for(var i=0;i<$("#select_office1").children("div").length;i++){
            officeId = $("#select_office1").children("div")[i].id;
            array.push({officeId:officeId, responId:null});

        }
        for(var i=0;i<$("#select_office2").children("div").length;i++){
            officeId = $("#select_office2").children("div")[i].id;
            responId = $("#select_respon").find("option:selected").attr("id");
            array.push({officeId:officeId, responId:respon});
        }
        light.doput("/performance/setOfficeRelation", {array: array}, function(err, result) {
        });
        $(".no").toggleClass("yes no");
    }
    function officeEmpty(){
        $("#select_office1").empty();
        $("#select_office2").empty();
    }
    function judgeUpdate(){
        if($(".no").length>0){
            alertify.confirm("页面已发生修改，是否保存？", function(state) {
                if(state) {
                    subOffice();
                    alertify.success("保存成功！");
                }else {
                    alertify.log("已取消保存！");
                }
            });
        }
    }

});