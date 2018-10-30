
"use strict";
var oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder;

/**
 * 获得办事处指标汇总信息
 * @param handler
 * @param done
 * @param callback
 */

exports.getOfficeIndexList = function(handler, done, callback) {
    var params = handler.params
        , year = params.year
        , quarter_month = params.quarter_month;

        //console.log(year+"*******"+quarter_month);

    oracle.query( builder.select("getOfficeIndex"),[year,quarter_month], function(err, result) {

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
 * 获得办事处提交和审批状态表
 * @param handler
 * @param done
 * @param callback
 */
exports.getOfficeCheckStatusList = function(handler, done, callback) {
    var params = handler.params
        , year = params.year
        , quarter_month = "二季度";//params.quarter_month;

    console.log(year+"*******"+quarter_month);

    oracle.query( builder.select("getOfficeCheckStatus"),[year,quarter_month], function(err, result) {
        console.log("#####################" , result);

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
 * 员工信息查询
 * @param handler
 * @param done
 * @param callback
 */
exports.em_info_get = function (handler, done, callback){
    var params = handler.params;
    oracle.query(builder.select("info_get"),function (err, result){
        if (err || result === undefined)
        {
            done(err, result);
        }
        else
        {
            oracle.query(builder.select("office_list_get"),function (err2, result2){
                if (err || result === undefined)
                {
                    done(err2, {"o_list":result2,"data":result});
                }
                else
                {
                    done(err2, {"o_list":result2,"data":result});
                }
            });
        }
    });
}

/**
 * 区域奖金分配情况
 * @param handler
 * @param done
 * @param callback
 */
exports.bonus_by_area = function (handler, done, callback){
    //区域奖金分配情况
    var params = handler.params,
        area_id = params.area_id,
        select_id = params.select_id;
    var sql_p;
    var sql_arr = new Array();
    if (select_id == 0)
    {
        sql_p = "bonus_by_area";
        sql_arr = [area_id];
    }
    else
    {
        sql_p = "bonus_by_office";
        sql_arr = [select_id];
    }
    oracle.query(builder.select(sql_p),sql_arr,function (err, result){
        if (err)
        {
            done(err, {"result_type":false});
        }
        else
        {
            oracle.query(builder.select("office_list_by_area"),[area_id],function (err, result2){
                if (err)
                {
                    done(err, {"result_type":false});
                }
                else
                {
                   /* console.log(result);console.log(result2);*/
                    done(err, {"result_type":true,"data":result,"o_list":result2,"select_id":select_id});
                }
            });
        }
    });

}

/**
 * 修改员工信息
 * @param handler
 * @param done
 * @param callback
 */
exports.em_info_edit = function (handler, done, callback){
    var params = handler.params;
    oracle.update(builder.select("edit_info"),
        [

            params.CODE,
            params.ORGID,
            params.NAME,
            params.POSITION,
            params.ENTRY_TIME,
            params.POSITIVE_TIME,
            params.DEPARTURE_TIME,
            params.REMARKS,
            params.ID
        ],
        function (err, result){
        if (err)
        {
            done(err, {"result_type":false});
        }
        else
        {
            done(err, {"result_type":true});
        }
    });
}
/**
 * 删除员工信息
 * @param handler
 * @param done
 * @param callback
 */
exports.em_info_delete = function (handler, done, callback){
    var params = handler.params;
    oracle.query(builder.select("delete_info"), [params.id],function (err, result){
        if (err)
        {
            done(err, {"result_type":false});
        }
        else
        {
            done(err, {"result_type":true});
        }
    })
}
/**
 * 查询所有办事处提交状态
 * @param handler
 * @param done
 * @param callback
 */
exports.get_all_office_status = function (handler, done, callback){
    oracle.query(builder.select("get_office_organization"),[],function (err, result){
        if (err || result === undefined)
        {
            done(err, {"result_type": false});
        }
        else
        {
            oracle.query(builder.select("get_offcice_status"), [], function (err, _result){
                if (err || _result === undefined)
                {
                    done(err, {"result_type": false});
                }
                else {
                    done(err, {"result_type": true, "result1":result, "result2":_result});
                }
            });
        }
    });
}
/**
 * 查询办事处提交状态
 * @param handler
 * @param done
 * @param callback
 */
exports.office_submit_status_get = function (handler, done, callback){
    /*
     * 查询办事处的提交状态
     * */
    var params = handler.params,
        group_id = params.groupId;
    oracle.query(builder.select("office_submit_status"),[group_id],function (err, result){
        if (err || result === undefined)
        {
            done(err, {"result_type": false});
        }
        else
        {
            oracle.query(builder.select("office_submit_status_"), [group_id], function (err, _result){
                if (err || _result === undefined)
                {
                    done(err, {"result_type": false});
                }
                else {
                    done(err, {"result_type": true, "result1":result, "result2":_result});
                }
            });
        }
    });
};
/**
 * 提交区域副总审批数据
 * @param handler
 * @param done
 * @param callback
 */
exports.area_check_put = function (handler, done, callback){
    /*
     * 提交区域副总审批数据
     * 将数据插入员工奖金比例表中
     * 并修改办事处状态表中的check_status项
     * */
    var params = handler.params,
        req_data = params.req_data,
        u_na = params.u_na,
        orID = params.orID;
    var sql_param = new Array();
    for (var i = 0; i < req_data.length; i++)
    {

        sql_param[i] = [
            req_data[i].REMARKSPRO===undefined?"":req_data[i].REMARKSPRO,
            req_data[i].SUPERIORPRO===undefined?0:req_data[i].SUPERIORPRO,
            req_data[i].ID
        ];

    }
    oracle.updates(builder.select("area_change_bonus"),sql_param, function (err, result){
        if (err)
        {
            done(err, {"result": false});
        }
        else
        {
            oracle.update(builder.select("office_submit_status_change"), [u_na,orID], function (){
                if (err)
                {
                    done(err, {"result": false});
                }
                else
                {
                    done(err, {"result": true});
                }
            });
        }
    });
};
/**
 * 各办奖金分配上传数据
 * @param handler
 * @param done
 * @param callback
 */
exports.bonus_put = function (handler, done, callback){
    var params = handler.params,
        done_type = params.done_type,
        req_data = params.req_data;
//console.log(req_data);
    //旧表
    if (done_type == 1)
    {
        var sql_params = new Array();
        for (var i = 0; i < req_data.length; i++)
        {

            sql_params[i] = ['--',req_data[i].NAME,req_data[i].DEPTPERSONS,req_data[i].JX_FEN,req_data[i].SUM_FEN,
                req_data[i].TOTAL,req_data[i].PER_CAPITA,req_data[i].COMMERCE_NUMBER,req_data[i].COMMERCE_MONEY,
                req_data[i].PROBATION,req_data[i].POSITIVE,req_data[i].MONTHS_NUMBER,req_data[i].TRUE_TOTAL,req_data[i].SUBSTATUS];

        }
        oracle.inserts(builder.select("bonus_put"),sql_params, function (err, result){
            if (err)
            {
                done(err, {"result": false});
            }
            else
            {
                done(err, {"result": true});
            }
        });
    }
    else if (done_type == 0)
    {
        var sql_params = new Array();
        for (var i = 0; i < req_data.length; i++)
        {

            sql_params[i] = [req_data[i].COMMERCE_NUMBER,req_data[i].COMMERCE_MONEY,
                req_data[i].PROBATION,req_data[i].POSITIVE,req_data[i].MONTHS_NUMBER,
                req_data[i].TRUE_TOTAL,req_data[i].SUBSTATUS,req_data[i].ID];

        }
        oracle.updates(builder.select("bonus_put_other"), sql_params, function (err, result){
            if (err)
            {
                done(err, {"result": false});
            }
            else
            {
                done(err, {"result": true});
            }
        });
    }
    else
    {}

};
/**
 * 各版奖金分配获取基础数据
 * @param handler
 * @param done
 * @param callback
 */
exports.bonus_get = function(handler, done, callback){

    oracle.query( builder.select("bonus_get_new"), function(err, result) {
        if(result === undefined || result.length==0){
            oracle.query( builder.select("bonus_get"), function(err, result) {
                if(result === undefined){
                   /* console.log(err);*/
                    result = '';
                    done(err, result);
                }else{
                    var last_res = {
                        "data":result,
                        "type":1
                    };
                    done(err, last_res);
                }
            });
        }else{
            var last_res = {
                "data":result,
                "type":0
            };
            done(err, last_res);
        }
    });



};

/**
 * 获得办事处下面的所有员工10,不包括主管20
 * @param handler
 * @param done
 * @param callback
 */
exports.getOfficeEmployee = function(handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    oracle.query(builder.select("getOfficeEmployee"), [orgId], function(err, result) {

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }
    })

};

/**
 * 从 员工奖金比例表 里面 把数据查出来
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmployeeBonusInfo = function(handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    oracle.query(builder.select("getEmployeeBonusInfo"), [orgId], function(err, result) {
        console.log("***************");

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }
    })

};

/**
 * 判断该办事处是否提交过
 * @param handler
 * @param done
 * @param callback
 */
exports.getTrueHaveInfo = function(handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    console.log("****"+orgId);

    oracle.query(builder.select("getIsHaveInfo"), [orgId], function(err, result) {

        console.log("****###****result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        } else {
            console.log(result);
            done(err, result);
        }

    });
};

/**
 * 新插入数据 － 员工奖金比例表
 * ---当点击保存的时候
 * @param handler
 * @param done
 * @param callback
 */
exports.setEmployeeBonusDraft = function(handler, done, callback) {
    var params = handler.params;
    var jsonData = params.jsonData;
    var deptcode = params.deptcode;

    var dataJson = new Array();

    for(var i=0; i<jsonData.length; i++) {
        dataJson[i] = [jsonData[i].code,jsonData[i].name,jsonData[i].proportion,jsonData[i].remarks,deptcode,jsonData[i].sub_type];
    }

    oracle.inserts(builder.select("setEmployeeBonus"), dataJson, function(err, result) {

        if (err)
        {
            done(err, {"result": false});
        }
        else
        {
            done(err, {"result": true});
        }

    });
};

/**
 * 没有点击保存按钮，第一次点击提交
 * 新插入数据 － 员工奖金比例表
 * @param handler
 * @param done
 * @param callback
 */
exports.setEmployeeBonus = function(handler, done, callback) {
    var params = handler.params;
    var jsonData = params.jsonData;
    var deptcode = params.deptcode;
    var userCode = params.userCode;

    //console.log("############sub_type:"+sub_type);

    //step1.插入员工奖金比例表数据
    var insertEmployeeBonus = function(done) {
        var dataJson = new Array();

        for(var i=0; i<jsonData.length; i++) {
            dataJson[i] = [jsonData[i].code,jsonData[i].name,jsonData[i].proportion,jsonData[i].remarks,deptcode,jsonData[i].sub_type];
        }

        oracle.inserts(builder.select("setEmployeeBonus"), dataJson, function(err, result) {

            if (err)
            {
                done(err, {"result": false});
            }
            else
            {
                done(err, {"result": true});
            }

        });

    };

    //step2.插入办事处提交状态表
    var insertOfficeCheckStatus = function(result, done) {
        console.log("***********result",result);
        if(result.result === true) {
            oracle.query(builder.select("setOfficeCheckStatus"), [deptcode,userCode], function(err, result) {
                if (err)
                {
                    done(err, {"result": false});
                }
                else
                {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }

    };

    async.waterfall([insertEmployeeBonus, insertOfficeCheckStatus], done);
};

/**
 * 点过保存按钮，又点提交按钮
 * @param handler
 * @param done
 * @param callback
 */
exports.upInEmployeeBonus = function(handler, done, callback) {
    var params = handler.params;
    var updateData = params.updateData;
    var deptcode = params.deptcode;
    var userCode = params.userCode;

    //step1.更新员工奖金比例表
    var updateEmployeeBonus = function(done) {
        var dataJson = new Array();

        for(var i=0; i<updateData.length; i++) {
            dataJson[i] = [updateData[i].remarks,updateData[i].proportion,updateData[i].sub_type,updateData[i].id];
        }

        oracle.updates(builder.select("updateEmployeeBonus"), dataJson, function(err, result) {

            if (err)
            {
                done(err, {"result": false});
            }
            else
            {
                done(err, {"result": true});
            }

        });
    };

    //step2.插入办事处提交状态表
    var insertOfficeCheckStatus = function(result, done) {
        console.log("***********result",result);
        if(result.result === true) {
            oracle.query(builder.select("setOfficeCheckStatus"), [deptcode,userCode], function(err, result) {
                if (err)
                {
                    done(err, {"result": false});
                }
                else
                {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }

    };

    async.waterfall([updateEmployeeBonus, insertOfficeCheckStatus], done);

};

/**
 * 更新数据 － 员工奖金比例表
 * @param handler
 * @param done
 * @param callback
 */
exports.updateEmployeeBonus = function(handler, done, callback) {
    var params = handler.params;
    var updateData = params.updateData;

    console.log("#############");

    var dataJson = new Array();

    for(var i=0; i<updateData.length; i++) {
        dataJson[i] = [updateData[i].remarks,updateData[i].proportion,updateData[i].sub_type,updateData[i].id];
    }

    oracle.updates(builder.select("updateEmployeeBonus"), dataJson, function(err, result) {

        if (err)
        {
            done(err, {"result": false});
        }
        else
        {
            done(err, {"result": true});
        }

    });

};

/**
 * 获得时间控制得几项
 * @param handler
 * @param done
 * @param result
 */
exports.getTimeValues = function(handler, done, result) {
    var params = handler.params;
    var years = params.year;
    var quarter = params.quarter;

    if(quarter === '1') {
        quarter = "一季度";
    }
    if(quarter === '2') {
        quarter = "二季度";
    }
    if(quarter === '3') {
        quarter = "三季度";
    }
    if(quarter === '4') {
        quarter = "四季度";
    }

    oracle.query(builder.select("getTimeValues"), [years,quarter], function(err, result) {
        console.log("result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

/**
 * 更新是将控制表的数据
 * @param handler
 * @param done
 * @param result
 */
exports.updateTimeValues = function(handler, done, result) {
    var params = handler.params;
    var updateData = params.updateData;

    var paramsValues = new Array();
    for (var i = 0; i < updateData.length; i++)
    {
        if(updateData[i].cre_time == undefined) {
            updateData[i].cre_time = '';
        }
        if(updateData[i].end_time == undefined) {
            updateData[i].end_time = '';
        }
        if(updateData[i].remarks == undefined) {
            updateData[i].remarks = '';
        }
        paramsValues[i] = [updateData[i].cre_time,updateData[i].end_time,updateData[i].remarks,updateData[i].years,updateData[i].quarter,updateData[i].id];
    }
    console.log("******" ,paramsValues);
    oracle.updates(builder.select("updateTimeValues"), paramsValues, function(err, result) {

        if (err)
        {
            done(err, {"result": false});
        }
        else
        {
            done(err, {"result": true});
        }

    });
};

/**
 * 第一次访问，应该从码表中把数据查出来
 * @param handler
 * @param done
 * @param callback
 */
exports.getTimeTerm = function(handler, done, callback) {
    var params = handler.params;
    oracle.query(builder.select("getTimeTerm"), [], function(err, result) {

        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            console.log("******",result);
            done(err,result);
        }

    });
};

/**
 * 第一次进入时间设置，需要新插入，并且将状态表里面的是否可以操作的那个字段改成10
 * @param handler
 * @param done
 * @param callback
 */
exports.insertTimeValues = function(handler, done, callback) {
    var params = handler.params;
    var insertData = params.insertData;

    //step1.新插入时间控制数据
    var insertControlTime = function(done) {
        var paramsValues = new Array();
        for (var i = 0; i < insertData.length; i++)
        {
            if(insertData[i].cre_time == undefined) {
                insertData[i].cre_time = '';
            }
            if(insertData[i].end_time == undefined) {
                insertData[i].end_time = '';
            }
            if(insertData[i].remarks == undefined) {
                insertData[i].remarks = '';
            }
            if( i === 0) {
                insertData[i].cre_time = moment().format("YYYY-MM-DD hh:mm");
            }
            paramsValues[i] = [insertData[i].years,insertData[i].quarter,insertData[i].description,insertData[i].cre_time,insertData[i].end_time,insertData[i].remarks];
        }
        console.log("******" ,paramsValues);
        oracle.inserts(builder.select("insertTimeValues"), paramsValues, function(err, result) {

            if (err)
            {
                done(err, {"result": false});
            }
            else
            {
                console.log("$$$$$$$$$$");
                done(err, {"result": true});
            }

        });
    };

    //step2.将状态表里面的是否可以操作的那个字段改成10
    var updateTimeStatus = function(result, done) {
        if(result.result === true) {
            oracle.query(builder.select("updateTimeStauts"), [insertData[0].years,insertData[0].quarter], function(err, result) {
                if (err)
                {
                    done(err, {"result": false});
                }
                else
                {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }

    };

    async.waterfall([insertControlTime, updateTimeStatus], done);


};

/**
 *结束绩效考核操作
 * 需要更改时间状态表的一条数据currentstatus＝20，operationStatus＝20
 * 同时新插入一条默认currentstatus＝10，operationStatus＝20
 * @param handler
 * @param done
 * @param callback
 */
exports.endPerformance = function(handler, done, callback) {
    var params = handler.params;
    var years = params.years;
    var quarter = params.quarter;

    var newYears = params.years;
    var newQuarter;

    if(quarter === "一季度") {
        newQuarter = "二季度";
    }
    if(quarter === "二季度") {
        newQuarter = "三季度";
    }
    if(quarter === "三季度") {
        newQuarter = "四季度";
    }
    if(quarter === "四季度") {
        newYears = parseInt(newYears) + 1;
        newQuarter = "一季度";
    }

    console.log("years:"+newYears+"quarter:"+newQuarter);

    //step1.更新
    var updateTimeStatus = function(done) {
        oracle.query(builder.select("updateTimeStautsEnd"), [years, quarter], function(err, result) {
            if (err) {
                done(err, {"result": false});
            }else {
                done(err, {"result": true});
            }
        });
    };

    //step2.插入
    var insertTimeStatus = function(result, done) {
        if(result.result === true) {
            oracle.query(builder.select("insertTimeStautsStart"), [newYears, newQuarter], function(err, result) {
                if (err) {
                    done(err, {"result": false});
                } else {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }

    };

    async.waterfall([updateTimeStatus, insertTimeStatus], done);

};

exports.getQuarter = function(handler,done, callback) {
    var params = handler.params;
    oracle.query( builder.select("getQuarter"), [],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
        }
        done(err,result);
    });
};

exports.judgeBonus = function(handler,done, callback) {
    var params = handler.params;
    oracle.query( builder.select("getAllBonus"), [],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
        }
        done(err,result);
    });
};

exports.getAllBonus = function(handler,done, callback) {
    var params = handler.params,
        quarter = params.quarter;
    if(quarter==="一季度"){
        oracle.query( builder.select("getAllBonusTb"), [],function(err, result) {
            if(result.length===0){
                oracle.query( builder.select("getAllBonus"), [],function(err, result) {
                    if(result === undefined){
                        console.log(err)
                        result = '';
                    }
                    done(err,result);
                });
            }else{
                oracle.query( builder.select("getAllBonusTb"), [],function(err, result) {
                    if (result === undefined) {
                        console.log(err)
                        result = '';
                    }
                    done(err,result);
                });
            }
        });
    }else {
        if (quarter === "二季度") {
            quarter = "一季度";
        } else if (quarter === "三季度") {
            quarter = "二季度";
        } else if (quarter === "四季度") {
            quarter = "三季度";
        }
        oracle.query( builder.select("getAllBonusTb"), [],function(err, result) {
            if(result.length===0){
                oracle.query( builder.select("getAllBonusHb"), [quarter],function(err, result) {
                    if(result.length===0){

                        oracle.query( builder.select("getAllBonus"), [],function(err, result) {
                            if(result === undefined){
                                console.log(err)
                                result = '';
                            }
                            done(err,result);
                        });
                    }else{
                        if(result === undefined){
                            console.log(err)
                            result = '';
                        }
                        done(err,result);
                    }
                });
            }else{
                oracle.query( builder.select("getAllBonusHb"), [quarter],function(err, result) {
                    if(result.length===0){
                        oracle.query( builder.select("getAllBonusTb"), [],function(err, result) {
                            if (result === undefined) {
                                console.log(err)
                                result = '';
                            }
                            done(err,result);
                        });
                    }else{
                        oracle.query( builder.select("getAllBonusTH"), [quarter],function(err, result) {
                            if(result === undefined){
                                console.log(err)
                                result = '';
                            }
                            done(err,result);
                        });
                    }
                });
            }
        });
    }
};

exports.getNoBonus = function(handler,done, callback) {
    var params = handler.params;
    oracle.query( builder.select("getNoBonus"), [],function(err, result) {
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

exports.setAllBonus = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var id,award;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        id = array[i].id;
        award = array[i].award;
        oracle.query( builder.select("setAllBonus"), [award,id],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
};

exports.setNoBonus = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var id,name,award;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        id = array[i].id;
        name = array[i].name;
        award = array[i].award;
        oracle.query( builder.select("setNoBonus"), [id,name,award],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
};

exports.subAllBonus = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var id,award;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        id = array[i].id;
        award = array[i].award;
        oracle.query( builder.select("subAllBonus"), [award,id],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
};

exports.subNoBonus = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var id,name,award;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        id = array[i].id;
        name = array[i].name;
        award = array[i].award;
        oracle.query( builder.select("subNoBonus"), [id,name,award],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
};

/**
 * 主管奖金系数设置
 * @param handler
 * @param err
 * @param result
 */
exports.getOfficeSet = function(handler, done, result) {
    var params = handler.params;

    oracle.query(builder.select("getOfficeSet"), [], function(err, result) {
        console.log("result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

//////////////////////////////////////////////////////////关系维护界面

exports.setOfficeRelation = function(handler, done, result) {
    var params = handler.params
        ,array = params.array;
    var responId,officeId;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        officeId = array[i].officeId;
        responId = array[i].responId;
        console.log("office"+officeId+"respon"+responId);
        oracle.query( builder.select("setOfficeRelation"), [responId,officeId],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.getOfficeRelation = function(handler, done, result) {
    var params = handler.params
        ,areaId = params.areaId
        ,responId = params.responId;

    oracle.query(builder.select("getOfficeRelation"), [areaId,responId], function(err, result) {
        //console.log("result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getResponRelation = function(handler, done, result) {
    var params = handler.params
        ,areaId = params.areaId;

    oracle.query(builder.select("getResponRelation"), [areaId], function(err, result) {

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getAreaRelation = function(handler, done, result) {
    var params = handler.params
        ,companyId = params.companyId;

    oracle.query(builder.select("getAreaRelation"), [companyId], function(err, result) {
        //console.log("result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getCompanyRelation = function(handler, done, result) {
    var params = handler.params;

    oracle.query(builder.select("getCompanyRelation"), [], function(err, result) {
        //console.log("result:",result);

        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

/**
 * 获得各模块－倒计时－的时间
 * 用各板块的名称来检索
 * @param handler
 * @param done
 * @param result
 */
exports.getTime = function(handler, done, result) {
    var params = handler.params;
    var name = params.name;
    oracle.query(builder.select("getTime"), [name], function(err, result) {

        console.log("#######",result);
        if (result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });

};

/**
 * 获得部门、组/办、员工名称码表
 * @param handler
 * @param callback
 */
exports.getSearchTable = function(handler, callback) {
    var params = handler.params;

    //部门数据
    var getDeptTable = function(done) {
        oracle.query(builder.select("getDeptTable"), [], function(err, result) {

            if (result === undefined) {
                console.log(err);
                result = '';
                done(err, result);
            }else {
                done(err, result);
            }

        });
    };
    //组/办数据
    var getOfficeTable = function(done) {
        oracle.query(builder.select("getOfficeTable"), [], function(err, result) {

            if (result === undefined) {
                console.log(err);
                result = '';
                done(err, result);
            }else {
                done(err, result);
            }

        });
    };
    //员工数据
    var getEmpTable = function(done) {
        oracle.query(builder.select("getEmpTable"), [], function(err, result) {

            if (result === undefined) {
                console.log(err);
                result = '';
                //data.emp = result;
                done(err, result);
            }else {
                //data.emp = result;
                done(err, result);
            }

        });
    };
    async.parallel([getDeptTable,getOfficeTable,getEmpTable], callback);
};

/**
 *  主管申报给区域副总发一个消息
 * @param handler
 * @param done
 * @param callback
 */
exports.setMessageForArea = function(handler, done, callback) {
    var params = handler.params;
    var userOrgId = params.userOrgId;
    var content = params.content;

    oracle.query(builder.select("setMessageForArea"), [content, userOrgId], function(err,result){
        if (err) {
            done(err, {"result": false});
        }else {
            done(err, {"result": true});
        }
    });
};
exports.set_message = function (handler, done, callback){
    var params = handler.params,
        msg_type = params.msg_type,
        content = params.content,
        pid = params.pid;
    var sql_url = "";
    var ora_par = [];
    switch (msg_type)
    {
        case 'zg_qy':{
            ora_par = [[content,pid]];
            oracle.inserts(builder.select(msg_type),ora_par,function (err, result){console.log("aaaaaFF",result)
                if (err) {
                    done(err, {"result": false});
                }else {
                    done(err, {"result": true});
                }
            });
        }break;
        case 'qy_zg':{}break;
        case 'sw_qy':{
            msg_type = 'gs_rs';
            var groups = "55bb087cb221243415d86eb9";//向all区域send
            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
        }break;
        case 'qy_sw':
        case 'qy_xg':{
            msg_type = 'gs_rs';
            var groups = {"$in":["55f12ef89917f98a100e5075","55f12f034c7982d672a6e02d"]};/*1箱管*//*2商务*///向all箱管和商务发送消息
            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
        }break;
        case 'xg_qy':{
            msg_type = 'gs_rs';
            var groups = "55bb087cb221243415d86eb9";//向all区域send
            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
        }break;
        case 'gs_rs':{
            msg_type = 'gs_rs';
            var groups = "55bb082e983be6a0090a3cc0";//向all人事send
            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
        }break;
        default:{console.log("message_send_failed",result)
            done(err, {"result": false});
            return ;
        }break;
    }

};
function send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content){
    var log = light.framework.log;
    var user = light.model.user;
    log.debug("begin: getRenShi user", pid);
    var user_group = [];
    handler.addParams("condition", {"groups": groups});//收信组的ID

    user.getList(handler, function(err, result1) {

        if (err) {
            log.error(err, pid);
            done(err, {"result": false});
        }
console.log(result1,"************************users");
        log.debug("finish: getRenShi user", pid);

        if (content == "人数已审批完毕")
        {
            for (var i = 0; i < result1.items.length; i++)
            {
                ora_par.push([
                        result1.items[i].groups=="55f12ef89917f98a100e5075"?("箱管"+content):("商务"+content),
                        result1.items[i].id
                ]);
            }
        }
        else
        {
            for (var i = 0; i < result1.items.length; i++)
            {
                ora_par.push([content,result1.items[i].id]);
            }
        }

console.log(ora_par,"************************ora_par");
        oracle.inserts(builder.select(msg_type),ora_par,function (err, result){
            if (err) {
                done(err, {"result": false});
            }else {
                done(err, {"result": true});
            }
        });
    });
};
/**
 *获得当前用户的一些通知信息
 * @param handler
 * @param done
 * @param callback
 */
exports.getNotifyInfo = function(handler, done, callback) {
    var params = handler.params;
    var userCode = params.userCode,
        read_type = params.read_type;

    if (read_type == 'false')
    {
        //通过code获得消息
        oracle.query(builder.select("getEmpMsg"), [userCode], function(err,result) {
            if (err)
            {
                done(err, {"result_type":false});
            }
            else
            {
                done(err, {"get_data":result,"result_type":true});
            }

        });
    }
    else
    {
        //通过code获得消息
        oracle.query(builder.select("getEmpMsgOld"), [userCode], function(err,result) {

            if (err)
            {
                done(err, {"result_type":false});
            }
            else
            {
                done(err, {"get_data":result,"result_type":true});
            }

        });
    }



};

/**
 *修改消息状态，将状态位N改为Y
 * @param handler
 * @param done
 * @param callback
 */
exports.msg_change_status = function (handler, done, callback) {
    var params = handler.params,
        c_id = params.c_id;
    //修改消息状态
    oracle.query(builder.select("msg_change_status"), [c_id], function(err,result) {

        if (err)
        {
            done(err, {"result_type":false});
        }
        else
        {
            done(err, {"result_type":true});
        }

    });
};
/**
 *获得区域奖金
 * @param handler
 * @param done
 * @param callback
 */
exports.get_area_bonus = function (handler, done, callback){
    oracle.query(builder.select("getAllBonus"), function(err,result) {

        if (err)
        {
            done(err, {"result_type":false});
        }
        else
        {
            done(err, {"result_type":true,"result_data":result});
        }

    });
}

exports.judgeBusiness = function(handler, done, result) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;
    oracle.query(builder.select("getAllBusiness"), [year,quarter], function(err, result) {

        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getNoBusiness = function(handler, done, result) {
    var params = handler.params;
    oracle.query(builder.select("getNoBusiness"), [], function(err, result) {

        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getAllBusiness = function(handler, done, result) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;

    oracle.query(builder.select("getAllBusiness"), [year,quarter], function(err, result) {
        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.setNoBusiness = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;

    var year,quarter,orgid,personnum;
    var dataResult;

    for (var i=0; i<array.length; i++) {
        year = array[i].year;
        quarter = array[i].quarter;
        orgid = array[i].orgid;
        personnum = array[i].personnum;
        oracle.query( builder.select("setNoBusiness"), [year,quarter,orgid,personnum],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.setAllBusiness = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var personnum,businessId;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        personnum = array[i].personnum;
        businessId = array[i].businessId;
        oracle.query( builder.select("setAllBusiness"), [personnum,businessId],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.subNoBusiness = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;

    var year,quarter,orgid,personnum;
    var dataResult;

    for (var i=0; i<array.length; i++) {
        year = array[i].year;
        quarter = array[i].quarter;
        orgid = array[i].orgid;
        personnum = array[i].personnum;
        oracle.query( builder.select("subNoBusiness"), [year,quarter,orgid,personnum],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.subAllBusiness = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var personnum,businessId;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        personnum = array[i].personnum;
        businessId = array[i].businessId;
        oracle.query( builder.select("subAllBusiness"), [personnum,businessId],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.judgeTube = function(handler, done, result) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;
    oracle.query(builder.select("getAllTube"), [year,quarter], function(err, result) {

        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getNoTube = function(handler, done, result) {
    var params = handler.params;
    oracle.query(builder.select("getNoTube"), [], function(err, result) {

        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.getAllTube = function(handler, done, result) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;

    oracle.query(builder.select("getAllTube"), [year,quarter], function(err, result) {
        if (result === undefined) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

exports.setNoTube = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;

    var year,quarter,orgid,personnum;
    var dataResult;

    for (var i=0; i<array.length; i++) {
        year = array[i].year;
        quarter = array[i].quarter;
        orgid = array[i].orgid;
        personnum = array[i].personnum;
        oracle.query( builder.select("setNoTube"), [year,quarter,orgid,personnum],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.setAllTube = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var personnum,tubeId;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        personnum = array[i].personnum;
        tubeId = array[i].tubeId;
        oracle.query( builder.select("setAllTube"), [personnum,tubeId],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.subNoTube = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;

    var year,quarter,orgid,personnum;
    var dataResult;

    for (var i=0; i<array.length; i++) {
        year = array[i].year;
        quarter = array[i].quarter;
        orgid = array[i].orgid;
        personnum = array[i].personnum;
        oracle.query( builder.select("subNoTube"), [year,quarter,orgid,personnum],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

exports.subAllTube = function(handler,done, callback) {
    var params = handler.params
        ,array = params.array;
    var personnum,tubeId;
    var dataResult;
    for (var i=0; i<array.length; i++) {
        personnum = array[i].personnum;
        tubeId = array[i].tubeId;
        oracle.query( builder.select("subAllTube"), [personnum,tubeId],function(err, result) {
            if(result === undefined){
                console.log(err)
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);

};

/**
 *绩效分析统计
 * @param handler
 * @param done
 * @param callback
 */
exports.get_jxfxtj = function (handler, done, callback){
    var params = handler.params,
        query_type = params.query_type;


    oracle.query(builder.select("get_now_year"), function (err, result1){
        if (err || result1 == undefined)
        {
            done(err, result1);
        }
        else
        {
            var sql_url = "";
            var now_y=result1[0].YEARS,now_q=result1[0].QUARTER,
                tb_y=result1[0].YEARS,tb_q=result1[0].QUARTER,
                hb_y=result1[0].YEARS,hb_q=result1[0].QUARTER;
            var par = [];
            switch (query_type)
            {
                case '1':{
                    sql_url = "jxfxtj_1";
                }break;
                case '2':{
                    sql_url = "jxfxtj_2";
                }break;
                case '3':{
                    sql_url = "jxfxtj_3";
                }break;
                default:{
                    sql_url = "jxfxtj_4";
                }break;
            }

            if (query_type == '3'||query_type == '4'){
                tb_y = now_y-1;tb_q = now_q;
                switch (now_q)
                {
                    case '一季度':{
                        hb_y=now_y-1;
                        hb_q="四季度";
                    }break;
                    case '二季度':{
                        hb_y=now_y;
                        hb_q="一季度";
                    }break;
                    case '三季度':{
                        hb_y=now_y;
                        hb_q="二季度";
                    }break;
                    default:{
                        hb_y=now_y;
                        hb_q="三季度";
                    }break;
                }
                par = [tb_y,tb_q,hb_y,hb_q];
            }
            oracle.query(builder.select(sql_url), par, function (err, result){
                if (err || result == undefined)
                {
                    done(err, result);
                }
                else
                {
                    done(err, {"data":result});
                }
            });

        }
    });
}

exports.getUserIdByCode = function(handler,done, callback) {
    var params = handler.params
        ,userCode = params.userCode;
    oracle.query( builder.select("getUserIdByCode"), [userCode],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
};

exports.getAllPersonNum = function(handler,done, callback) {
    var params = handler.params
        ,responsibleId = params.responsibleId;
    oracle.query( builder.select("getAllPersonNum"), [responsibleId],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });

};

exports.setPersonNum = function(handler, callback) {
    var params = handler.params
        ,array = params.array;
    var setBusinessPersonNum = function(done) {
        for (var i=0; i<array.length; i++) {
            var businessNum = array[i].businessNum;
            var officeId = array[i].officeId;
            console.log("businessNum",businessNum,"officeId",officeId);
            oracle.query(builder.select("setBusinessPersonNum"), [businessNum,officeId], function(err, result) {
                console.log("result",result);
                if (result === undefined) {
                    console.log(err);
                    result = '';
                    done(err, result);
                }else {
                    done(err, result);
                }

            });
        }
    };
    var setTubePersonNum = function(done) {
        for (var i=0; i<array.length; i++) {
            var tubeNum = array[i].tubeNum;
            var officeId = array[i].officeId;
            console.log("tubeNum",tubeNum,"officeId",officeId);
            oracle.query(builder.select("setTubePersonNum"), [tubeNum,officeId], function(err, result) {
                if (result === undefined) {
                    console.log(err);
                    result = '';
                    done(err, result);
                }else {
                    done(err, result);
                }

            });
        }
    };
    async.parallel([setBusinessPersonNum,setTubePersonNum], callback);
};

exports.subPersonNum = function(handler, callback) {
    var params = handler.params
        ,array = params.array;
    var subBusinessPersonNum = function(done) {
        for (var i=0; i<array.length; i++) {
            var businessNum = array[i].businessNum;
            var officeId = array[i].officeId;
            var userName = array[i].userName;
            oracle.query(builder.select("subBusinessPersonNum"), [businessNum,userName,officeId], function(err, result) {
                if (result === undefined) {
                    console.log(err);
                    result = '';
                    done(err, result);
                }else {
                    done(err, result);
                }

            });
        }
    };
    var subTubePersonNum = function(done) {
        for (var i=0; i<array.length; i++) {
            var tubeNum = array[i].tubeNum;
            var officeId = array[i].officeId;
            var userName = array[i].userName;
            console.log("tubeNum",tubeNum,"officeId",officeId,'userName',userName);
            oracle.query(builder.select("subTubePersonNum"), [tubeNum,userName,officeId], function(err, result) {
                if (result === undefined) {
                    console.log(err);
                    result = '';
                    done(err, result);
                }else {
                    done(err, result);
                }

            });
        }
    };
    async.parallel([subBusinessPersonNum,subTubePersonNum], callback);
};


exports.getPersonNum = function(handler,done, callback) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;
    oracle.query( builder.select("getPersonNum"), [year,quarter,year,quarter],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
};

exports.get_office_bonus = function(handler,done, callback) {
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter
        ,companyId = params.companyId;
    oracle.query( builder.select("get_office_bonus"), [companyId,year,quarter],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
};