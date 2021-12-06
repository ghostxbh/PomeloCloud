'use strict';
const fs = require('fs');
const {spawn} = require('child_process');
const logger = require('log4js').getLogger();
const {FILE_TYPE} = require('../../domain/constants/file.constant');

/**
 * @param hasRecentDir 返回已存在的最低层级目录
 * @param hasCreating 创建不存在的目录
 * @param lastDir 返回最后层级的目录
 * @type {{hasRecentDir: boolean, hasCreating: boolean, lastDir: boolean}}
 */
const CheckFileOptions = {hasRecentDir: false, lastDir: false, hasCreating: false};

/**
 * code by PomeloCloud
 * 文件工具类
 */
const FileUtil = {
  /**
   * 解析文件大小
   * @param {number} size 文件大小
   * @return {string} 转化后的文件大小
   */
  parseFileSize(size) {
    size = parseInt(size, 10);
    if (isNaN(size)) {
      return '';
    }
    if (size > 1024 * 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
    }

    if (size > 1024 * 1024 * 1024) {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }

    if (size > 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }

    if (size > 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    }
    return size + ' B';
  },
  /**
   * 检查文件路径
   * @param {string} path 路径
   * @param {object} options 选项
   * @return {string|boolean} 检查路径
   */
  checkFilePath: function(path, options = CheckFileOptions) {
    const {hasRecentDir, lastDir, hasCreating} = options;
    if (path) {
      // 替换\为/
      path = path.replace(/\\/g, '/');
      // 替换//为/
      path = path.replace(/\/\//g, '/');
      // 获取上一级目录路径
      if (lastDir) {
        const lastIndexOf = path.lastIndexOf('/');
        path = path.substring(0, lastIndexOf);
        return path;
      }

      // 获取存在的目录层级
      const directoryLevel = [];
      const splitArray = path.split('/');
      let len = 0;
      for (let i = splitArray.length - 1; i > -1; i--) {
        const lastItem = splitArray[splitArray.length - 1];
        const item = splitArray[i];

        let isFile = false;
        let link = '';
        if (item === lastItem) {
          isFile = lastItem.indexOf('.') > -1;
          link = path;
        } else {
          const index = path.length - len;
          link = path.substring(0, index);
        }
        len = len + item.length + 1;
        const exists = fs.existsSync(link);
        directoryLevel.push({exists, item, path: link, isFile});
      }

      // 返回已存在的最低层级的目录路径
      if (hasRecentDir) {
        for (const level of directoryLevel) {
          if (level.exists) {
            return level.path + '/';
          }
        }
      }

      // 如果不存在中间的某些目录，就补全确实的目录路径
      if (hasCreating) {
        const positiveArray = directoryLevel.reverse();
        for (let i = 0; i < positiveArray.length; i++) {
          const item = positiveArray[i];
          try {
            if (!item.exists && !item.isFile) {
              fs.mkdirSync(item.path);
            }
          } catch (e) {
            logger.error('[FileUtil] create (%f) error:', item.path, e);
          }
        }
      }

      // 如果该路径是文件夹，自动补全文件夹后的/，方便后续业务逻辑拼接路径
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        const lastChar = path.substring(path.length - 1, path.length);
        if (lastChar !== '/') {
          path += '/';
        }
      }
      return path;
    }
    return false;
  },
  getFileType(fileName) {
    if (fileName.indexOf('.') > -1) {
      const splitFileName = fileName.split('.');
      const fileFormat = splitFileName[splitFileName.length - 1];
      return fileFormat;
    }
    return FILE_TYPE.FILE;
  },

  spawn(...args) {
    return new Promise(resolve => {
      const proc = spawn(...args);
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
      proc.on('close', () => {
        resolve();
      });
    });
  },
};

module.exports = FileUtil;
