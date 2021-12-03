'use strict';

/**
 * code by PomeloCloud
 * 全局上下文
 */
class Context {
  constructor(result) {
    if (result) {
      const {success, code, message, data = null} = result;
      this.success = success;
      this.code = code;
      this.message = message;
      this.data = data;
    }
  }

  setSuccess(success = true) {
    this.success = success;
    return this;
  }

  setCode(code = 200) {
    this.code = code;
    return this;
  }

  setMessage(message = 'ok') {
    this.message = message;
    return this;
  }

  setData(data = null) {
    this.data = data;
    return this;
  }

  setField(field, data) {
    if (field || data) {
      this[field] = data;
    }
    return this;
  }

  sendResult() {
    this.message = this.success ? this.message || '200 ok!' : this.message || 'unknow error!';
    return this;
  }

  sendSuccess() {
    this.code = this.code || 200;
    this.success = this.success || true;
    this.message = this.message || 'ok';
    this.data = this.data || null;
    return this;
  }

  sendError(e) {
    this.code = e.code || 505;
    this.success = e.success || false;
    this.message = e.message || 'unknow error';
    this.message_cn = e.message_cn || '未知错误';
    return this;
  }

  send403() {
    this.code = 403;
    this.success = false;
    this.message = '403 Forbidden!';
    return this;
  }

  send500() {
    this.code = 500;
    this.success = false;
    this.message = '500 Internal Server Error';
    return this;
  }

  static ok() {
    return new Context({success: true, code: 200, message: 'ok'});
  }

  static okByData(data) {
    return new Context({success: true, code: 200, message: 'ok', data});
  }

  static okByFields(fields = new Map()) {
    const ctx = new Context({success: true, code: 200, message: 'ok'});
    fields.map((v, k) => ctx.setField(k, v));
    return ctx;
  }

  static error(message = 'unknow error') {
    return new Context({success: false, code: 505, message});
  }

  static failByException(e) {
    return new Context({success: false, code: 505, message: e.message});
  }
}

module.exports = Context;
