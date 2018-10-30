/**
 * 文件上传
 * lyj
 * @param sel
 * @param option
 * @param success
 * @param error
 * @param progress
 */
light.initFileuploadExcel = function (sel, option, success, error, progress) {
    var self = this;
    var btn = $(sel);
    var input = $('<input type="file" style="display: none" accept="*" />');

    if(option && option.multiple){
        input.attr('multiple','multiple');
    }
    input.insertAfter(btn).bind("change", function (event) {
        var files = event.target.files;

        var fileName = files[0].name;

        if (!files || files.length <= 0) {
            return false;
        }

        var fd = new FormData();

        //file type check
        if (option && option.accept) {
            console.log("########::::",option);
            var accept = option.accept.split(',');
            for (var i = 0; i < files.length; i++) {
                if (!_.contains(accept, files[i].name.split('.').pop())) {
                    alertify.error("只支持 " + option.accept + " 格式的文件上传。");
                    event.target.value = "";
                    return;
                }
            }
        }

        //size limit check
        if (option && option.sizeLimit) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].size > option.sizeLimit) {
                    alertify.error("文件: " + files[i].name + " 太大。");
                    event.target.value = "";
                    return;
                }
            }
        }

        for (var i = 0; i < files.length; i++) {
            fd.append("files", files[i]);
        }

        //判断文件是否可以上传－文件格式
        if(fileName.substring(fileName.indexOf(".")) != '.xlsx') {
            alert("请选择xlsx格式的文件！");
            return false;
        };

        //弹出确定是先导出后导入的模版？
        var true_false = window.confirm("确定是先导出，再导入模版？");
        if (true_false) {
           // TODO: URL被限定不能成为共同，这个部分交给调用程序端做比较好

           self.dopostData('/performance/impExcel', option, fd, function (err, result) {
               event.target.value = "";
               if (err) {
                   if (error) {
                       error.call(btn, err);
                   }
               } else {
                   if (success) {
                       success.call(btn, result.data);
                   }
               }
           }, function (progress_value) {
               if (progress) {
                   progress.call(btn, progress_value);
               }
           });
        }else {
           return false;
        }
    });

    btn.bind("click", function () {
        input.trigger("click");
        return false;
    });
};
