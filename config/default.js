/**
 * @file 应用程序配置文件
 * @author r2space@gmail.com
 */

module.exports = {

    /**
     * 数据库连接信息
     */
    "db": {
        //"host": "121.42.49.28"          /* 数据库服务器地址 */
        "host": "192.168.7.142"          /* 数据库服务器地址 */
        , "port": 27017                 /* 数据库服务器端口 */
        , "dbname": "mongoDB"  /* 数据库名称 */
        , "pool": 5                     /* 连接池个数 */
        , "prefix": ""                  /* collection名的前缀 */
        , "user": "mongoUser"
        , "pass": "mongoUser"

        /**
         * 默认的collection名称前面会自动添加prefix
         * 如果需要指定自定义的名称，则可以在schema里明确指出
         */
        , "schema": {}
    }

    /**
     * Oracle连接信息
     */
    , "oracle": {
        "enable": true
        , "host": "192.168.7.222"       /* 正式－数据库服务器地址 */
        //, "host": "192.168.1.65"        /* 测试－数据库服务器地址 */
        , "port": 1521                  /* 数据库服务器端口 */
        , "dbname": "ORCL"              /* 数据库名称 */
        , "pool": 3                     /* 连接池个数 */
        , "user": "system"
        , "pass": "asdQWE123"             /* 正式密码 */
        //, "pass": "1234"                /* 测试密码 */
    }

  /**
   * 应用程序设定
   */
  , "app": {
      "port": 6001                  /* 应用程序端口 */
    , "views": "views"              /* ejs的模板存放位置，应用程序需要根据实际路径进行设定 */
    , "public": ""                  /* 静态文件的存放位置的父路径，即static的父路径 */
    , "static": "/static"           /* 静态文件的存放位置 */
    , "cookieSecret": "light#02"    /* cookie secret */
    , "sessionSecret": "light#02"   /* express的session secret */
    , "sessionKey": "light.sid#02"  /* express的session key */
    , "sessionTimeout": 1         /* Session超时时间，小时（24 * 30 即一个月） */
    , "tmp": "/tmp"                 /* 保存临时文件用路径（如上传文件等） */
    , "hmackey": "light"            /* sha256加密用key字符串 */
    , "timeout": 600                /* 请求超时时间（秒） */

    /**
     * 多客户相关设定
     */
    , "domain": {
      "multiTenant": "off"          /* 是否对应多客户 */
    }

    /**
     * 多国语言相关设定
     */
    , "i18n": {
        "cache": "memory"                  /* 缓存类型，现在只支持内存缓存 */
      , "defaultLang": "zh"                /* 缺省的语言 */
      , "langs": ["zh", "en"]
      }

    /**
     * 无需认证即可访问的资源列表
     */
    , "ignoreAuth": [

        /* 登陆，注册相关 */
        "^\/$"
      , "^\/simplelogin.*"
      , "^\/simplelogout.*"
      , "^\/login.*"
      , "^\/site/login.*"
      , "^\/register.*"
      , "^\/HealthCheck.*"

      , "^\/site/timeline.*"
      , "^\/performance/sendMessage.*"
      , "^\/performance/createMessage.*"
      , "^\/performance/resetMessage.*"
      , "^\/performance/getUserGroup.*"
      , "^\/performance/getUserCodeTime.*"

      , "^\/site/lyj_test.*"
      ]

    , "ignoreTimeout": [
        "/^\/file\/upload.*"
      ,"^\/site\/file\/add.json"
      ]
    }


    /**
     * 缓存定义
     */
  , cache: {
      enable: false                 /* 是否启用缓存 */
    , max: 500                      /* 缓存个数，缓存大小 */
    , maxAge: 60 * 24               /* 缓存有效实现 分 */
    , type: "memory"                /* 缓存类型 [memory | memcached] */
    }
  };
