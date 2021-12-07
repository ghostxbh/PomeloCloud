'use strict';

/**
 * code by PomeloCloud
 * 全局类型
 */
const MAX_SAFE = Number.MAX_SAFE_INTEGER;
const MIN_SAFE = Number.MIN_SAFE_INTEGER;
const POSITIVE_OVER = Number.POSITIVE_INFINITY;
const NEGATIVE_OVER = Number.NEGATIVE_INFINITY;
const NOT_NUM = Number.NaN;

const NUMBER_TYPE = {
  INT: 0,
  LONG: 1,
  FLOAT: 2,
  DOUBLE: 3,
}

const XML_DATA_MODEL_TYPE = {
  /**
   * data type: Boolean
   */
  BOOLEAN: 'Boolean',
  /**
   * data type: Integer (32), max = 2147483647 (2^31-1); min = -2147483648(-2^31)
   */
  INT: 'Int',
  /**
   * data type: Long (64), max = 9223372036854775807 (2^63-1); min = -9223372036854775808 (-2^63)
   */
  LONG: 'Long',
  /**
   * data type: Float (32), max = 3.4028235E38 (2^128-1); min = 1.4E - 45 (-2^128)
   */
  FLOAT: 'Float',
  /**
   * data type: Double (64), max = 1.7976931348623157E308 (2^1024-1); min = 4.9E - 324 (2^-1074)
   */
  DOUBLE: 'Double',
  /**
   * data type: String
   */
  STRING: 'String',
  /**
   * data type: Variable
   */
  VARIABLE: 'Variable',
}
exports.DataModelType = XML_DATA_MODEL_TYPE;

let NumberType;


