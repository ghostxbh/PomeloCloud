'use strict';
/**
 * code by PomeloCloud
 * 请求响应工具类
 */
  //操作成功
const SUCCESS = 200,
  //操作失败
  FAILED = 500,
  //操作失败,异常编码
  EXCEPTION = 505,
  //参数校验失败
  VALIDATE_FAILED = 404,
  //未认证
  UNAUTHORIZED = 401,
  //未授权
  FORBIDDEN = 403,
  //返回结果
  RESULTLT_DATA = {code: SUCCESS, message: '操作成功'};

const ResponseUtil = {
  /**
   * 成功返回
   * @param {any} data 返回数据对象
   * @return {any | {code, message, data}} 数据集
   */
  success(data) {
    return {...RESULTLT_DATA, data};
  },

  /**
   * 返回分页成功数据
   * @param data
   * @return {{code, message}}
   */
  pageSuccess(data) {
    let result = {...RESULTLT_DATA};
    result.code = SUCCESS;
    result.message = '操作成功';
    let map = new Map();
    map.set('pageSize', data.pageSize);
    map.set('totalPage', data.totalPage);
    map.set('total', data.total);
    map.set('pageNo', data.pageNo);
    map.set('list', data.list);
    result.data = map;
    return result;
  },

  /**
   * 普通失败提示信息
   * @return {{code, message}}
   */
  failed(data) {
    let result = {...RESULTLT_DATA};
    result.code = FAILED;
    result.message = '操作失败';
    if (data) result.data = data;
    return result;
  },

  /**
   * 异常失败提示信息
   * @return {{code, message}}
   */
  exceptionFailed(message) {
    let result = {...RESULTLT_DATA};
    result.code = EXCEPTION;
    result.message = message;
    return result;
  },

  /**
   * 参数验证失败使用
   * @param message 错误信息
   * @return {{code, message}}
   */
  validateFailed(message) {
    let result = {...RESULTLT_DATA};
    result.code = VALIDATE_FAILED;
    result.message = message;
    return result;
  },

  /**
   * 未登录时使用
   * @param message 错误信息
   * @return {{code, message}}
   */
  unauthorized(message) {
    let result = {...RESULTLT_DATA};
    result.code = UNAUTHORIZED;
    result.message = '暂未登录或token已经过期';
    result.data = message;
    return result;
  },

  /**
   * 未授权时使用
   * @param message 错误信息
   * @return {{code, message}}
   */
  forbidden(message) {
    let result = {...RESULTLT_DATA};
    result.code = FORBIDDEN;
    result.message = '没有相关权限';
    result.data = message;
    return result;
  },

};

module.exports = ResponseUtil;
