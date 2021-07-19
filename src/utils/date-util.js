'use strict';
/**
 * code by PomeloCloud
 */
const moment = require('moment');

/**
 * 获取当前日期
 * 格式：YYYY-MM-DD HH:mm:ss
 * @returns {string} date
 */
function general() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取当前精确日期
 * 格式：YYYY-MM-DD HH:mm:ss:SSS
 * @returns {string} date
 */
function accurate() {
  return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
}

/**
 * 获取当前年月日
 * 格式：YYYY-MM-DD
 * @returns {string} date
 */
function YYMMDD() {
  return moment().format('YYYY-MM-DD');
}

module.exports = {
  general, accurate, YYMMDD,
}
;
