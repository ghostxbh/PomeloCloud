'use strict';
/**
 * code by PomeloCloud
 * 日志配置类
 */

const log4js = require('log4js');
const LoggerUtil = require('./logger.util');
const {
  LoggerPattern,
  LoggerPatternWithColor,
  MaxLogSize,
  Backups,
  Appenders,
} = require('./logger.constant');
const pattern = LoggerUtil.isRunInDocker() ? LoggerPattern : LoggerPatternWithColor;
const level = LoggerUtil.getLevelFromEnv() || 'debug';
const appenders = LoggerUtil.getAppendersFromEnv() || Appenders;

class LoggerConfig {
  static init(filename) {
    log4js.configure({
      appenders: {
        stdout: {
          type: 'stdout', layout: {pattern, type: 'pattern'},
        },
        fileout: {
          maxLogSize: MaxLogSize,
          backups: Backups,
          filename,
          pattern: 'yyyy-MM-dd.log',
          type: 'file',
          layout: {
            type: 'pattern',
            pattern,
          },
        },
      },
      categories: {
        default: {appenders, level},
        app: {appenders, level},
      },
      // 替换 console.log
      replaceConsole: true,
      disableClustering: true,
    });
  }

  static logger(name) {
    return !name ? log4js.getLogger(name) : log4js.getLogger();
  }
}

module.exports = LoggerConfig;
