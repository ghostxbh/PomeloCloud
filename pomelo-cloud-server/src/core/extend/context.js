'use strict';
/**
 * code by PomeloCloud
 */

const RESULT = Symbol('Context#result');

const Context = {
  get result() {
    if (!this[RESULT]) {
      this[RESULT] = {success: false};
    }
    return this[RESULT];
  },

  set result(result) {
    this[RESULT] = result;
  },

  setSuccess(success = true) {
    this.result.success = success;
    return this;
  },

  setCode(code = 200) {
    this.result.code = code;
    return this;
  },

  setMessage(message = 'ok') {
    this.result.message = message;
    return this;
  },

  setData(data = null) {
    this.result.data = data;
    return this;
  },

  setField(field, data) {
    if (field || data) {
      this.result[field] = data;
    }
    return this;
  },

  sendResult() {
    this.result.message = this.result.success ? this.result.message || '200 ok!' : this.result.message || 'unknow error!';
    return this.result;
  },

  sendSuccess() {
    this.result.code = this.result.code || 200;
    this.result.success = this.result.success || true;
    this.result.message = this.result.message || 'ok';
    this.result.data = this.result.data || null;
    return this.result;
  },

  sendError(e) {
    this.result.code = e.code || 505;
    this.result.success = e.success || false;
    this.result.message = e.message || 'unknow error';
    this.result.message_cn = e.message_cn || '未知错误';
    return this.result;
  },

  send403() {
    this.result.code = 403;
    this.result.success = false;
    this.result.message = '403 Forbidden!';
    return this.result;
  },

  send500() {
    this.result.code = 500;
    this.result.success = false;
    this.result.message = '500 Internal Server Error';
    this.result.message_cn = '服务异常';
    return this.result;
  },
};

module.exports = Context;
