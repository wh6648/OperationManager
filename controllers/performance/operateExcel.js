/**
 * Created by lyj on 15-9-7.
 */
"use strict";
var oracle      = light.framework.oracleconn
    , async       = light.util.async
    , _           = light.util.underscore
    , moment      = light.util.moment
    , datarider   = light.datarider
    , setting     = light.model.setting
    , log         = light.framework.log
    , builder     = light.framework.sqlbuilder

    , context     = light.framework.context
    , officegen   =  require("officegen")      //excel导出导入需要
    , ejsExcel    = require("ejsExcel")      //ejsExcel导出导入需要
    , fs          = require('fs')
    , path        = require('path')
    , xlsx        = officegen ( 'xlsx' )
    , excel       = require('excel')
    , http        = require("http");


/**
 * 数据导出
 * 用的ejsExcel
 * 模版+数据
 * 适合导出复杂的excel
 * @param req
 * @param res
 */
exports.ejsExcelExport = function(req, res) {
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("lib/人员信息表-new.xlsx");

    //console.log("#######exlBuf:"+exlBuf);

    //文件名
    var fileName = _.str.sprintf('%s_%s.xlsx', '人员基本信息', moment().format("YYYYMMDDHHmmss"));

    //数据源
    //var data = [
    //    [{"dpt_des":"开发部","doc_dt":"2013-09-09","doc":"a001"}],
    //    [{"pt":"pt1","des":"des1","due_dt":"2013-08-07","des2":"2013-12-07"},{"pt":"pt1","des":"des1","due_dt":"2013-09-14","des2":"des21"}]
    //];

    var getData = function(done) {
        oracle.query(builder.select("exportEmployeeInfo"), [], function(err, result) {
            if (err) {
                console.log(err);
                done(err);
            }else {
                done(err,result);
            }
        });
    };

    var setExcel = function(data, done) {
        console.log("data:",data);
        console.log("date",new Date());
        //*******下到客户端*******
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(fileName));

        ejsExcel.renderExcelCb(exlBuf, data, function(exlBuf2){
            console.log("生成了.xlsx");
            done(null, exlBuf2);
            //res.end(exlBuf2);
        });
    };

    async.waterfall([getData, setExcel], function (err, result) {
        return res.end(result);
    });





    //用数据源(对象)data渲染Excel模板
    //ejsExcel.renderExcelCb(exlBuf, data, function(exlBuf2){
    //    console.log("生成test2.xlsx");
    //    fs.writeFileSync(fileName, exlBuf2);
    //});

};

/**
 * 人员信息excel
 * 给公司看的
 * @param req
 * @param res
 */
