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

    $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2F%5B7efc%5D%5B5408%5D%5B7edf%5D%5B8ba1%5D.cpt");

    $("#tmpHidReport").remove();
  };

});