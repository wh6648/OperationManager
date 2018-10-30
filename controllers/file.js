/**
 * @file 管理画面File的controller
 * @author sl_say@hotmail.com
 * @module admin.controllers.ctrl_file
 */

"use strict";

var file        = light.model.file
  , log         = light.framework.log
  , context     = light.framework.context
  , check       = light.framework.validator;

/**
 * @desc 添加文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的用户
 */
exports.add = function (handler, callback) {

  log.debug("begin: add file.",  handler.uid);

  file.add(handler, function (err, result) {

    if (err) {
      log.error(err,  handler.uid);
      return callback(err);
    }

    log.debug("finished: add file",  handler.uid);
    callback(err, result);
  });
};

exports.getFile = function (req, res) {

  var handler = new context().bind(req, res);

  var params = handler.params
    , uid = handler.uid
    , fileId = params.fileId;

  log.debug("begin: get file data.", uid);
  log.debug("file id:" + fileId, uid);

  if (check.getFunc('isEmpty')(fileId)) {
    return res.send(404);
  }
    handler.addParams("id", fileId);

  file.getFile(handler, function (err, data) {

    // 返回错误信息
    if (err) {
      return res.send(404);
    }

    log.debug("finished:  get file data.", uid);

    res.setHeader("Content-Type", data.contentType);
    res.setHeader("Content-Length", data.length);

    var expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 24 * 365 * 1000);
    res.setHeader("Expires", expires.toUTCString());
    res.setHeader("Cache-Control", "public, max-age=" + 60 * 60 * 24 * 365);
    res.setHeader("Last-Modified", data.uploadDate);

    return res.send(data.fileData);

  });
};