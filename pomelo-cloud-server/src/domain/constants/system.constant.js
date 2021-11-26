'use strict';
/**
 * code by PomeloCloud
 * 系统常量
 */
const os = require('os');
/**
 * 系统环境
 * @type {{LINUX: string, OS: string, WIN: string}}
 */
exports.SYSTEM_PLATFORM_ENV = {
  LINUX: 'linux',
  OS: 'darwin',
  WIN: 'win32',
};

/**
 * 系统平台用户路径
 * @type string
 */
const homedir = os.homedir() || '/home';
exports.SYSTEM_PLATFORM_USER_PATH = homedir.indexOf('\\') > -1 ? homedir.replace(/\\/g, '/') : homedir;

/**
 * 公共路径
 * @type {{DESKTOP: string, DOCUMENTS: string, DOWNLOADS: string, Trash_L: string, Trash_W: string, HOME: string}}
 */
exports.COMMON_PATH = {
  Home: '',
  Desktop: '/Desktop',
  Documents: '/Documents',
  Downloads: '/Downloads',
  Music: '/Music',
  Pictures: '/Pictures',
  Videos: '/Videos',
  Trash_L: '~/.local/share/Trash/',
  Trash_W: 'C:/Recycled',
  Computer: ''
};

