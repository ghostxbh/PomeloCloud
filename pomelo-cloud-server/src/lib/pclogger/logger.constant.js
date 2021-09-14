'use strict';
/**
 * code by PomeloCloud
 * 日志变量类
 */
// 配置参考： https://log4js-node.github.io/log4js-node/layouts.html
module.exports = Object.freeze({
  LoggerPattern: '[%d] [%z] [%p] %c - %m',
  LoggerPatternWithColor: '[%d] [%z] [%p] %c - %m',
  // LoggerPatternWithColor: '%[[%d]%] %[[%z]%] %[[%p]%] %[%c%] - %m',
  MaxLogSize: Number(process.env.LOG_SIZE) || 20 * 1024 * 1024,
  Backups: Number(process.env.LOG_BACKUPS) || 10,
  Appenders: ['stdout', 'fileout'],
});
