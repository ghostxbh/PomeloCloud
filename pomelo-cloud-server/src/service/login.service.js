'use strict';
const FileService = require('./file.service');
const ServiceException = require('../core/exception/service.exception');
const DateUtil = require('../core/utils/date.util');
const {UserErrorCode} = require('../core/exception/biz-code');
const GlobleCache = require('../core/extend/cache/globle.chache');
const {
  CUSTOM_FILE_PATH,
  CUSTOM_OPERATION_FILE,
} = require('../domain/constants/file.constant');

/**
 * code by PomeloCloud
 * 登录业务类
 */
class LoginService {
  static login(username, password, req) {
    const user = FileService.readFile(CUSTOM_OPERATION_FILE.USERNAME, CUSTOM_FILE_PATH.CONFIG_DIR);
    const pwd = FileService.readFile(CUSTOM_OPERATION_FILE.PASSWORD, CUSTOM_FILE_PATH.CONFIG_DIR);
    if (user !== username || pwd !== password) {
      throw ServiceException.of(UserErrorCode.user_password_error);
    }
    const obj = {username, password, timestamp: DateUtil.getCurrentTimeStamp()};
    const token = GlobleCache.set(obj);
    req.session.token = token;
    req.session.user = obj;
    return token;
  }

  static logout(req, token) {
    if (GlobleCache.hasKey(token)) {
      GlobleCache.remove(token);
      delete req.session.user;
      delete req.session.token;
    }
    return 1;
  }
}

module.exports = LoginService;
