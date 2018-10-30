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

        var report_frame = $("#report_frame").html(""),
            tmplList_reportFrame = $("#tmplList_reportFrame").html();

        report_frame.append(_.template(tmplList_reportFrame));

    };

});