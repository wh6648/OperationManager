$(function() {
    "use strict";
    events();
    render();

    function events() {

    }

    function render() {

        var $control = $(".time-control").attr("data-val");
        var params;

        if($control === 'zjfp') {
            params = '2';//总奖分配
            getTime(params);
        }
        if($control === 'zgsb') {
            params = '8';//主管申报
            getTime(params);
        }
        if($control === 'gbjjfp') {
            params = '7';//各办奖金分配
            getTime(params);
        }
        //if($control === 'gbjjfp') {
        //    params = '100002';
        //  getTime(params);
        //}
        if($control === 'sjsp') {
            params = '9';
            getTime(params);
        }
        if($control === 'gshs') {
            params = '10';
            getTime(params);
        }
        if($control === 'swrssb') {
            params = '3';
            getTime(params);
        }
        if($control === 'xgrssb') {
            params = '4';
            getTime(params);
        }

    }

    function getTime(params) {

        //获得当前日期
        var nowDate = new Date();

        var surplus_time,eTime,nTime;

        light.doget("/performance/getTime", {name:params}, function(err, result) {
            //console.log("###",result[0].END_TIME);
            //console.log("###",parseInt(((result[0].END_TIME).split(":")[0]).split('T')[1]));
            if(result && result.length != 0) {

                var aa = [parseInt((result[0].END_TIME).split("-")[0]), parseInt((result[0].END_TIME).split("-")[1]), parseInt((result[0].END_TIME).split("-")[2]), parseInt(((result[0].END_TIME).split(":")[0]).split('T')[1]), parseInt(result[0].END_TIME.split(":")[1]), parseInt(moment(result[0].END_TIME).format("s"))];
                //var aa = [parseInt((result[0].END_TIME).split("-")[0]), parseInt((result[0].END_TIME).split("-")[1]), parseInt((result[0].END_TIME).split("-")[2]), parseInt(moment(result[0].END_TIME).subtract('hours', 8).format("H")), parseInt(moment(result[0].END_TIME).format("m")), parseInt(moment(result[0].END_TIME).format("s"))];
                var bb = [parseInt(moment(nowDate).format("YYYY")), parseInt(moment(nowDate).format("M")), parseInt(moment(nowDate).format("D")), parseInt(moment(nowDate).format("H")), parseInt(moment(nowDate).format("m")), parseInt(moment(nowDate).format("s"))];
                //时间不到不能访问该页面所以如下
                //结束日期－当前日期＝倒计时时间
                //******  注意，查出来的时间需要－8小时  ******
                //console.log("###"+aa+"$$$"+bb);

                //console.log("#######"+parseInt((result[0].END_TIME).split("-")[2]));
                eTime = moment(aa);
                nTime = moment(bb);
                surplus_time = eTime.diff(nTime, 'seconds');

                //console.log(surplus_time+"秒");

                //设置倒计时－显示时间
                $.left_time_show(surplus_time);
            }else {
                //alertify.log("倒计时时间有问题！");
            }
        });


    }
});