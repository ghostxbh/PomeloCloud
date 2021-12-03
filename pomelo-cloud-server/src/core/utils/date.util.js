'use strict';
const moment = require('moment');
const {DATE_FORMAT, MOMENT_DATE_FORMAT} = require('../../domain/constants/date.constant');

/**
 * code by PomeloCloud
 * 日期工具类
 */
module.exports = {
  /**
   * 获取当前日期
   * 格式：YYYY-MM-DD hh:mm:ss
   * @returns {string} dateTime
   */
  general() {
    return moment().format(MOMENT_DATE_FORMAT.DATETIME);
  },

  /**
   * 获取当前日期
   * 格式：YYYY/MM/DD hh:mm:ss
   * @returns {string} dateTime
   */
  common() {
    return moment().format(MOMENT_DATE_FORMAT.DATETIME_SLASH);
  },

  /**
   * 获取当前精确日期
   * 格式：YYYY-MM-DD hh:mm:ss:SSS
   * @returns {string} date
   */
  accurate() {
    return moment().format(MOMENT_DATE_FORMAT.DATETIME_S);
  },

  /**
   * 获取当前年月日
   * 格式：YYYY-MM-DD
   * @returns {string} date
   */
  getDate() {
    return moment().format(MOMENT_DATE_FORMAT.DATE);
  },

  /**
   * 获取当前时分秒
   * 格式：hh:mm:ss
   * @returns {string} time
   */
  getTime() {
    return moment().format(MOMENT_DATE_FORMAT.TIME);
  },

  /**
   * 获取当前时间戳
   * @returns {number} timestamp
   */
  getCurrentTimeStamp() {
    return Date.now();
  },

  /**
   * 解析日期格式
   * @param time 时间
   * @param cFormat 格式
   * @return {string|null}
   */
  parseDateTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
      return null;
    }
    const format = cFormat || DATE_FORMAT.DATETIME_BAR;
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if ((typeof time === 'string')) {
        if ((/^[0-9]+$/.test(time))) {
          // support "1548221490638"
          time = parseInt(time);
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          time = time.replace(new RegExp(/-/gm), '/');
        }
      }

      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      return value.toString().padStart(2, '0');
    });
    return time_str;
  },
};
