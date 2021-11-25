'use strict';
/**
 * code by PomeloCloud
 * 文件常量
 */

/**
 * 文件类型
 */
exports.FILE_TYPE = {
  INI: 'ini',
  XML: 'xml',
  PL: 'pl',
  JSON: 'json',
  TXT: 'txt',
};

// 根路径
function PCRootPath() {
  let serverRootPath = process.cwd();
  serverRootPath = serverRootPath.indexOf('\\') > -1 ? serverRootPath.replace(/\\/g, '/') : serverRootPath;
  return serverRootPath.substring(0, serverRootPath.lastIndexOf('/'));
}

/**
 * 自定义路径
 */
exports.CUSTOM_FILE_PATH = {
  ENV_DIR: PCRootPath() + '/environment/',
  CONFIG_DIR: PCRootPath() + '/config/',
  FILE_DEFAULT_PATH: '/',
};

exports.CUSTOM_OPERATION_FILE = {
  USERNAME: 'username.pl',
  PASSWORD: 'password.pl',
  ADMIN_VERIFY: 'admin_verify.pl',
};

exports.FILE_ENCODING = {
  utf8: 'utf8',
};
