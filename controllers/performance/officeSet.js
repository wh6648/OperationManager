/**
 * Created by chao on 15/8/25.
 */

"use strict";
var oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder;

/**
 * 获得各办事处主管系数信息
 * @param handler
 * @param done
 * @param callback
 */

exports.getOfficeSet = function(handler, done, callback) {
    var params = handler.params
        , year = params.year
        , quarter_month = params.quarter_month;

    oracle.query( builder.select("getOfficeSet"),[year,quarter_month], function(err, result) {

        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }

    });
};

exports.getOfficeSetState = function(handler, done, callback) {
    var params = handler.params
        , year = params.year
        , quarter_month = params.quarter_month;

    oracle.query( builder.select("getOfficeSetState"),[year,quarter_month], function(err, result) {

        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }

    });
};

exports.saveOfficeSet = function(handler, done, callback) {

    var params = handler.params
        ,array = params.array;
    var COEFFICIENT,
        COEFFICIENT_REMARKS,
        year,
        quarter_month,
        MANAGER_ID,
        dataResult;

    var sql_params = new Array();
    for (var i = 0; i < array.length; i++)
    {
        sql_params[i] = [
            array[i].COEFFICIENT,
            array[i].COEFFICIENT_REMARKS,
            array[i].year,
            array[i].quarter_month,
            array[i].MANAGER_ID
        ];
    }
    oracle.updates( builder.select("saveOfficeSet"), sql_params,function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
        }
        dataResult = result;
    });
    done(dataResult);
};

exports.setOfficeSetState = function(handler, done, callback) {

    var params = handler.params
        , year = params.year
        , quarter_month = params.quarter_month
        ,dataResult;
    oracle.query( builder.select("setOfficeSetState"), [year,quarter_month],function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
        }
        dataResult = result;

    });
    done(dataResult);
};