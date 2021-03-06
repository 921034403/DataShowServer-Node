/**
 * Created by jerrewu on 2015/4/21.
 */


/****几种打log方式的主要场景
 * debug模块：适用开发的时候打印数据。方便本地调试的时候，对日志filter，并不需要在服务器上展示出来。但是如果确实有需要临时展示，可能通过改taf日志级别来实现。
 * console.log:适用次要log。无法filter，主要用于本地调试和服务器上没有必要持久存储的log
 *logger.error.error: 适用于比较重要的error log，会在服务器存储一段时间
 *logger.data.debug: 适用于比较重要的data log，会在服务器存储一段时间
 *
 * logger.error和logger.data两个日志方式是一样的，只不过文件名不一样。
 *一般的不需要创建远程log，如果确实有需要，请自行创建。例如本js的logger.access_log。会永久存储log.
 */




var logger = {};
exports = module.exports = logger;
var tafLogs = require('@taf/taf-logs');
var morgan = require("morgan");



/*错误日志存在本地就可以了，没有必要存远程。error是文件名
 var logger = require("./logger");
 logger.error.error("xxxx");
 */

logger.error =new tafLogs("TafDate","error");


/*
 关键的数据日志，希望保存几天的。data是文件名
 var logger = require("./logger");
 logger.data.debug("xxxx"); logger.data.warn("xx")等
 */
logger.data =new tafLogs("TafDate","data",{logTo : tafLogs.LogTo.Local});

logger.cdn = new tafLogs("TafDate","cdn");
logger.cdnerror = new tafLogs("TafDate","cdnerror");

/*
 以下代码打通morgan to taf log，需要打远程log，永久存储
 */
logger.access_log =new tafLogs("TafDate","access");

logger.pre_access = new tafLogs("TafDate","pre_access");

var morgan_taf = {};
morgan_taf.write = function(str)
{
 logger.access_log.debug(str.replace('\n',''));
}
logger.user = new tafLogs("TafDate","user");
logger.usererror = new tafLogs("TafDate","usererror");
morgan.token('pid', function(){return process.pid})

logger.morgan_taf_log = function()
{

 return morgan(':remote-user ":method :url" :status :res[content-length] ":referrer" ":user-agent" :response-time :pid',
     {
      stream:morgan_taf,
      skip: function (req, res) {return req.url== "/favicon.ico" }
     });
}

global.logger = logger;