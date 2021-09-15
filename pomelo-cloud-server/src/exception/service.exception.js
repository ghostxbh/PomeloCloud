'use strict';
/**
 * code by PomeloCloud
 */
class ServiceException extends Error {
  constructor(
    code,
    message,
    message_cn,
    data,
  ) {
    super(message);
    this.code = code;
    this.message = message;
    this.message_cn = message_cn;
    this.data = data;
  }

  static create(code, message, message_cn) {
    return new ServiceException(code, message, message_cn);
  }

  static of({code, message, message_cn}) {
    return new ServiceException(code, message, message_cn);
  }

  static ofWithData({code, message, message_cn, data}) {
    return new ServiceException(code, message, message_cn, data);
  }
}

module.exports = ServiceException;
