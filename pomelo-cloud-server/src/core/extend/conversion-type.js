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
        case DataModelType.INT32:
          result = parseInt(value);
          break;
        case DataModelType.VECTOR_BOOL:
          if (value.indexOf(',') > -1) {
            const array = [];
            const split = value.split(',') || [];
            split.forEach(s => array.push(s === 'true'));
            result = array;
          }
          break;
        case DataModelType.VECTOR_DOUBLE:
          if (value.indexOf(',') > -1) {
            const array = [];
            const split = value.split(',') || [];
            split.forEach(s => array.push(s));
            result = array;
          }
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
