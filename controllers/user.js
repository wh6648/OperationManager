/**
 * @file 用户controller
 * @author r2space@gmail.com
 * @module user
 */

"use strict";

var user        = light.model.user
  , group       = light.model.group
  , auth        = light.model.auth
  , setting     = light.model.setting
  , error       = light.framework.error
  , log         = light.framework.log
  , check       = light.framework.validator
  , response    = light.framework.response
  , async       = light.util.async

  , context     = light.framework.context
  , multiTenant = require("../node_modules/light-model/lib/company/multiTenant")
  , comp        = require("../node_modules/light-model/lib/company/ctrl_company")
  , constant    = require("../node_modules/light-model/lib/constant")

  , Ctrl      = light.framework.mongoctrl
  , Mixed     = light.util.mongoose.Schema.Types.Mixed
  ;

/**
 * @desc 添加用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的用户
 */
exports.add = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: add user", uid);

  if (check.getFunc('isEmpty')(params.id)) {
    return callback(new error.parameter.ParamError("user id is required"));
  }

  if (check.getFunc('isEmpty')(params.password)) {
    return callback(new error.parameter.ParamError("password is required"));
  }

  if (params.email && !check.getFunc('isEmail')(params.email)) {
    return callback(new error.parameter.ParamError("email is invalid"));
  }

  // 加密
  params.password = auth.sha256(params.password);
  handler.addParams("schemaName", "User");
  user.add(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finished: add user", uid);
    return callback(err, result);
  });
};

/**
 * @desc 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的用户
 */
exports.remove = function(handler ,callback) {

  log.debug("begin: remove user", handler.uid);

  user.remove(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: remove user", handler.uid);

    return callback(err, result);
  });
};

/**
 * @desc 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新的用户
 */
exports.update = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: update user", uid);

  if (check.getFunc('isEmpty')(params.id)) {
    return callback(new error.parameter.ParamError("user id is required"));
  }

  if (params.email && !check.getFunc('isEmail')(params.email)) {
    return callback(new error.parameter.ParamError("email is invalid"));
  }

  //handler.addParams("appName", "FRStoreCommunications");
  handler.addParams("schemaName", "User");
  user.update(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finished: update user", uid);

    return callback(err, result);
  });
};

/**
 * @desc 获取指定用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回指定用户
 */
exports.get = function(handler ,callback) {

  log.debug("begin: get user", handler.uid);

  user.get(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: get user", handler.uid);

    return callback(err, result);
  });
};

/**
 * @desc 获取用户一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户一览
 */
exports.getList = function(handler ,callback) {

  var params = handler.params
    , uid    = handler.uid;

  log.debug("begin: getList user", uid);

  var condition = params.condition || {};
  condition.valid = 1;

  if (params.keyword) {
    condition.$or = [{ "uid": new RegExp(params.keyword.toLowerCase(), "i") }];
  }

  handler.addParams("condition", condition);
  handler.addParams("order", "-updateAt");

  user.getList(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }

    log.debug("finish: getList user", uid);

    return callback(err, result);
  });
};

/**
 * 判断密码是否正确
 * @param hangler
 * @param callback
 */
exports.judgePass = function (handler, callback) {
  var params = handler.params
      ,id = params.name
      ,password = auth.sha256(params.password)
      , uid    = handler.uid;

  handler.addParams("condition", { id: id, valid: 1});

  user.getList(handler, function(err, result) {

    if (err) {
      log.error(err, uid);
      return callback(err);
    }else {
      if(result.items[0].password !== password) {
        result.truePass = false;
        return callback(err, result.truePass);
      }else {
        result.truePass = true;
        return callback(err, result.truePass);
      }
    }

    log.debug("finish: getList user", uid);
  });

};

/**
 * @desc Rest Password
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户
 */
exports.restPass = function(handler ,callback) {

  var params    = handler.params
    , uid       = handler.uid
    , type      = handler.user.type
    , id        = params.id
    , oldPass   = params.oldPass
    , newPass   = params.newPass
    , conPass   = params.conPass;

  log.debug("begin: Rest Password", uid);

  if (!oldPass) {
    return callback(new error.parameter.ParamError("Please old Password."));
  }

  if (!newPass) {
    return callback(new error.parameter.ParamError("Please new Password."));
  }

  if (newPass !== conPass) {
    return callback(new error.parameter.ParamError("Password doesn't match the confirmation."));
  }

  handler.addParams("name", id);
  handler.addParams("password", oldPass);
  user.isPasswordRight(handler, function (err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new error.parameter.ParamError("Old password isn't valid."));
    }

    if (result) {
      var data = {password: auth.sha256(newPass), type: type};
      user.update(handler.copy({data: data, id: result._id}), function(err, result) {

        if (err) {
          log.error(err, handler.uid);
          return callback(new error.parameter.ParamError("Rest Password is failed."));
        }

        delete result._doc.password; // 擦除密码
        log.debug("finished: Rest Password", uid);
        return callback(err, result);
      });
    } else {
      log.error(err, handler.uid);
      return callback(new error.parameter.ParamError("Old password isn't valid."));
    }
  });

};

