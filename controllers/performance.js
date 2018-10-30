
"use strict";
var user         = light.model.user
    ,oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder;

/************* 公共方法 ****************************************************/
//获得当前操作时间的  ID，YEARS，QUARTER
exports.getNowTimeAction = function (handler, done, callback){
    oracle.query( builder.select("getNowTime"), [],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
        }
        done(err,result);
    });
}

//根据row_sort获得该操作开始结束时间
exports.getOperationTimeByRow_sortAction = function (handler, done, callback){
    var params = handler.params,
        row_sort = params.row_sort;
    oracle.query( builder.select("getOperationTimeByRow_sort"), [row_sort],function(err, result) {
        if(result === undefined){
            console.log(err)
            result = '';
        }
        done(err,result);
    });
}

/**
 * 获得各模块－倒计时－的时间
 * 用各板块的名称来检索
 * @param handler
 * @param done
 * @param result
 */
exports.getTimeAction = function(handler, done, result) {
    var params = handler.params;
    var name = params.name;
    oracle.query(builder.select("getCountDownTime"), [name], function(err, result) {

        if (err || result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });

};

/**
 *  主管申报给区域副总发一个消息
 * @param handler
 * @param done
 * @param callback
 */
exports.setMessageForAreaAction = function(handler, done, callback) {
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

//公司给人事发消息
exports.setMessageAction = function (handler, done, callback){
    var user = light.model.user;
    var params = handler.params,
        msg_type = params.msg_type,
        content = params.content,
        pid = params.pid;

    var array = new Array();

    var getReceiveCode = function (done) {
        //去mongodb数据库中找到所有属于  人事组  的人的code
        var groups = '55bb082e983be6a0090a3cc0';    //人事组在mongodb数据的id 是  55bb082e983be6a0090a3cc0
        handler.addParams("condition", {"groups": groups,"valid": 1});//收信组的ID
        user.getList(handler, function(err, result) {
            if(err) {
                done(err, {"result": false});
            }
            for(var i = 0; i < result.totalItems; i++) {
                array[i] = [content,result.items[i].id];
            }
            done(err, {"result": true});
        });

    };

    var insertMessage = function (result, done) {
        if (result.result === true) {
            //插入消息到数据库
            oracle.inserts(builder.select("gs_rs"),array,function (err, result){
                if (err) {
                    done(err, {"result": false});
                }else {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }
    };

    async.waterfall([getReceiveCode, insertMessage], done);

};

//区域给办事处主管发消息
exports.setMessageForManagerAction = function (handler, done, callback) {
    var params = handler.params
        ,orgId = params.orgId
        ,content = params.content;
    var sendCode = new Array();

    //通过这个办事处的id去mongodb里面查，group是办事处主任组，并且 orgid ＝ 这个办事处的id的code
    var searchMongodbForCode = function (done) {
        var user = light.model.user;
        var groups = '549ccf60e736bdc50962a7d8';    //办事处主任组在mongodb数据的id 是  549ccf60e736bdc50962a7d8
        handler.addParams("condition", {"groups": groups,"extend.orgid": orgId,"valid": 1});

        user.getList(handler, function(err, result) {
            if(err) {
                done(err, {"result": false});
            }else {
                for(var i = 0; i < result.totalItems; i++) {
                    sendCode[i] = [content, result.items[i].id];
                }
                done(err, {"result": true});
            }
        });
    };
    var insertMessageForMananger = function (result, done) {
        if (result.result === true) {
            oracle.inserts(builder.select("gs_rs"), sendCode, function(err,result){
                if (err) {
                    done(err, {"result": false});
                }else {
                    done(err, {"result": true});
                }
            });
        }else {
            done(err, {"result": false});
        }
    };

    async.waterfall([searchMongodbForCode, insertMessageForMananger], done);
};

/**
 * 发送消息－通知
 * @param handler
 * @param done
 * @param callback
 */
//exports.setMessageAction = function (handler, done, callback){
//    var params = handler.params,
//        msg_type = params.msg_type,
//        content = params.content,
//        pid = params.pid;
//    var sql_url = "";
//    var ora_par = [];
//    switch (msg_type)
//    {
//        case 'zg_qy':{
//            ora_par = [[content,pid]];
//            oracle.inserts(builder.select(msg_type),ora_par,function (err, result){console.log("aaaaaFF",result)
//                if (err) {
//                    done(err, {"result": false});
//                }else {
//                    done(err, {"result": true});
//                }
//            });
//        }break;
//        case 'qy_zg':{}break;
//        case 'sw_qy':{
//            msg_type = 'gs_rs';
//            var groups = "55bb087cb221243415d86eb9";//向all区域send
//            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
//        }break;
//        case 'qy_sw':
//        case 'qy_xg':{
//            msg_type = 'gs_rs';
//            var groups = {"$in":["55f12ef89917f98a100e5075","55f12f034c7982d672a6e02d"]};/*1箱管*//*2商务*///向all箱管和商务发送消息
//            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
//        }break;
//        case 'xg_qy':{
//            msg_type = 'gs_rs';
//            var groups = "55bb087cb221243415d86eb9";//向all区域send
//            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
//        }break;
//        case 'gs_rs':{
//            msg_type = 'gs_rs';
//            var groups = "55bb082e983be6a0090a3cc0";//向all人事send
//            send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content);
//        }break;
//        default:{console.log("message_send_failed",result)
//            done(err, {"result": false});
//            return ;
//        }break;
//    }
//
//};
//function send_message_to_group(handler,groups,done,ora_par,msg_type,pid,content){
//    var log = light.framework.log;
//    var user = light.model.user;
//    log.debug("begin: getRenShi user", pid);
//    var user_group = [];
//    handler.addParams("condition", {"groups": groups});//收信组的ID
//
//    user.getList(handler, function(err, result1) {
//
//        console.log("&&&&&&&&&&&&&&&&result1:",result1);
//
//        if (err) {
//            log.error(err, pid);
//            done(err, {"result": false});
//        }
//        console.log(result1,"************************users");
//        log.debug("finish: getRenShi user", pid);
//
//        if (content == "人数已审批完毕")
//        {
//            for (var i = 0; i < result1.items.length; i++)
//            {
//                ora_par.push([
//                    result1.items[i].groups=="55f12ef89917f98a100e5075"?("箱管"+content):("商务"+content),
//                    result1.items[i].id
//                ]);
//            }
//        }
//        else
//        {
//            for (var i = 0; i < result1.items.length; i++)
//            {
//                ora_par.push([content,result1.items[i].id]);
//            }
//        }
//
//        console.log(ora_par,"************************ora_par");
//        oracle.inserts(builder.select(msg_type),ora_par,function (err, result){
//            if (err) {
//                done(err, {"result": false});
//            }else {
//                done(err, {"result": true});
//            }
//        });
//    });
//};

/************* hty ********************************************************/
exports.getCompanyBonusRatioAllAction = function (handler, done, callback){
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;
    oracle.query( builder.select("getCompanyBonusRatioAll"), [year,quarter], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
exports.getCompanyBonusRatioAction = function (handler, done, callback){
    var params = handler.params
        ,year = params.year
        ,quarter = params.quarter;
    var array = [];
    oracle.query( builder.select("getCompanyBonusRatio"), [year,quarter], function(err, result) {
        for(var i=0;i<result.length;i++){
            array.push({value:result[i].AWARD, name:result[i].NAME})
        }
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,array);
        }
    });
}
exports.getUserStatusAction = function (handler, done, callback){
    var params = handler.params
        ,responsibleId = params.responsibleId;
    var user = light.model.user;
    handler.addParams("condition", {valid:1, "id": responsibleId});
    user.getList(handler, function(err, result) {
        if(err) {
            done(err, {"result": false});
        }else {
            var checkPerSum = result.items[0].extend.checkPerSum;
            done(err, checkPerSum);
        }
    });
}
exports.getAreaStatusAction = function (handler, done, callback){
    var params = handler.params
        ,areaId = params.areaId;
    console.log("#########areaId:",areaId);
    oracle.query( builder.select("getAreaStatus"), [areaId], function(err, result) {
        console.log("#########result:",result);
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
//获取登录用户所属区域
exports.getAreaByResponsibleIdAction = function (handler, done, callback){
    var params = handler.params
        ,responsibleId = params.responsibleId;
    var areaId;
    var user = light.model.user;
    handler.addParams("condition", {valid:1, "id": responsibleId});
    user.getList(handler, function(err, result) {
        console.log("result",result);
        if(err) {
            done(err, {"result": false});
        }else {
            areaId = result.items[0].extend.orgid;
            console.log("areaId",areaId);
            done(err, areaId);
        }
    });
}
//获得用户的_id
exports.getUser_idAction = function (handler, done, callback){
    console.log("@@@@@@@@@@");
    var params = handler.params
        ,responsibleId = params.responsibleId;

    var user = light.model.user;
    handler.addParams("condition", {valid:1, "id": responsibleId});
    user.getList(handler, function(err, result) {
        if(err) {
            done(err, {"result": false});
        }else {
            var _id = result.items[0]._id;
            done(err, _id);
        }
    });
}
//修改区域审批状态
exports.subTubeAndBusinessPersonNumAction = function (handler, callback){
    var params = handler.params
        ,responsibleId = params.responsibleId
        , type      = handler.user.type;

    /**
     * 如果更新extend里面的字段，会把extend其他字段抹没
     * 所以，需要先取出extend里面的数据，改完之后，再存进去
     * @param done
     */

    //step1.通过用户的code查出用户的_id
    var getUserId = function(done) {
        handler.addParams("condition", {valid:1, "id": responsibleId});
        user.getList(handler, function(err, result) {
            if(err) {
                console.log("###err###",err);
            }else {
                done(err, result);
            }
        });
    };

    //step2.根据条件_id，更新数据
    var setUserData = function(result, done) {

        if (result) {
            var extend = result.items[0].extend;
            extend.checkPerSum = 1;
            var data = {extend: extend, type: type};

            user.update(handler.copy({data: data, id: result.items[0]._id.toString()}), function(err, result) {

                if (err) {
                    console.log("$$$$$$$$$$$$$",err);
                    return callback(err);
                }else {
                    console.log("$$$$$$$$$$$$$success");
                    done(err, result);
                }

            });
        }else {
            done(err);
        }

    };
    async.waterfall([getUserId, setUserData], callback);


    //oracle.query( builder.select("subTubeAndBusinessPersonNum"), [areaId], function(err, result) {
    //    if(result === undefined){
    //        console.log(err);
    //        result = '';
    //        done(err,result);
    //    }else{
    //        done(err,result);
    //    }
    //});
};
//保存箱管商务审批人数
exports.keepTubeAndBusinessPersonNumAction = function (handler, done, callback){
    var params = handler.params
        ,array = params.array;
    var officeId,businessNum,tubeNum;
    var dataResult;
    for(var i=0;i<array.length;i++){
        officeId = array[i].officeId;
        businessNum = array[i].businessNum;
        tubeNum = array[i].tubeNum;
        oracle.query( builder.select("keepTubeAndBusinessPersonNum"), [tubeNum,businessNum,officeId], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//查询所管的所有办事处的箱管商务人数
exports.getTubeAndBusinessPersonNumAction = function (handler, done, callback){
    var params = handler.params
        ,responsibleId = params.responsibleId;
    oracle.query( builder.select("getTubeAndBusinessPersonNum"), [responsibleId], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
//关系维护提交
exports.setOfficeRelationAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var officeId,responId;
    var dataResult;
    for(var i=0;i<array.length;i++){
        officeId = array[i].officeId;
        responId = array[i].responId;
        oracle.query( builder.select("setOfficeRelation"), [responId,officeId], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//根据主管、区域id读取办公室
exports.getOfficeByAreaIdAction = function (handler, done, callback){
    var params = handler.params;
    var areaId = params.areaId;
    var responId = params.responId;
    oracle.query( builder.select("getResponByAreaId"), [areaId,responId], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
//根据区域id读取区域主管//////////
exports.getResponByAreaIdAction = function (handler, done, callback){
    var params = handler.params
        ,areaId = params.areaId;
    var array = [];
    var user = light.model.user;
    handler.addParams("condition", {valid:1, "extend.orgid": areaId});
    user.getList(handler, function(err, result) {
        if(err) {
            done(err, {"result": false});
        }else {
            for(var i = 0; i < result.totalItems; i++) {
                array.push({ID:result.items[i].id, NAME:result.items[i].name});
            }
            done(err, array);
        }
    });

}
//根据公司id读取区域
exports.getAreaByCompanyIdAction = function (handler, done, callback){
    var params = handler.params;
    var companyId = params.companyId;
    oracle.query( builder.select("getAreaByCompanyId"), [companyId], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
//读取所有公司
exports.getAllCompanyAction = function (handler, done, callback){
    oracle.query( builder.select("getAllCompany"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//修改商务申报状态
exports.subBusinessDeclareStatusAction = function (handler, done, callback){
    var setAreaCommerceStatusDeclare = function(done){
        oracle.query( builder.select("setAreaCommerceStatusDeclare"), [], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    }
    var subBusinessDeclareStatus = function(done){
        oracle.query( builder.select("subBusinessDeclareStatus"), [], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    }
    async.parallel([setAreaCommerceStatusDeclare,subBusinessDeclareStatus], done);
}
//保存商务人数
exports.keepBusinessPersonNumberAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var id,personNumber;
    var dataResult;
    for(var i=0;i<array.length;i++){
        id = array[i].id;
        personNumber = array[i].personNumber;
        oracle.query( builder.select("keepBusinessPersonNumber"), [personNumber,id], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//提交商务人数
exports.subBusinessPersonNumberAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var id,personNumber;
    var dataResult;
    for(var i=0;i<array.length;i++){
        id = array[i].id;
        personNumber = array[i].personNumber;
        oracle.query( builder.select("subBusinessPersonNumber"), [personNumber,personNumber,id], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//读取商务人数
exports.getBusinessPersonNumberAction = function (handler, done, callback){
    oracle.query( builder.select("getBusinessPersonNumber"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//得到商务申报状态
exports.getBusinessDeclareStatusAction = function (handler, done, callback){
    oracle.query( builder.select("getBusinessDeclareStatus"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//修改箱管申报状态
exports.subTubeDeclareStatusAction = function (handler, done, callback){
    var subTubeDeclareStatus = function(done){
        oracle.query( builder.select("subTubeDeclareStatus"), [], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    }
    var setAreaTubeStatusDeclare = function(done){
        oracle.query( builder.select("setAreaTubeStatusDeclare"), [], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    }
    async.parallel([subTubeDeclareStatus,setAreaTubeStatusDeclare], done);
}
//保存箱管人数
exports.keepTubePersonNumberAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var id,personNumber;
    var dataResult;
    for(var i=0;i<array.length;i++){
        id = array[i].id;
        personNumber = array[i].personNumber;
        oracle.query( builder.select("keepTubePersonNumber"), [personNumber,id], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//提交箱管人数
exports.subTubePersonNumberAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var id,personNumber;
    var dataResult;
    for(var i=0;i<array.length;i++){
        id = array[i].id;
        personNumber = array[i].personNumber;
        oracle.query( builder.select("subTubePersonNumber"), [personNumber,personNumber,id], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//读取箱管人数
exports.getTubePersonNumberAction = function (handler, done, callback){
    oracle.query( builder.select("getTubePersonNumber"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//得到箱管申报状态
exports.getTubeDeclareStatusAction = function (handler, done, callback){
    oracle.query( builder.select("getTubeDeclareStatus"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//得到总奖金分配状态
exports.getCompanyBonusStatusAction = function (handler, done, callback){
    oracle.query( builder.select("getCompanyBonusStatus"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//查询公司奖金数据
exports.checkCompanyBonusAction = function (handler, done, callback){
    var params = handler.params,
        year = params.year,
        quarter = params.quarter;
    oracle.query( builder.select("checkCompanyBonus"), [year,quarter], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//读取公司奖金数据
exports.getCompanyBonusAction = function (handler, done, callback){
    oracle.query( builder.select("getCompanyBonus"), function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}
//保存公司奖金数据
exports.keepCompanyBonusAction = function (handler, done, callback){
    var params = handler.params;
    var array = params.array;
    var id,award;
    var dataResult;
    for(var i=0;i<array.length;i++){
        id = array[i].id;
        award = array[i].award;
        oracle.query( builder.select("keepCompanyBonus"), [award,id], function(err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
            }
            dataResult = result;
        });
    }
    done(dataResult);
}
//修改总奖金分配状态
exports.subCompanyBonusAction = function (handler, done, callback){
    oracle.query( builder.select("updateCompanyBonusStatus"), [], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            done(err,result);
        }
    });
}
//箱管商务人数查询
exports.checkTubeBusinessPersonNumberAction = function (handler, done, callback){
    var params = handler.params,
        year = params.year,
        quarter = params.quarter;
    oracle.query( builder.select("checkTubeBusinessPersonNumber"), [year,quarter], function(err, result) {
        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
}




/************** hd ********************************************************/
//获取用户的 消息
exports.getUserMsgAction = function(handler, done, callback) {
    var params = handler.params;
    var userCode = params.userCode,
        userOrgId = params.userOrgId,
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

//修改消息状态，将状态位N改为Y
exports.msgChangeStatusAction = function (handler, done, callback) {
    var params = handler.params,
        c_id = params.c_id;
    //修改消息状态
    oracle.query(builder.select("msgChangeStatus"), [c_id], function(err,result) {

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

//获取系统期限，时间设置
exports.getTimeValuesAction = function (handler, done, result) {

    oracle.query(builder.select("getTimeValues"), function(err, result) {
        if (err || result === undefined) {
            console.log(err);
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }

    });
};

//第一次访问，应该从码表中把数据查出来
exports.getTimeTermAction = function (handler, done, callback) {
    oracle.query(builder.select("getTimeTerm"), function(err, result) {
        if(err || result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err,result);
        }

    });
};

//时间设置页面  结束当前绩效考核
exports.closeSystemAction = function (handler, done, callback) {

    var year = '0', quarter = '0', cquarter = 'error';
    oracle.query( builder.select("getNowTime"),function(err, result) {
        if(err){
            done(err, {result_type: '0'});
        }
        else{
            year = result[0].YEARS;
            quarter = result[0].QUARTER;
            switch(quarter)
            {
                case '1':{
                    year = year;
                    quarter = 2;
                    cquarter = '二季度 三季度 四季度 一季度';
                }break;
                case '2':{
                    year = year;
                    quarter = 3;
                    cquarter = '三季度';
                }break;
                case '3':{
                    year = year;
                    quarter = 4;
                    cquarter = '四季度';
                }break;
                case '4':{
                    year = parseInt(year)+1;
                    quarter = 1;
                    cquarter = '一季度';
                }break;
                default:{
                    done(err, {result_type: '0'});
                    return ;
                }break;
            }
            //关闭当前的季度
            oracle.update(builder.select("closeSystem"), [], function(err, result) {
                if(err){
                    console.log(err);
                    done(err, {result_type: '0'});
                }
                else{
                    //初始化下个季度的操作状态
                    oracle.insert(builder.select("setNextState"), [year,quarter,cquarter],function(err, result) {
                        if(err){
                            console.log(err);
                            done(err, {result_type: '0'});
                        }
                        else{
                            done(err, {result_type: '1'});
                        }
                    });
                }
            });

        }

    });

};

//判断当前是否能进行各办奖金分配，商务箱管人数是否已经分配完毕
exports.getPeoNumStateAction = function (handler, done, callback){

    oracle.query(builder.select("getPeoNumState"), function (err, result){
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type": 0});
        } else {console.log(result);
            if (result[0].TUBE_PERSON_SUBSTATUS == '1' && result[0].COMMERCE_PERSON_SUBSTATUS == '1') {
                done(err, {"result_type": 1});
            }else{
                done(err, {"result_type": 0});
            }

        }
    });
}

//修改系统时间
exports.systemTimeChangeAction = function (handler, done, callback) {

    var params = handler.params.updateData;
    var pa = [];
    for (var i = 0; i < params.length; i++)
    {
        pa[i] = [
            params[i].cre_time,
            params[i].end_time,
            params[i].remarks,
            params[i].id
        ];
    }
    oracle.updates(builder.select("updateTimeTable"), pa, function (err, result){
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type": 0});
        } else {
            done(err, {"result_type": 1});
        }
    });
};

//获取公司名和ID---查看各办奖金teb页用
exports.getCompanyRelationAction = function(handler, done, result) {
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

//系统初始化
exports.systemStartAction = function (handler, done, callback) {
    var params = handler.params;
    var insertData = params.insertData;
    //点击开始
    //初始化--操作状态表
    oracle.query(builder.select("updateOperateState"), function(err, result) {
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type":0});
        }else {
            //初始化--区域操作状态表
            oracle.query(builder.select("insertAreaState"), function (err, result){
                if (err) {
                    console.log(err);
                    result = '';
                    done(err, {"result_type":0});
                }else {
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
                        paramsValues[i] = [insertData[i].description,insertData[i].TIME_CONTROL_TREM_ID,insertData[i].cre_time,insertData[i].end_time,insertData[i].remarks,i];
                    }
                    console.log(paramsValues);
                    //初始化--时间时间控制表
                    oracle.inserts(builder.select("insertTimeTable"),
                        /*[['100043','','','',0]]/!*测试用的数据，正式需要改成变量paramsValues*!/,*/
                        paramsValues,
                        function (err, result){
                            if (err) {
                                console.log(err);
                                result = '';
                                done(err, {"result_type":0});
                            }else {
                                //初始化--公司奖金分配表
                                oracle.query(builder.select("insertCompanyBonus"), function (err, result){
                                    if (err) {
                                        console.log(err);
                                        result = '';
                                        done(err, {"result_type":0});
                                    }else {
                                        //初始化--办事处奖金分配表
                                        oracle.query(builder.select("insertOfficeBonus"), function (err, result){
                                            if (err) {
                                                console.log(err);
                                                result = '';
                                                done(err, {"result_type":0});
                                            }else {
                                                //初始化--办事处奖金分配表2
                                                oracle.query(builder.select("insertOfficeBonus2"), function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                        result = '';
                                                        done(err, {"result_type": 0});
                                                    } else {
                                                        //初始化--员工奖金比例表
                                                        oracle.query(builder.select("insertEmployeeScale"), function (err, result) {
                                                            if (err) {
                                                                console.log(err);
                                                                result = '';
                                                                done(err, {"result_type": 0});
                                                            } else {
                                                                done(err, {"result_type": 1});
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                }
            });
        }
    });

};

//获取各办奖金分配信息
exports.getOfficeBonusAction = function (handler, done, callback) {
    var sum_money = 0;
    var sum_sum_fen = 0;
    var jx_fen_sum = 0;
    var jx_fen_ave = 0;
    oracle.query(builder.select("getOfficeBonusState"), function (err, results){
        if (err) {
            console.log(err);
            results = '';
            done(err, {"result_type": 0});
        } else {
            //get bonus money sum
            oracle.query(builder.select("getAllBonus"), function (err, result){
                if (err) {
                    console.log(err);
                    result = '';
                    done(err, {"result_type": 0});
                } else {
                    sum_money = result[0].SUM;
                    if (results[0].OFFICE_BONUS_STATUS == '2') {
                        //get office bonus state
                        oracle.query(builder.select("getOfficeBonus"), function (err, result){
                            if (err) {
                                console.log(err);
                                result = '';
                                done(err, {"result_type": 0});
                            } else {
                                //计算绩效分总分
                                var num = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var j = result[i];
                                    if (j.OFFICE_NAME != '箱管' &&
                                        j.OFFICE_NAME != '财务商务' &&
                                        j.OFFICE_NAME != '船管' &&
                                        j.OFFICE_NAME != '运管' &&
                                        j.OFFICE_NAME != '财务主管'
                                    ) {
                                        j.SUM_FEN = parseFloat(j.DEPTPERSONS) * parseFloat(j.JX_FEN);
                                        if (j.JX_FEN != 0 && j.JX_FEN != null) {
                                            num ++;
                                        }
                                    }
                                    sum_sum_fen += parseFloat(j.SUM_FEN);
                                    jx_fen_sum += parseFloat(j.JX_FEN);
                                }
                                jx_fen_ave = jx_fen_sum / num;
                                //取出的之还是初始化的值，在此处进行计算成有效值
                                for (var i = 0; i < result.length; i++) {
                                    var j = result[i];

                                    if (j.OFFICE_NAME != '箱管' &&
                                        j.OFFICE_NAME != '财务商务' &&
                                        j.OFFICE_NAME != '船管' &&
                                        j.OFFICE_NAME != '运管' &&
                                        j.OFFICE_NAME != '财务主管'
                                    ){
                                        j.TOTAL = isNaN(parseFloat(sum_money) / parseFloat(sum_sum_fen) * parseFloat(j.SUM_FEN))?0:(parseFloat(sum_money) / parseFloat(sum_sum_fen) * parseFloat(j.SUM_FEN));
                                        j.PER_CAPITA = isNaN(parseFloat(j.TOTAL) / parseFloat(j.DEPTPERSONS))?0:(parseFloat(j.TOTAL) / parseFloat(j.DEPTPERSONS));
/*                                        j.COMMERCE_MONEY = isNaN(parseFloat(j.PER_CAPITA) * parseFloat(j.EX_COMMERCE_NUMBER))?0:(parseFloat(j.PER_CAPITA) * parseFloat(j.EX_COMMERCE_NUMBER));现在没有审批商务人数和箱管人数所以不能用审批后的人数*/
                                        j.COMMERCE_MONEY = isNaN(parseFloat(j.PER_CAPITA) * parseFloat(j.COMMERCE_NUMBER))?0:(parseFloat(j.PER_CAPITA) * parseFloat(j.COMMERCE_NUMBER));
                                        j.TUBE_MONEY = isNaN(parseFloat(j.PER_CAPITA) * parseFloat(j.TUBE_NUMBER))?0:(parseFloat(j.PER_CAPITA) * parseFloat(j.TUBE_NUMBER));
                                        j.TRUE_TOTAL = parseFloat(j.TOTAL) - parseFloat(j.TUBE_MONEY) - parseFloat(j.COMMERCE_MONEY);
                                    }
                                    else{
                                        j.JX_FEN = jx_fen_ave * j.JD_AVE;
                                    }

                                }
                                console.log("后台计算获得数据");
                                done(err, {"result_type": 1,"result_data":result,"sum_money":sum_money,"all_score":sum_sum_fen,"jx_fen_ave":jx_fen_ave});

                            }
                        });

                    }
                    else{
                        oracle.query(builder.select("getOfficeBonus"), function (err, result){
                            if (err) {
                                console.log(err);
                                result = '';
                                done(err, {"result_type": 0});
                            } else {
                                var num = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var j = result[i];
                                    sum_sum_fen += parseFloat(j.SUM_FEN);
                                    if(j.OFFICE_NAME != '箱管' &&
                                        j.OFFICE_NAME != '财务商务' &&
                                        j.OFFICE_NAME != '船管' &&
                                        j.OFFICE_NAME != '运管' &&
                                        j.OFFICE_NAME != '财务主管'
                                    ){
                                        jx_fen_sum += parseFloat(j.JX_FEN);
                                        if (j.JX_FEN != 0 && j.JX_FEN != null) {
                                            num ++;
                                        }

                                    }

                                }
                                jx_fen_ave = jx_fen_sum / num;

                                console.log("直接在表中获取数据");
                                //console.log("%%%%%%%%result:",result);
                                done(err, {"result_type": 1,"result_data":result,"sum_money":sum_money,"all_score":sum_sum_fen,"jx_fen_ave":jx_fen_ave});
                            }
                        });
                    }
                }
            });

        }
    });

};

//save bonus
exports.bonusPutAction = function (handler, done, callback){
    var params = handler.params,
        req_data = params.req_data;
        //console.log(req_data);

        var sql_params = new Array();
        for (var i = 0; i < req_data.length; i++)
        {

            sql_params[i] = [req_data[i].DEPTPERSONS,req_data[i].JD_AVE,req_data[i].JX_FEN,req_data[i].SUM_FEN,
                req_data[i].TOTAL,req_data[i].PER_CAPITA,
                req_data[i].COMMERCE_MONEY,req_data[i].TUBE_MONEY,
                req_data[i].PROBATION,req_data[i].POSITIVE,req_data[i].MONTHS_NUMBER,
                req_data[i].TRUE_TOTAL,req_data[i].MONTH_PER_CAPITA,req_data[i].EFFECTIVE_COEFFICIENT,req_data[i].ID];

        }
    //console.log(sql_params);
    oracle.updates(builder.select("setOfficeBonus"), sql_params, function (err, result){
        if (err)
        {
            done(err, {"result": false});
        }
        else
        {
            oracle.update(builder.select("changeSubState"), [req_data[0].SUBSTATUS], function (err, result) {
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

//显示各办奖金分配信息
exports.showOfficeBonusAction = function (handler, done, callback) {

    var params = handler.params;
    var pa=[params.year,params.quarter,params.companyId];
    oracle.query(builder.select("showOfficeBonus"), pa, function (err, result){
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type": 0});
        } else {
            console.log(result);

            done(err, {"result_type": 1,"result_data":result});
        }
    });
}

//获取各办奖金分配状态
exports.getOfficeBonusStateAction = function (handler, done, callback) {

    oracle.query(builder.select("getOfficeBonusState"), function (err, result){
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type": 0});
        } else {
            var change_power = true;
            if (result[0].OFFICE_BONUS_STATUS == '1')
            {
                change_power = false;
            }
            done(err, {"result_type": 1,"change_power":change_power});
        }
    });
}

//奖金具体分配到人
function setPeopleBonus(){
    oracle.query(builder.select("getOfficeBonusState"), function (err, result){
        if (err) {
            console.log(err);
            result = '';
            return 0;
        } else {
            if (result[0].OFFICE_BONUS_STATUS == '1') {
                oracle.query(builder.select("getAreaCheckAllState"), function (err, result){
                    if (err) {
                        console.log(err);
                        result = '';
                        return 0;
                    } else {
                        if (result[0].SUM == '8') {

                            oracle.query(builder.select("computeEmployeeBonus"), function (err, result){
                                if (err) {
                                    console.log(err);
                                    result = '';
                                    return 0;
                                } else {
                                    var res = [];
                                    var all_p = 0;//算上主管系数所有员工的人数
                                    var em_mon = 0;//员工的奖金
                                    var pe_par =[];
                                    for (var i = 0; i < result.length; i++) {

                                        var j = 0;
                                        for (j = 0; j < pe_par.length; j++)
                                        {
                                            if (result[i].POSITION == '20' && result[i].OFFICEBONUS_ID == pe_par[j].OFFICEBONUS_ID ){
                                                pe_par[j].peo += result[i].SUPERIORPRO;
                                                break;
                                            }
                                        }
                                        if (j == pe_par.length){
                                            pe_par[j] = {"OFFICEBONUS_ID":result[i].OFFICEBONUS_ID,"peo":0};
                                        }
                                    }
                                    console.log("各办主管系数和---------",pe_par);

                                }
                            });
                        }
                        else{
                            console.log(2);
                            return 2;
                        }
                    }
                });
            }
            else{
                console.log(1);
                return 1;
            }
        }
    });
};
exports.testAction = function (handler, done, callback) {
    console.log("begin testAction;");
    var r = setPeopleBonus();
    done('', {"result_type": 1});
    console.log("end testAction;");
}

//查询区域的所有人员的奖金分配情况
exports.showBonusByAreaAction = function (handler, done, callback) {
    var params = handler.params;
    var pa=[params.year,params.quarter,params.areaId];
    oracle.query(builder.select("showBonusByArea"), pa, function (err, result){
        if (err) {
            console.log(err);
            result = '';
            done(err, {"result_type": 0});
        } else {
            done(err, {"result_type": 1,"result_data":result});
        }
    });
}

//获取各公司奖金
exports.getPerAreaBonusAction = function (handler, done, callback) {
    var params = handler.params;
    var pa=[params.year,params.quarter];
    oracle.query(builder.select("getPerAreaBonus"), pa, function(err,result) {
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

//绩效分析统计
exports.showJXFXTJAction = function (handler, done, callback) {
    var params = handler.params,
        query_type = params.query_type;
    var pa=[params.year,params.quarter];

        var sql_url = "";
        var now_y=pa[0],now_q=pa[1],
            tb_y=pa[0],tb_q=pa[1],
            hb_y=pa[0],hb_q=pa[1];
        switch (query_type)
        {
            case '1':{
                sql_url = "JXFXTJ1";
            }break;
            case '2':{
                sql_url = "JXFXTJ2";
            }break;
            case '3':{
                sql_url = "JXFXTJ3";
            }break;
            default:{
                sql_url = "JXFXTJ4";
            }break;
        }
    if (query_type == '3'||query_type == '4'){
        tb_y = now_y-1;tb_q = now_q;
        switch (now_q)
        {
            case '1':{
                hb_y=now_y-1;
                hb_q="4";
            }break;
            case '2':{
                hb_y=now_y;
                hb_q="1";
            }break;
            case '3':{
                hb_y=now_y;
                hb_q="2";
            }break;
            default:{
                hb_y=now_y;
                hb_q="3";
            }break;
        }
        pa = [now_y,now_q,tb_y.toString(),tb_q,hb_y,hb_q];
    }
    oracle.query(builder.select(sql_url), pa, function (err, result){
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
/************** lyj ******************************************************/
/**
 * 判断主管申报是保存状态还是提交状态
 * @param handler
 * @param done
 * @param callback
 */
exports.getTrueComOrSaveAction = function (handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;
    oracle.query(builder.select("searchOperatingState"), [orgId], function (err, result) {
        if(err) {
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
};

/**
 * 获得各办下面的人员奖金分配数据
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmployeeBonusInfoAction = function (handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;
    oracle.query(builder.select("getEmployeeBonusInfo"), [orgId], function (err, result) {
        if(err) {
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
};

/**
 * 获得各办下面的人员奖金分配数据search
 * @param handler
 * @param done
 * @param callback
 */
exports.searchEmployeeBonusInfoAction = function (handler, done, callback) {
    var params = handler.params
        ,orgId = params.orgId
        ,years = params.years
        ,quarter = params.quarter;

    oracle.query(builder.select("searchEmployeeBonusInfo"), [orgId,quarter,years], function (err, result) {
        if(err) {
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
};

/**
 * 获得各办下面的员工和主管的奖金分配数据
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmployeeBonusAndManagerInfoAction = function (handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    oracle.query(builder.select("getEmployeeBonusAndManagerInfo"), [orgId], function (err, result) {
        if(err) {
            console.log(err);
            result = '';
            done(err,result);
        }else {
            done(err, result);
        }
    });
};

/**
 * 更新数据 － 员工奖金比例表
 * @param handler
 * @param done
 * @param callback
 */
exports.updateEmployeeBonusAction = function(handler, done, callback) {
    var params = handler.params;
    var updateData = params.updateData;

    var dataJson = new Array();

    for(var i=0; i<updateData.length; i++) {
        dataJson[i] = [updateData[i].remarks,updateData[i].proportion,updateData[i].id];
    }

    oracle.updates(builder.select("updateEmployeeBonus"), dataJson, function(err, result) {

        console.log("#result",result);

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
 * 主管申报－点过保存按钮，又点提交按钮
 * @param handler
 * @param done
 * @param callback
 */
exports.upInEmployeeBonusAction = function(handler, done, callback) {
    var params = handler.params;
    var updateData = params.updateData;
    var deptcode = params.deptcode;
    var userCode = params.userCode;

    //step1.更新员工奖金比例表
    var updateEmployeeBonus = function(done) {
        var dataJson = new Array();

        for(var i=0; i<updateData.length; i++) {
            dataJson[i] = [updateData[i].remarks,updateData[i].proportion,updateData[i].id];
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

    //step2.更新办事处提交状态表
    var updateOfficeBounsStatus = function(result, done) {
        console.log("***********result",result);
        if(result.result === true) {
            oracle.query(builder.select("updateOfficeBonusStatus"), [userCode, deptcode], function(err, result) {
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

    async.waterfall([updateEmployeeBonus, updateOfficeBounsStatus], done);

};

/**
 * 查询办事处提交状态
 * @param handler
 * @param done
 * @param callback
 */
exports.officeSubmitStatusGetAction = function (handler, done, callback){
    /*
     * 查询办事处的提交状态
     * */
    var params = handler.params,
        orgId = params.orgId;
    oracle.query(builder.select("office_submit_status"),[orgId],function (err, result){
        if (err || result === undefined)
        {
            console.log(err);
            result = '';
            done(err, result);
        }
        else
        {
            done(err, result);
        }
    });
};

/**
 * 判断上级审批状态
 * @param handler
 * @param done
 * @param callback
 */
exports.panduanStatusAction = function (handler,done, callback) {
    var params = handler.params;
    var orgId = params.orgId;
    oracle.query(builder.select("panduan_office_submit_status"), [orgId], function(err, result) {
        if (err)
        {
            done(err, result);
        }
        else
        {
            done(err, result);

        }
    });

};

/**
 * 保存区域副总审批数据
 * @param handler
 * @param callback
 */
exports.areaCheckSaveAction = function (handler, done, callback) {
    var params = handler.params,
        req_data = params.req_data;

    var sql_param = new Array();
    for (var i = 0; i < req_data.length; i++)
    {
        sql_param[i] = [
            req_data[i].SUPERIORPRO===undefined?0:req_data[i].SUPERIORPRO,
            req_data[i].REMARKSPRO===undefined?"":req_data[i].REMARKSPRO,
            req_data[i].ID
        ];
    }
    oracle.updates(builder.select("area_save_bonus"),sql_param, function (err, result){
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
 * 提交区域副总审批数据
 * @param handler
 * @param done
 * @param callback
 */
exports.areaCheckPutAction = function (handler, done, callback){
    /*
     * 提交区域副总审批数据
     * 1.更新员工奖金比例表数据
     * 2.更新办事处奖金表的－上级状态30
     * */
    var params = handler.params,
        req_data = params.req_data,
        u_na = params.u_na,
        orID = params.orID;

    //step1.上级审核－更新员工奖金比例表数据
    var updateEmployeeBonus = function(done) {
        var sql_param = new Array();
        for (var i = 0; i < req_data.length; i++)
        {

            sql_param[i] = [
                req_data[i].SUPERIORPRO===undefined?0:req_data[i].SUPERIORPRO,
                req_data[i].REMARKSPRO===undefined?"":req_data[i].REMARKSPRO,
                req_data[i].MONEY===undefined?0:req_data[i].MONEY,
                req_data[i].MONEY===undefined?0:req_data[i].MONEY,
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
                done(err, {"result": true});
            }
        });
    };

    //step2.插入办事处提交状态表
    var updateOfficeCheckStatus = function(result, done) {
        if(result.result === true) {
            oracle.query(builder.select("office_submit_status_change"), [u_na, orID], function(err, result) {
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

    async.waterfall([updateEmployeeBonus, updateOfficeCheckStatus], done);
    setPeopleBonus();
};

/**
 * 获得主管系数
 * @param handler
 * @param done
 * @param callback
 */
exports.getManagerCoefficientAction = function (handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    oracle.query( builder.select("getManagerCoefficient"),[orgId], function(err, result) {

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
 * 获得某办事处的奖金是多少
 * @param handler
 * @param done
 * @param callback
 */
exports.getOfficeMoneyAction = function (handler, done, callback) {
    var params = handler.params;
    var orgId = params.orgId;

    oracle.query( builder.select("getOfficeMoney"),[orgId], function(err, result) {

        if(result === undefined){
            console.log(err);
            result = '';
            done(err,result);
        }else{
            if (result[0].OFFICE_ID === '10000045'){//箱管
                console.log("$$$$$$$箱管");
                oracle.query(builder.select("getOfficeComTubeMoney"), [], function(err,results) {
                    result[0].TRUE_TOTAL = parseFloat(result[0].TRUE_TOTAL) + parseFloat(results[0].ALL_TUBE_MONEY);
                    done(err,result);
                });
            }else if(result[0].OFFICE_ID === '10000042'){//财务商务
                console.log("$$$$$$$财务商务");
                oracle.query(builder.select("getOfficeComTubeMoney"), [], function(err,results) {
                    result[0].TRUE_TOTAL = parseFloat(result[0].TRUE_TOTAL) + parseFloat(results[0].ALL_COMMERCE_MONEY);
                    done(err,result);
                });
            }else {
                done(err,result);
            }

        }

    });
};

/**
 * 查询所有办事处提交状态
 * @param handler
 * @param done
 * @param callback
 */
exports.getAllOfficeStatusAction = function (handler, done, callback){
    oracle.query(builder.select("getAllOfficeStatus"), [], function (err, result) {
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
 * 获得部门、组/办、员工名称码表
 * @param handler
 * @param callback
 */
exports.getSearchTableAction = function(handler, callback) {
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
 * 获得公司那张大表数据
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmpPerformanceInfoAction = function (handler, done, callback) {
    var params = handler.params;

    //step1.获得当前操作时间
    var getNowOperationTime = function (done) {
        oracle.query(builder.select("getNowTime"), [], function (err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    };
    //step2.获得公司那张大表数据
    var getCompanyAllEmpInfo = function (result, done) {
        var years,quarter;
        if (result) {
            years = result[0].YEARS;
            quarter = result[0].QUARTER;

            if (quarter === 1) {
                years = parseInt((parseInt(years) - 1));
                quarter = 4;
            }else {
                years = parseInt(years);
                quarter = parseInt((parseInt(quarter) - 1))
            }
            //console.log("*****"+years+"*****"+quarter);
            oracle.query(builder.select("getCompanyBigTable"), [years, quarter], function (err, result) {

                //console.log("#########result:",result);
                if(result === undefined){
                    console.log(err);
                    result = '';
                    done(err,result);
                }else{
                    done(err,result);
                }

            });
        }else {
            console.log(err);
            result = '';
            done(err,result);
        }

    };
    async.waterfall([getNowOperationTime, getCompanyAllEmpInfo], done);

};

/**
 * 获得人事那张大表数据
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmpPerformanceForHrInfoAction = function (handler, done, callback) {
    var params = handler.params;

    //step1.获得当前操作时间
    var getNowOperationTime = function (done) {
        oracle.query(builder.select("getNowTime"), [], function (err, result) {
            if(result === undefined){
                console.log(err);
                result = '';
                done(err,result);
            }else{
                done(err,result);
            }
        });
    };
    //step2.获得公司那张大表数据
    var getCompanyAllEmpInfo = function (result, done) {
        var years,quarter;
        if (result) {
            years = result[0].YEARS;
            quarter = result[0].QUARTER;

            if (quarter === 1) {
                years = parseInt((parseInt(years) - 1));
                quarter = 4;
            }else {
                years = parseInt(years);
                quarter = parseInt((parseInt(quarter) - 1))
            }
            //console.log("*****"+years+"*****"+quarter);
            oracle.query(builder.select("getCompanyBigTable"), [years, quarter], function (err, result) {

                //console.log("#########result:",result);
                if(result === undefined){
                    console.log(err);
                    result = '';
                    done(err,result);
                }else{
                    done(err,result);
                }

            });
        }else {
            console.log(err);
            result = '';
            done(err,result);
        }

    };
    async.waterfall([getNowOperationTime, getCompanyAllEmpInfo], done);

};

/**
 * 各办奖金分配界面
 * 点击保存、提交，更新员工的奖金
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmpMoneyAction = function (handler, done, callback) {
    var params = handler.params,
        req_data = params.req_data;

    var sql_params = new Array();
    var return_data = new Array();
    var finish_data = new Array();

    var req_length = _.keys(req_data).length;

    (function  iterator_num(index){
        //console.log(index);
        //console.log("!!!!!!!!!",req_data[index][0]);
        if(index < req_length) {
            oracle.query(builder.select("searchOfficePersonNum"), [req_data[index][0]], function (err, result) {
                sql_params[index] = [req_data[index][0],req_data[index][1],result[0].ALLNUM,result[0].ZHUNUM,result[0].ZHUXISHU];
                iterator_num(++index);
            });
        }else {
            searchEmp();
        }

    })(0);

    function searchEmp () {
        //console.log("######sql_params",sql_params);
        var aa = 0;
        (function  iterator(index){

            if(index < req_length) {
                //根据办事处的奖金表的id 和 钱,查员工奖金比例表中的员工（主管和员工）
                oracle.query(builder.select("searchAllOfficeEmpBounsInfo"), [req_data[index][0]], function (err, result) {
                    if (result.length > 0 ) {
                        for(var i = 0; i< result.length; i++) {
                            return_data[aa] = [result[i].ID,result[i].OFFICEBONUS_ID,result[i].POSITION,result[i].PROPORTION,result[i].SUPERIORPRO,result[i].CODE,result[i].NAME];
                            ++aa;
                            if(i == result.length - 1) {
                                iterator(++index);
                            }
                        }
                    }else {
                        iterator(++index);
                    }
                });
            }else {
                //console.log("@@@@@@@@@",return_data);
                //console.log("##########",sql_params);
                setData();
            }

        })(0);
    }


    function setData() {
        callback = callback || function () {};
        var aId,aMoney,bId, tt = 0,money = 0;
        for(var i = 0; i < sql_params.length; i++) {
            aId = sql_params[i][0];
            aMoney = sql_params[i][1];
            for(var j = 0; j < return_data.length; j++) {
                if(aId == return_data[j][1]){

                    if (return_data[j][2] == '20') {
                        /**
                         * 算主管的钱
                         * 主管钱 ＝ 总钱 * 该主管系数 * (100 / (总人数 － 主管人数)) / (该办事处总系数 * 100 / (总人数 － 主管人数) + 100)
                         */
                        if((sql_params[i][2] - sql_params[i][3]) !== 0) {
                            money = sql_params[i][1] * return_data[j][3] * (100 / (sql_params[i][2] - sql_params[i][3])) / (sql_params[i][4] * 100 / (sql_params[i][2] - sql_params[i][3]) + 100);
                        }else {
                            money = sql_params[i][1] * return_data[j][3] / (sql_params[i][4]);
                            //console.log("############111:",return_data[j][0]+"$$$$$"+money+"$$$总钱："+sql_params[i][1]+"$$$$该主管系数："+return_data[j][3]+"$$$$所有主管系数："+sql_params[i][4]);
                        }

                        finish_data[tt] = [money,return_data[j][0]];

                    }else if(return_data[j][2] == '10'){
                        /**
                         * 算员工的钱
                         * 员工钱 ＝ 总钱 * 该员工比例 / (该办事处总系数 * 100 / (总人数 － 主管人数) + 100)
                         */
                        money = sql_params[i][1] * return_data[j][4] / (sql_params[i][4] * 100 / (sql_params[i][2] - sql_params[i][3]) + 100);
                        finish_data[tt] = [money,return_data[j][0]];
                    }

                    tt++;

                    if (i == sql_params.length - 1 && j == return_data.length - 1) {

                        //console.log(finish_data);
                        //console.log("***********");
                        var result = finish_data;
                        //return done(result);
                        return done(null, result);
                    }
                }
            }
        }
    }

};

/**
 * 各办奖金分配界面算员工的钱并修改
 * @param handler
 * @param callback
 */
exports.updateEmpMoneyAction = function(handler, done, callback) {
    var params = handler.params,
        update_data = params.update_data;

    //console.log(update_data);

    var data = new Array();

    /**
     * lyj
     * 更新两个字段 ，需要重复传两次
     * 比如（更新 JS_AWARD 和 HS_AWARD ，需要传两次 MONEY）
     */
    for(var i = 0; i < update_data.length; i++) {
        data[i] = [update_data[i].MONEY,update_data[i].MONEY,update_data[i].ID];
    };

    //console.log("#######",data);
    oracle.updates(builder.select("updteEmpMoney"), data, function(err, result) {
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
 * 点开始之前，判断绩效表里面是不是有要操作季度的数据
 * @param handler
 * @param callback
 */
exports.checkJiXiaoInfoAction = function (handler, done, callback) {
    var params = handler.params;
    oracle.query(builder.select("checkJiXiaoInfo"), [], function (err, result) {
        if (result.length > 0)
        {
            done(err, {"result": true});
        }
        else
        {
            done(err, {"result": false});
        }
    });
};

/**
 * 员工信息查询
 * @param handler
 * @param done
 * @param callback
 */
exports.getEmpInfoAction = function (handler, done, callback){
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
};

/**
 * 修改员工信息
 * @param handler
 * @param done
 * @param callback
 */
exports.em_info_edit = function (handler, done, callback){
    var params = handler.params;
    if(params.POSITION == "主管") {
        params.POSITION = 20;
    }else if(params.POSITION == "员工") {
        params.POSITION = 10;
    }else {
        params.POSITION = '';
    }
    var array = [
        params.CODE,
        params.ORGID,
        params.NAME,
        params.RANK,
        params.ENTRY_TIME,
        params.POSITIVE_TIME,
        params.DEPARTURE_TIME,
        params.REMARKS,

        params.CLEI,
        params.CDEPT,
        params.CGROUP,
        params.CJBMONEY != '' ? parseInt(params.CJBMONEY) : 0,
        params.CGWMONEY != '' ? parseInt(params.CGWMONEY) : 0,
        params.CXCMONEY != '' ? parseInt(params.CXCMONEY) : 0,
        params.COTHERFOODMONEY != '' ? parseInt(params.COTHERFOODMONEY) : 0,
        params.CZWMONEY != '' ? parseInt(params.CZWMONEY) : 0,
        params.CDQMONEY != '' ? parseInt(params.CDQMONEY) : 0,
        params.COTHERSUBSIDY != '' ? parseInt(params.COTHERSUBSIDY) : 0,
        params.CJBMONEYSUM != '' ? parseInt(params.CJBMONEYSUM) : 0,
        params.POSITION,//主管，员工

        params.ID
    ];

    //console.log(array);
    oracle.update(builder.select("edit_info"), array, function (err, result){
        if (err)
        {
            //console.log(err)
            done(err, {"result_type":false});
        }
        else
        {
            done(err, {"result_type":true});
        }
    });
};
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
};

/**
 * 获得这个人的员工信息
 * @param handler
 * @param done
 * @param callback
 */
exports.getOneEmpInfoAction = function (handler, done, callback) {
    var params = handler.params
        ,id = params.id;

    oracle.query(builder.select("getOneEmpInfo"), [id], function (err, result) {
        if (err)
        {
            result = '';
            done(err, result);
        }
        else
        {
            done(err, result);
        }
    });
};
