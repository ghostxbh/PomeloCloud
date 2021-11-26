'use strict';
/**
 * code by PomeloCloud
 * 文件工具类
 */
const fs = require('fs');
const {FILE_TYPE} = require('../../domain/constants/file.constant');

const FileUtil = {
  /**
   * 获取JSON文件数据
   * @param path 路径
   * @param names 文件名数组
   * @returns {*[]|any} 数据集合
   */
  getJsonFileData(path = '', names = []) {
    const result = [];
    if (path && names.length > 0) {
      names.forEach(name => result.push(this.readFile(path + name)));
    } else if (path) {
      return this.readFile(path);
    }
    return result;
  },
  getFileData(path) {
    return path ? fs.readFileSync(path).toString() : null;
  },
  checkFile(file) {
    if (typeof file === 'object') {
      for (const key in file) {
        file[key] = this.checkPath(file[key]);
      }
    } else if (typeof file === 'string') {
      file = this.checkPath(file);
    }
    return file;
  },
  parseFileSize(size) {
    size = parseInt(size, 10);
    if (isNaN(size)) {
      return '';
    }
    if (size > 1024 * 1024 * 1024 * 1024) {
      return (size / 1048576).toFixed(2) + ' TB';
    }

    if (size > 1024 * 1024 * 1024) {
      return (size / 1048576).toFixed(2) + ' GB';
    }

    if (size > 1024 * 1024) {
      return (size / 1048576).toFixed(2) + ' MB';
    }

    if (size > 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    }
    return size + ' B';
  },
  /**
   * 检查文件路径
   * @param {string} path 路径
   * @return {string|boolean} 检查路径
   */
  checkFilePath: function(path) {
    if (path) {
      // 替换\为/
      if (path.indexOf('\\') > -1) {
        path = path.replace(/\\/g, '/');
      }
      // 查看文件设置根目录是否为文件
      // 如果为文件，则设置路径为上一级目录路径
      if (!path.endsWith('/')) {
        const statSync = fs.statSync(path);
        if (statSync.isDirectory()) {
          path = path + '/';
          return path;
        }
        if (statSync.isFile()) {
          const lastIndexOf = path.lastIndexOf('/');
          path = path.substring(0, lastIndexOf);
          return path;
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
};

module.exports = FileUtil;
