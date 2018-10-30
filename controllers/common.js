/**
 * Created by root on 15-1-4.
 */
"use strict";
var oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder

exports.getCurrYearMonth = function(handler,done, callback) {

    oracle.query( builder.select("getCurrYearMonth"), function(err, result) {
    //console.log("====================================================")
        if(result === undefined){
           // console.log("server error" + err)
            result = '';
            done(err,result);
        }else{
            //console.log("2222222222" ,result )
            done(err,result);
        }

    });

};