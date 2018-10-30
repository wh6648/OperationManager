// 方法简介：获取HTML代码片段插入到指定的容器中
// 参数一：views下的html代码片段位置，从view下开始算起，前面不加/
//参数二：要插入到的容器ID
var com;
if(!com) com = {};
com.zhixun = {}
com.zhixun.setPartials=function(path,parent){
    $.get("../views/" + path , function(result){
        $("#"+parent).html(result);
    });
};