exports.ejsExcelExportForCompany = function(req, res) {
    //获得Excel模板的buffer对象
    var exlBuf = fs.readFileSync("lib/人员信息（公司）.xlsx");

    //文件名
    var fileName = _.str.sprintf('%s_%s.xlsx', '人员信息（公司）', moment().format("YYYYMMDDHHmmss"));

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
            oracle.query(builder.select("getCompanyBigTable"), [years, quarter], function (err, result) {

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

    var setExcel = function(data, done) {
        console.log("data:",data);
        console.log("date",new Date());

        //*******下到客户端*******
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(fileName));

        ejsExcel.renderExcelCb(exlBuf, data, function(exlBuf2){
            console.log("生成了.xlsx");
            done(null, exlBuf2);
        });
    };

    async.waterfall([getNowOperationTime, getCompanyAllEmpInfo, setExcel], function (err, result) {
        return res.end(result);
    });

};


/**
 * 数据导出
 * 用的officegen
 * 模版样式上不好弄
 * @param req
 * @param res
 */
exports.export = function(req, res) {
    var handler = new context().bind(req, res);
    var params = handler.params;

    //文件名
    var fileName = _.str.sprintf('%s_%s.xlsx', '人员基本信息', moment().format("YYYYMMDDHHmmss"));

    var xlsx = officegen ({
        'type': 'xlsx', // or 'xlsx', etc
        'onend': function ( written ) {
            console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
        },
        'onerr': function ( err ) {
            console.log ( err );
        }
    });

    //var out = fs.createWriteStream (fileName );

    //获得数据
    var getData = function (done) {
        //exports.em_info_get(handler, done);

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
    //写数据
    var writeFile = function (data, done) {
        //新建一个sheet工作表
        var sheet = xlsx.makeNewSheet ();
        //sheet工作表名称
        sheet.name = '人员基本信息';

        //写数据到excel
        sheet.data[0] = [
            "员工编号", "板块", "办事处","归属类",
            "姓名", "职级", "入职时间",
            "转正时间", "备注", "离职时间"
        ];

        var i = 1;

        //console.log("##########"+data);
        //console.log("##########",data.data);
        _.each(data.data, function(item) {

            console.log("####",item);
            sheet.data[i] = [];
            sheet.data[i][0] = item.CODE;           //员工编号
            sheet.data[i][1] = item.NAME2;          //板块
            sheet.data[i][2] = item.O_NAME;         //办事处
            sheet.data[i][3] = '';                  //归属类
            sheet.data[i][4] = item.NAME;           //姓名
            sheet.data[i][5] = item.RANK;           //职级
            sheet.data[i][6] = item.ENTRY_TIME ? moment(item.ENTRY_TIME).subtract('hours', 8).format("YYYY/MM/DD HH:mm") : '';     //入职时间
            sheet.data[i][7] = item.POSITIVE_TIME ? moment(item.POSITIVE_TIME).subtract('hours', 8).format("YYYY/MM/DD HH:mm") : '';  //转正时间
            sheet.data[i][8] = item.REMARKS;        //转正
            sheet.data[i][9] = item.DEPARTURE_TIME ? moment(item.DEPARTURE_TIME).subtract('hours', 8).format("YYYY/MM/DD HH:mm") : ''; //离职日期

            i++;

        });

        //*******下到客户端*******
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(fileName));
        done(null, xlsx)

    };

    async.waterfall([getData, writeFile], function (err, xlsx) {
        return xlsx.generate(res);
    });



    //两种绑定数据的方式
    // 1.Using setCell:
    //sheet.setCell ( 'E7', 340 );
    //sheet.setCell ( 'G102', 'Hello World!' );
    //// 2.Direct way:
    //sheet.data[0] = [];
    //sheet.data[0][0] = 1;
    //sheet.data[0][1] = 2;
    //sheet.data[1] = [];
    //sheet.data[1][3] = 'abc';

    //*******下到服务器端*******
    //xlsx.generate ( out, {
    //    'finalize': function ( written ) {
    //        console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
    //    },
    //    'error': function ( err ) {
    //        console.log ( err );
    //    }
    //} );

    //res.writeHead(200, {
    //    'Content-Type': 'application/force-download',
    //    'Content-Disposition': 'attachment; filename=test.rar'
    //});

};

/**
 * 数据导入
 * @param handler
 * @param done
 * @param callback
 */
exports.import = function(handler, done, callback) {
    var params = handler.params
        , file = params.files[0];

    /**
     * 有用的－先注了
     * @lyj
     * 练习完善人员信息表字段
     */

    //excel(file.path, function (err, data) {
    //    if (err) {
    //        return callback(err);
    //    } else {
    //        data.shift();
    //        var count = 0;
    //        var errors = [];
    //        var parentGids = {};
    //        log.info("数据行数：" + data.length);
    //        //console.log("####",data);
    //        var aa,bb,cc;
    //
    //        var dd = new Array();
    //        for(var i = 1; i < data.length; i++){
    //            //匹配数据库字段顺序
    //            if(data[i][18] != "") {
    //                aa = data[i][18].replace(/\./gi,'-');
    //                data[i][18] = moment(aa).format("YYYY-MM-DD");
    //            }
    //            if(data[i][19] != "") {
    //                bb = data[i][19].replace(/\./gi,'-');
    //                data[i][19] = moment(bb).format("YYYY-MM-DD");
    //            }
    //            if(data[i][21] != "") {
    //                cc = data[i][21].replace(/\./gi,'-');
    //                data[i][21] = moment(cc).format("YYYY-MM-DD");
    //            }
    //            dd[i-1] = [
    //                data[i][1],data[i][2],data[i][3],//部门、组、类
    //                data[i][5],data[i][6],data[i][7],//职级、几本工资、岗位工资
    //                data[i][8],data[i][9],data[i][10],//现场工资、其他餐补、驻外津贴
    //                data[i][11],data[i][12],data[i][13],//地区补差、其他补贴、几本薪资总计   ＊＊＊＊＊
    //                data[i][14],data[i][15],data[i][16],//职级、职级工资总计、工资增加
    //                data[i][17],data[i][18],data[i][19],//月收入增加、入职日期、转正日期
    //                data[i][20],data[i][21],data[i][4]//备注、离职日期、名字
    //            ]
    //        }
    //
    //        //console.log(dd);
    //
    //        oracle.updates(builder.select("updateAllEmpInfo"), dd, function (err, result) {
    //            if(err) {
    //                console.log("########1111",err);
    //                done(err, result);
    //            }else {
    //                console.log("########2222");
    //                done(err, result);
    //            }
    //        });
    //
    //    }
    //});

    excel(file.path, function (err, data) {

        if (err) {
            return callback(err);
        } else {
            // delete the header
            data.shift();
            var count = 0;
            var errors = [];
            var parentGids = {};
            log.info("数据行数：" + data.length);
            //console.log("####",data);

            //各种逻辑
            /**
             * step1.首先将员工信息表valid字段都设置成 0 －代表逻辑删除状态
             * step2.判断这条数据是否在表中存在，
             *      》如果存在，update更新表中的这条数据，并将valid 改成 1
             *      》如果不存在，insert插入这条数据
             */

            //step1
            var updateValid = function (done) {
                // >3说明有数据
                if(data.length > 3) {
                    oracle.query(builder.select("updateEmployeeInfoValid"), [], function(err, result) {
                        if (err)
                        {
                            return callback;
                            //done(err, {"result": false});
                        }
                        else
                        {
                            done(err, {"result": true});
                        }
                    });
                }
            };

            //step2
            var updateOrInsert = function (result, done) {

                if(result.result === true) {
                    var paramsValuesUpate = new Array();
                    var paramsValuesInsert = new Array();

                    var m = 0
                        ,n = 0;
                    (function  iterator(index){
                        var item = data[index];
                        //console.log("####", item);

                        if(index == data.length )
                        {
                            //执行插入或更新
                            insertValue(paramsValuesInsert, callback);
                            updateValue(paramsValuesUpate, callback);
                            return;
                        }

                        var code
                            , name
                            , entry_time
                            , positive_time
                            , departure_time
                            , remarks;

                        code = item[0];
                        name = item[2];
                        entry_time = item[13];
                        positive_time = item[14];
                        departure_time = item[16];
                        remarks = item[15];

                        oracle.query(builder.select("searchEmployeeHave"), [code], function (err, result) {

                            var num = result[0].NUM;
                            if (err) {
                                console.log(err);
                                return callback;
                            }
                            if (num == 0) {
                                console.log("#######insert");
                                paramsValuesInsert[m] = [code, name, entry_time, positive_time, departure_time, remarks];
                                m++;
                                iterator(++index);
                            } else {
                                console.log("#######update");
                                paramsValuesUpate[n] = [name,entry_time,positive_time,departure_time,remarks,code];
                                n++;
                                iterator(++index);
                            }
                        });

                    })(3);

                } else {
                    return callback;
                }

            };

            var insertValue = function(dataValue, callback) {

                //console.log("$$$$$$insert",dataValue);
                callback = callback || function () {};
                console.log("$$$$$$insert",dataValue);
                //不存在insert
                oracle.inserts(builder.select("insertEmployeeInfo"), dataValue, function (err, result) {
                    if (err) {
                        done(err, {"result": false});
                    }
                    else {
                        //callback();
                        done(err, {"result": true});
                    }
                });

            };
            var updateValue = function(dataValue, callback) {

                callback = callback || function () {};
                //存在update
                oracle.updates(builder.select("updateEmployeeInfo"), dataValue, function (err, result) {
                    if (err) {
                        //return callback;
                        done(err, {"result": false});
                    }
                    else {
                        callback();
                        //done(err, {"result": true});
                    }
                });
            };

            async.waterfall([updateValid, updateOrInsert], callback);
        }

    });

};





