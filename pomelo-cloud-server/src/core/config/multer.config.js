'use strict';
const multer = require('multer');

/**
 * code by PomeloCloud
 * 文件上传解析配置
 */
class MulterConfig {
  static storage() {
    return multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, process.cwd() + '/tmp/');
      },
      fileName: function(req, file, cb) {
        cb(null, file.fieldname);
      },
    });
  }
}

module.exports = MulterConfig;
