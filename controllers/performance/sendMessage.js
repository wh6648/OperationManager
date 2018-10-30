"use strict";

var user         = light.model.user
    ,oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , builder     = light.framework.sqlbuilder
    , group         = light.model.group
    , auth        = light.model.auth;

/**
 * 生成短信验证码
 * @param handler
 * @param callback
 */
exports.createMessageAction = function (handler, callback) {

    var http = require('http');
    var querystring = require('querystring');
    //var type = handler.user.type;
    var type = 2;

    var params = handler.params
        ,name = params.name
        ,password = auth.sha256(params.password);

    //获得用户得电话号
    var getTel = function (done) {
        handler.addParams("condition", {"id": name,"password":password,"valid": 1});
        user.getList(handler, function(err, result) {
            if(err) {
                result = '';
                done(err, result);
            }else {
                done(err, result);
            }
        });
    };

    /**
     * 如果更新extend里面的字段，会把extend其他字段抹没
     * 所以，需要先取出extend里面的数据，改完之后，再存进去
     * @param done
     */

    //发送验证码
    var sendMessage = function (result, done) {

        if(result.totalItems > 0) {

            var phone = result.items[0].extend.telephone;

            //生成 6位 随机数
            var Max = 10,Min = 1;
            var Range = Max - Min;
            var Rand = Math.random()*90000+10000;
            var num = (Min + Math.round(Rand * Range));
            var time = 3;

            //console.log(num);

            var postData = {
                reg:'101100-WEB-HUAX-647181',
                pwd:'DCMMCVNV',
                sourceadd:'',
                phone:phone,
                content:"您本次的验证码为"+num+"，在"+time+"分钟内有效。【信风绩效考核】",
                type:'json'
            };

            var content = querystring.stringify(postData);

            var options = {
                host:'www.stongnet.com',
                path:'/sdkhttp/sendsms.aspx',
                method:'POST',
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length' :content.length
                }
            };

            var req = http.request(options, function(res) {
                console.log("Request began");
                res.setEncoding('utf8');
                var output = '';

                res.on('data', function (chunk) {
                    output += chunk;
                });

                res.on('end', function () {
                    console.log('Request complete:');
                    console.log(output);

                    var extend = result.items[0].extend;

                    extend.checkCode = num.toString();//验证码
                    extend.codeCreateTime = new Date();//获得验证码的时间
                    //extend.codeCreateTime = moment().format("YYYY-MM-DD hh:mm:ss");;//获得验证码的时间
                    var data = {extend: extend, type: type};

                    //将验证码存数据库中
                    user.update(handler.copy({data: data, id: result.items[0]._id.toString()}), function(err, result) {

                        if (err) {
                            console.log(err);
                            return callback(err);
                        }else {
                            //done(null, output);
                            result.trueSend = true;
                            done(null, result.trueSend);
                        }
                    });

                });
            });

            req.on('error', function (err) {
                console.log(err);
            });

            req.write(content);
            req.end();
        }else {
            result.trueSend = false;
            return done(null, result.trueSend);
        }

    };

    async.waterfall([getTel, sendMessage], callback);

};

/**
 * 修改这个用户的checkCode(清空)
 * @param handler
 * @param callback
 */
exports.resetCheckCodeAction = function (handler, callback) {
    var params = handler.params
        ,name = params.username
        ,password = auth.sha256(params.password);
    var type = 2;

    var getUserInfo = function (done) {
        handler.addParams("condition", {"id": name,"password":password,"valid": 1});
        user.getList(handler, function(err, result) {
            if(err) {
                result = '';
                done(err, result);
            }else {
                done(err, result);
            }
        });
    };

    var updateCheckCode = function (result, done) {

        if (result) {
            var extend = result.items[0].extend;
            extend.checkCode = "";//清空验证码
            var data = {extend: extend, type: type};

            //将验证码存数据库中
            user.update(handler.copy({data: data, id: result.items[0]._id.toString()}), function(err, results) {

                if (err) {
                    console.log(err);
                    result = '';
                    done(err, result);
                }else {
                    done(null, results);
                }
            });
        }else {
            result = '';
            done(null, result);
        }

    };

    async.waterfall([getUserInfo, updateCheckCode], callback);

};

/**
 * 获得用户属于哪个组
 * @param handler
 * @param callback
 */
exports.getUserGroupAction = function (handler, callback) {
    var params = handler.params
        ,id = params.id;

    var getUserInfo = function (done) {
        handler.addParams("condition", {"id": id,"valid": 1});
        user.getList(handler, function(err, result) {
            if(err) {
                done(err, {"result": false});
            }else {
                done(err, result);
            }
        });
    };

    var getUserGroup = function (result, done) {

        if (result.totalItems > 0) {
            var groupId = result.items[0].groups[0];
            handler.addParams("condition", {"_id": groupId,"valid": 1});
            group.getList(handler, function(err, result) {
                if(err) {
                    result = '';
                    done(err, result);
                }else {
                    done(err, result);
                }
            });
        }else {
            result = '';
            done(result);
        }

    };

    async.waterfall([getUserInfo, getUserGroup], callback);


};

/**
 * 获得用户的code时间
 * @param handler
 * @param callback
 */
exports.getUserCodeTimeAction = function (handler, done, callback) {
    var params = handler.params
        ,id = params.name;

    handler.addParams("condition", {"id": id,"valid": 1});
    user.getList(handler, function(err, result) {
        if(err) {
            result = '';
            done(err, result);
        }else {
            done(err, result);
        }
    });

};

/**
 * 催办
 * 给办事处主管发消息
 * @param handler
 * @param done
 * @param callback
 */
exports.setMessageForOfficeAction = function (handler, done, callback) {
    var params = handler.params
        ,orgId = params.orgId;
    var http = require('http');
    var querystring = require('querystring');

    //console.log(orgId);
    var getTel = function (done) {
        handler.addParams("condition", {"extend.orgid": orgId,"valid": 1});
        user.getList(handler, function(err, result) {
            if(err) {
                result = '';
                done(err, result);
            }else {
                done(err, result);
            }
        });
    };

    var setMessage = function (result, done) {
        var phone = result.items[0].extend.telephone;
        //console.log(phone);

        var postData = {
            reg:'101100-WEB-HUAX-647181',
            pwd:'DCMMCVNV',
            sourceadd:'',
            phone:phone,
            content:"请马上进行申报【信风绩效考核】",
            type:'json'
        };

        var content = querystring.stringify(postData);

        var options = {
            host:'www.stongnet.com',
            path:'/sdkhttp/sendsms.aspx',
            method:'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' :content.length
            }
        };

        var req = http.request(options, function(res) {
            console.log("Request began");
            res.setEncoding('utf8');
            var output = '';

            res.on('data', function (chunk) {
                output += chunk;
            });

            res.on('end', function () {
                console.log('Request complete:');
                console.log(output);
                done(null, output);
            });
        });

        req.on('error', function (err) {
            console.log(err);
        });

        req.write(content);
        req.end();
    };

    async.waterfall([getTel, setMessage], done);

};
