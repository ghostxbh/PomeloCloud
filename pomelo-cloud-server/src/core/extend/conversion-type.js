'use strict';
const {DataModelType} = require('./number.type');

/**
 * code by PomeloCloud
 * 全局类型转换
 */
class ConversionType {
  static nodeParse(key, value) {
    let result = null;
    if (key.indexOf('_') > -1) {
      const type = key.split('_')[0];
      switch (type) {
        case DataModelType.BOOL:
          result = value === 'true';
          break;
        case DataModelType.INT:
          result = parseInt(value);
          break;
        default:
          result = value;
          break;
      }
    }
    return result;
  }
}

module.exports = ConversionType;
