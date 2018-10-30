$(function() {

    "use strict";
    events();
    render();

    /**
     * 绑定事件
     */
    function events() {

        //导出excel按钮
        $(".export-excel").on("click", function(e) {
            alert("此功能正在开发中！敬请期待！");
            return;
            //e.preventDefault();
            //light.download("/performance/operateExcel", {});
            //light.download("/performance/operateEjsExcel", {});//用这个
        });

        //导出公司得那张大表
        $(".export-excel-company").on("click", function (e) {
            light.download("/performance/operateEjsExcelForCompany", {});
        });

        $("#fileupload-btn").click(function(err) {
            alert("此功能正在开发中！敬请期待！");
            return;
        });

        //上传文件－先注了
        //light.initFileuploadExcel('#fileupload-btn', {success: function(files) {
        //    //alertify.success("上传成功.");
        //}});

        //light.initFileupload('#fileupload-btn', {success: function(files) {
        //    alertify.success("上传成功.");
        //}});


        //导入excel按钮
        //light.initFileupload('.import-excel', {}, function(file) {
        //        alertify.success("上传成功.");
        //    }, function(){
        //        alertify.error("上传失败");
        //    }, null);

        //上传文件事件
        //$("#file").change(function(){
        //    var fileName = $(this).get(0).files[0];
        //    if(fileName){
        //        var fileSize = 0;
        //        if (file.size > 1024 * 1024) fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        //        else fileSize = (Math.round(fileName.size * 100 / 1024) / 100).toString() + 'KB';
        //
        //    }
        //});

        //点击导入模板
        //$(".import-excel").on("click",function(){
        //
        //    var fileName = $("#file").get(0).files[0];
        //
        //    if(fileName == undefined || fileName == ''){
        //        alertify.alert("请选择Excel模板");
        //    }else {
        //
        //        $.ajaxFileUpload({
        //            url: '/performance/impExcel',
        //            secureuri: false, //一般设置为false
        //            fileElementId: 'file', //文件上传空间的id属性  <input type="file" id="file" name="file" />
        //            dataType: 'json', //返回值类型 一般设置为json
        //            success: function (data, status){//服务器成功响应处理函数
        //                console.log("success");
        //
        //            },
        //            error: function (data, status, e){//服务器响应失败处理函数
        //                //console.log("%%error:",data);
        //            }
        //        });
        //    }
        //
        //});

    }

    /**
     * 渲染页面
     */
    function render() {

    }
});