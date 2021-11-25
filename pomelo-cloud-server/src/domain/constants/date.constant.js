'use strict';
/**
 * code by PomeloCloud
 * 日期常量
 */

exports.DATE_FORMAT = {
  /**
   * 日期时间
   * 2021-12-12 12:12:12
   */
  DATETIME_BAR: '{y}-{m}-{d} {h}:{i}:{s}',
  /**
   * 日期时间
   * 2021/12/12 12:12:12
   */
  DATETIME_SLASH: '{y}/{m}/{d} {h}:{i}:{s}',
  /**
   * 日期
   * 2021-12-12
   */
  DATE_BAR: '{y}-{m}-{d}',
  /**
   * 日期
   * 2021/12/12
   */
  DATE_SLASH: '{y}/{m}/{d}',
  /**
   * 时间
   * 12:12:12
   */
  TIME: '{h}:{i}:{s}',
};

exports.MOMENT_DATE_FORMAT = {
  DATETIME: 'YYYY-MM-DD hh:mm:ss',
  DATETIME_SLASH: 'YYYY/MM/DD hh:mm:ss',
  DATETIME_S: 'YYYY-MM-DD hh:mm:ss:SSS',
  DATE: 'YYYY-MM-DD',
  TIME: 'hh:mm:ss',
};
