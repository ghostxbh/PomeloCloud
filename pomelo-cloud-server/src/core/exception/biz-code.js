'use strict';
/**
 * code by PomeloCloud
 */
exports.BizErrorCode = {
  dir_path_error: {
    code: 414,
    message: 'dir path error',
    message_cn: '目录路径错误',
  },
  not_found_file: {
    code: 415,
    message: 'not found file',
    message_cn: '未找到文件',
  },
  read_file_error: {
    code: 416,
    message: 'read file error',
    message_cn: '读取文件错误',
  },
};

exports.UserErrorCode = {
  user_password_error: {
    code: 431,
    message: 'user password error',
    message_cn: '用户密码错误',
  },
  login_timeout: {
    code: 439,
    message: 'login timeout',
    message_cn: '登录超时',
  },
  token_invalid: {
    code: 438,
    message: 'token invalid',
    message_cn: 'Token失效',
  },
};
