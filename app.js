
/**
 * Module dependen11111122222cies.
 */

"use strict";

GLOBAL.light            = require("light-framework");
GLOBAL.light.model      = require("light-model");
GLOBAL.light.datarider  = require("light-model").datarider;

var http        = light.lang.http
  , app         = light.util.express()
  , middleware  = light.framework.middleware
  , loader      = light.framework.loader
  , log         = light.framework.log
  , helper      = light.framework.helper
  , errors      = light.framework.errors
  ;

/**
 * 初始化smartcore模块
 */
loader.initialize();

/**
 * 初始化express模块
 */
loader.express(app);

app.use(middleware.multipart);    // 对应文件上传
app.use(middleware.lang);         // 设定语言
app.use(middleware.authenticate); // 认证
app.use(middleware.csrfcheck);    // 校验CsrfToken
app.use(middleware.csrftoken);    // 生成CsrfToken
app.use(middleware.timeout);      // 设定超时
app.use(middleware.urlstamp);     // 设定URL变更标识

/**
 * 错误是重定向
 */
app.use(function(err, req, res, next){
  if (err.code == 401 && helper.isBrowser(req)) {
    log.warn(err);
    res.redirect("/site/login");
    return;
  }

  throw err;
});

/**
 * 预加载
 */
require("./controllers/user");

/**
 * 路由
 */
light.framework.route.api(app);
light.framework.route.website(app);
light.framework.route.redirect(app);
light.model.route.dispatch(app);

/**
 * 启动服务
 */
http.createServer(app).listen(app.get("port"), function(){
  log.info("Express server listening on port " + app.get("port"));
});
