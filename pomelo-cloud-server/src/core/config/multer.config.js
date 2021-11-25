'use strict';
/**
 * code by PomeloCloud
 * 文件上传解析配置
 */
const multer = require('multer');

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
