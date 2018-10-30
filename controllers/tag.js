/**
 * @file Tag controller
 * @author r2space@gmail.com
 * @module tag
 */

"use strict";

var tag = light.model.tag
  , log = light.framework.log;

/**
 * @desc 添加Tag
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的Tag
 */
exports.add = function(handler ,callback) {

  log.debug("begin: add tag", handler.uid);

  tag.add(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: add tag", handler.uid);
    return callback(err, result);
  });
};

/**
 * @desc 删除Tag
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的Tag
 */
exports.remove = function(handler ,callback) {

  log.debug("begin: remove tag", handler.uid);

  tag.remove(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finished: remove tag", handler.uid);

    return callback(err, result);
  });
};

/**
 * @desc 获取Tag一览
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回Tag一览
 */
exports.getList = function(handler ,callback) {

  log.debug("begin: getList tag", handler.uid);

  handler.addParams("condition", { valid: 1 });
  handler.addParams("order", "name");

  tag.getList(handler, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(err);
    }

    log.debug("finish: getList tag", handler.uid);

    return callback(err, result);
  });
};