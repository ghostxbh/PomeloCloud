'use strict';
/**
 * code by PomeloCloud
 * 日期工具类
 */
const moment = require('moment');

module.exports = {
  /**
   * 获取当前日期
   * 格式：YYYY-MM-DD HH:mm:ss
   * @returns {string} date
   */
  general() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },

  /**
   * 获取当前精确日期
   * 格式：YYYY-MM-DD HH:mm:ss:SSS
   * @returns {string} date
   */
  accurate() {
    return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
  },

  /**
   * 获取当前年月日
   * 格式：YYYY-MM-DD
   * @returns {string} date
   */
  getDate() {
    return moment().format('YYYY-MM-DD');
  },

  /**
   * 获取当前时分秒
   * 格式：HH:mm:ss
   * @returns {string} time
   */
  getTime() {
    return moment().format('HH:mm:ss');
  },

  /**
   * 获取当前时间戳
   * @returns {number} timestamp
   */
  getCurrentTimeStamp() {
    return Date.now();
  },
};
