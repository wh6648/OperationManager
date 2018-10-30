/**
 * Created by wights on 15-8-13.
 */
(function ($){
    $.extend(
        {
            "left_time_show": function (left_t){
                intDiff = parseInt(left_t);//倒计时总秒数量
                window.setInterval(function(){
                    var day=0,
                        hour=0,
                        minute=0,
                        second=0;//时间默认值
                    if(intDiff > 0){
                        day = Math.floor(intDiff / (60 * 60 * 24));
                        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    }
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    $('#day_show').html(day+"天");
                    $('#hour_show').html('<s id="h"></s>'+hour+'时');
                    $('#minute_show').html('<s></s>'+minute+'分');
                    $('#second_show').html('<s></s>'+second+'秒');
                    intDiff--;
                }, 1000);
            }
        }
    );
})(jQuery);