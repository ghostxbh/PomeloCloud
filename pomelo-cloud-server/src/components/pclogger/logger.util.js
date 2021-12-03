'use strict';
const fs = require('fs');

/**
 * code by PomeloCloud
 * 日志工具类
 */
class LoggerUtil {
  static isRunInDocker() {
    return !!process.env.ISDOCKER;
  }

  static getLevelFromEnv() {
    const level = process.env.LOG_LEVEL;
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    if (levels.indexOf(level) < 0) {
      return null;
    }
    return level;
  }

  static getAppendersFromEnv() {
    const appenders = process.env.LOG_APPENDERS;
    if (appenders) {
      return appenders.split(',');
    }
    if (this.isRunInDocker) {
      return ['stdout', 'fileout'];
    }
    return null;
  }

  static judgePath(pathStr) {
    if (!fs.existsSync(pathStr)) {
      fs.mkdirSync(pathStr);
      console.log('createPath: ' + pathStr);
    }
  }
}

module.exports = LoggerUtil;
