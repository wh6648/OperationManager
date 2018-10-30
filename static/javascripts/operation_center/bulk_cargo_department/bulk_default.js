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

    $("#reportFrame").attr("src","http://115.28.50.129:8075/WebReport/ReportServer?reportlet=rpt%2FBULKGOODS.cpt&YEAR_XN=&year_XN=&YEAR_QN=&year_QN=");

    $("#tmpHidReport").remove();
  };

});