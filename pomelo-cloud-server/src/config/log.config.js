'use strict';
/**
 * code by PomeloCloud
 */
const {ACTIVE} = require('../data/constant');
const active = process.env.ACTIVE;
const log4js = require('log4js');
const fs = require('fs');

const levels = {
  'trace': log4js.levels.TRACE,
  'debug': log4js.levels.DEBUG,
  'info': log4js.levels.INFO,
  'warn': log4js.levels.WARN,
  'error': log4js.levels.ERROR,
  'fatal': log4js.levels.FATAL
};

function judgePath(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log('createPath: ' + pathStr);
  }
}

log4js.configure({
  appenders: {
    out: {type: 'console'},
    dateLog: {
      // 设置类型为 dateFile
      type: 'dateFile',
      // 配置文件名为 app_log.log
      filename: 'logs/app_log',
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd.log',
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true,
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
    },
    dateJson: {
      // 设置类型为 dateFile
      type: 'dateFile',
      // 配置文件名为 app_log.log
      filename: 'logs/app_log',
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd.log',
      // 输出的日志文件名是都始终包含 pattern 日期结尾
      alwaysIncludePattern: true,
      // 配置 layout，此处使用自定义模式 pattern
      layout: {
        type: "pattern",
        // 配置模式，下面会有介绍
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
      },
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
    },
    appLog: {
      type: "file",
      filename: "logs/application.log",
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
    },
    appJson: {
      type: "file",
      filename: "logs/application.log",
      // 配置 layout，此处使用自定义模式 pattern
      layout: {
        type: "pattern",
        // 配置模式，下面会有介绍
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
      },
      // 指定编码格式为 utf-8
      encoding: 'utf-8',
    }
  },
  categories: {
    default: {
      appenders: ['out', 'dateLog'], level: 'info'
    },
    dateJson: {
      appenders: ['out', 'dateJson'], level: 'info'
    },
    singleLog: {
      appenders: ['out', 'appLog'], level: 'info'
    },
    singleJson: {
      appenders: ['out', 'appJson'], level: 'info'
    },
    console: {
      appenders: ['out'], level: 'info'
    },
  },
  // 替换 console.log
  replaceConsole: true
});

exports.logger = function (name) {
  return !name ? log4js.getLogger(name) : (!active ? log4js.getLogger('console') :
    (active === ACTIVE.TEST ? log4js.getLogger('singleJson') : log4js.getLogger()));
};

exports.use = function (app, level) {
  //加载中间件
  app.use(log4js.connectLogger(this.logger(), {
    level: levels[level] || levels['debug'],
    //格式化http相关信息
    format: ':method :url :status'
  }));
};