/**
 * @desc Login
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.login = function(req, res) {
  simpleLogin(req, res, function(err, result) {
    return response.send(res, err, result);
  });

  /**
   * 基于Cookie，Session的简易登陆功能
   * 将用户信息保存到session当中
   * 用户ID保存到header中
   * @param {Object} req 请求
   * @param {Object} res 响应
   * @param {Function} callback 回调函数，验证成功返回用户信息
   */
  function simpleLogin (req, res, callback) {

    var handler = new context().bind(req, res);

    multiTenant.setTenantCode(req);
    handler.addParams("code", req.session.code);

    if (handler.params.domain) {
      comp.getByDomain(handler, function (err, compResult) {
        if (err) {
          return callback(err);
        }

        if (compResult) {

          handler.addParams("code", compResult.code);

          isPasswordRight(handler, function (err, userResult) {
            if (err) {
              return callback(err);
            }

            // 用户信息保存到session中
            req.session.user = userResult;
            req.session.code = compResult.code;

            // 将用户ID保存到头信息里，用于移动终端开发。
            res.setHeader(constant.HEADER_UID_NAME, userResult._id);

            callback(err, userResult);
          });
        } else {
          return callback(new error.http.BadRequest(__(handler, "company.error.notExist")));
        }
      });
    } else {
      isPasswordRight(handler, function (err, userResult) {
        if (err) {
          return callback(err);
        }

        // 用户信息保存到session中
        req.session.user = userResult;

        // 将用户ID保存到头信息里，用于移动终端开发。
        res.setHeader(constant.HEADER_UID_NAME, userResult._id);

        callback(err, userResult);
      });
    }
  };

  /**
   * @desc 检查用户名和密码是否匹配
   * @param {Object} handler 上下文对象
   *        handler.params :
   *          name
   *          password
   *          code
   * @param {Function} callback 回调函数，返回跟用户名和密码匹配的用户
   */
  function isPasswordRight(handler, callback) {

    /**
     * @desc 用户schema
     */
    var User = {
      id:       { type: String, description: "用户标识"}
      , outer:    { type: String, description: "外部ID，用户导入时使用" }
      , name:     { type: String, description: "用户称" }
      , password: { type: String, description: "密码" }
      , type:     { type: Number, description: "用户类型" }
      , groups:   { type: Array,  description: "所属组一览" }
      , roles:    { type: Array,  description: "所属角色一览" }
      , email:    { type: String, description: "电子邮件地址" }
      , lang:     { type: String, description: "语言" }
      , timezone: { type: String, description: "时区" }
      , status:   { type: String, description: "状态" }
      , extend:   { type: Mixed,  description: "扩展属性" }
      , valid:    { type: Number, description: "删除 0:无效 1:有效", default: constant.VALID }
      , createAt: { type: Date,   description: "创建时间" }
      , createBy: { type: String, description: "创建者" }
      , updateAt: { type: Date,   description: "最终修改时间" }
      , updateBy: { type: String, description: "最终修改者" }
    };

    handler.addParams("condition", { id: handler.params.name, valid: constant.VALID });
    new Ctrl(handler, constant.MODULES_NAME_USER, User).getOne(function (err, result) {
      if (err) {
        return callback(new error.db.Find());
      }

      // 用户不存在
      if (!result) {
        return callback(new error.db.NotExist());
      }

      // 用户密码不正确
      if (result.password !== auth.sha256(handler.params.password)) {
        return callback(new error.db.NotCorrect());
      }

      //验证码不正确
      if (result.extend.checkCode !== handler.params.random) {
        return callback(new error.db.NotExist());
      }

      // 把ID变成字符串
      result._doc._id = result._doc._id.toHexString();

      delete result._doc.password; // 擦除密码
      return callback(err, result);
    });
  };

};

/**
 * @desc Logout
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.logout = function(req, res) {

  auth.simpleLogout(req);
  return res.redirect("/site/login");
};


