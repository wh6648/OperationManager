
"use strict";
var oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder


//exports.getDepartmentList = function(handler,done, callback) {
//
//    oracle.query( builder.select("getDepartmentList"), function(err, result) {
//
//        if(result === undefined){
//            console.log(err)
//            result = '';
//            done(err,result);
//        }else{
//            //console.log("2222222222" ,result )
//            done(err,result);
//        }
//
//    });
//
//};
exports.getAllDepartment = function(handler,done, callback) {

    var params = handler.params
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("getAllDepartment"), [year,month],function(err, result) {

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};
exports.getAllDepartmentForQuarter = function(handler,done, callback) {

    var params = handler.params
        , year = params.year
        , firstMonth = params.month;

    oracle.query( builder.select("getAllDepartmentForQuarter"), [year,firstMonth],function(err, result) {

        //console.log("%%%%%%%%%%" ,result);

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};

exports.departmentReportForMonth = function(handler,done, callback) {

    var params = handler.params
        , departmentCode = params.departmentCode
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("departmentReportForMonth"),[departmentCode,year,month], function(err, result) {

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
           // console.log("2222222222" ,result )
            done(err,result);
        }

    });

};

/**
 * 获得所有区域信息
 * @param handler
 * @param done
 * @param callback
 */
exports.getAllAreaReport = function(handler,done, callback) {

    var params = handler.params
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("getAllAreaReport"),[year,month], function(err, result) {

        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }

    });

};

/**
 * 获得所有区域下的办事处信息
 * @param handler
 * @param done
 * @param callback
 */
exports.getAllAreaChildReport = function(handler,done, callback) {

  var params = handler.params
    , reportCode = params.reportCode

  oracle.query( builder.select("getAllAreaChildReport"),[reportCode], function(err, result) {

    if(result === undefined){
      console.log(err);
      result = '';
      done(err,result);
    }else{
      done(err,result);
    }

  });

};

exports.departmentReportForQuarter = function(handler,done, callback) {

    var params = handler.params
        , departmentCode = params.departmentCode
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("departmentReportForQuarter"),[departmentCode,year,month], function(err, result) {

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};

exports.test = function(handler,done, callback) {

    //console.log("1231232132")
    var data =
    {
        "userdata" : {"Freight": "2622.99"},
        "rows":[
            {"OrderID":"10643","OrderDate":"1997-08-25 00:00:00","CustomerID":"ALFKI","Freight":"29.4600","ShipName":"Alfreds Futterkiste"},
            {"OrderID":"10692","OrderDate":"1997-10-03 00:00:00","CustomerID":"ALFKI","Freight":"61.0200","ShipName":"Alfreds Futterkiste"}

        ]
    }

    done(null,data);

};

exports.areaReportForMonth = function(handler,done, callback) {

    var params = handler.params
        , indexArea = params.indexArea
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("areaReportForMonth"),[indexArea,year,month], function(err, result) {

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};

exports.areaReportForQuarter = function(handler,done, callback) {

    var params = handler.params
        , indexArea = params.indexArea
        , year = params.year
        , month = params.month;

    oracle.query( builder.select("areaReportForQuarter"),[indexArea,year,month], function(err, result) {

        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            //console.log("areaReportForQuarter" ,result )
            done(err,result);
        }

    });

};

exports.getCompanyQuotaMonthReport = function(handler,done, callback) {

    //var params = handler.params
    //    , type = params.type
    //    , year = params.year
    //    , month = params.month;
    //
    ////oracle.query("SELECT 1 as ID from dual", function (err, result) {
    ////console.log("year="+year+"month="+month)
    //oracle.query( builder.select("getCompanyQuotaMonthReport"), [year,month],function(err, result) {
    //    //console.log("##################");
    //
    //    if(result === undefined){
    //        //console.log("error" )
    //        result = '';
    //        done(err,result);
    //    }else{
    //        //console.log("2222222222" ,result )
    //        done(err,result);
    //    }
    //
    //});

    var params = handler.params
        , p_monthQuarter = params.p_monthQuarter
        , p_type = params.p_type
        , p_year = params.p_year
        , p_month = params.p_month

    //console.log(params)

    oracle.query("CALL BOSS_IDX_GET_QUOTAREPORT(:1,:2,:3,:4,:5)",[p_monthQuarter,p_type,p_year,p_month,oracle.params(4)],function(err, result) {

        //console.log("******" ,result);
            if(result === undefined){
                //console.log("error" );
                result = '';
                done(err,result);
            }else{
                //console.log("2222222222" ,result );
                done(err,result);
            }
    })






};

exports.getCompanyQuotaQuarterReport = function(handler,done, callback) {

    var params = handler.params
        , type = params.type
        , year = params.year
        , month = params.month;

    //oracle.query("SELECT 1 as ID from dual", function (err, result) {
    //console.log("year="+year+"month="+month)
    oracle.query( builder.select("getCompanyQuotaQuarterReport"), [year,month],function(err, result) {
        //console.log("##################");

        if(result === undefined){
            //console.log("error" )
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};