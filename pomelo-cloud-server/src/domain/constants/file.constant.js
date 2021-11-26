'use strict';
/**
 * code by PomeloCloud
 * 文件常量
 */

/**
 * 文件类型
 */
exports.FILE_TYPE = {
  FILE: 'file',
  FOLDER: 'folder',
  FOLDER_MAX: 'folder_max',
  FOLDER_LOCK: 'folder_lock',
  RECYCLE: 'recycle',
  LOG: 'log',

  PL: 'pl',
  INI: 'ini',
  TXT: 'txt',
  XML: 'xml',
  JSON: 'json',
  TEXT: 'text',

  SWF: 'swf',
  PDF: 'pdf',
  PPT: 'ppt',
  XLS: 'xls',
  XLSM: 'xls',
  XLSX: 'xls',
  DOC: 'word',
  DOCX: 'word',
  WORD: 'word',

  RM: 'rm',
  AVI: 'avi',
  BMP: 'bmp',
  CDR: 'cdr',
  MKV: 'mkv',
  MOV: 'mov',
  MP4: 'mp4',
  MPG: 'mpg',
  WMA: 'wma',
  WMV: 'wmv',
  RMVB: 'rmvb',
  WEBM: 'webm',
  MPEG: 'mpeg',
  GIF: 'gif',
  IMAGE: 'image',
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  WEBP: 'webp',
  IMAGE_ICO: 'image_ico',
  ICO: 'ico',
  ACCESS: 'access',

  ZIP: 'zip',
  TAR: 'tar',
  RAR: 'rar',
  COMPRESS: 'compress',

  APK: 'apk',
  CMD: 'cmd',

  SH: 'sh',
  PY: 'py',
  SQL: 'sql',
  LUA: 'lua',
  PHP: 'php',
  CSS: 'css',
  HTML: 'html',
  JAVA: 'java',
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
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
  CLIENT_PORT: 'client-port.pl',
  SERVER_PORT: 'server-port.pl',

  FILE_CONFIG: 'default.json',
};

exports.FILE_ENCODING = {
  utf8: 'utf8',
  gbk: 'gbk',
};
