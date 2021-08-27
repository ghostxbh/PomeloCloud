'use strict';
/**
 * code by PomeloCloud
 * 文件服务类
 */
const fs = require('fs');
const os = require('os');
const ADMZIP = require('adm-zip');
const DateUtil = require('../util/date.util');
const CommonUtil = require('../util/common.util');
const {COMMON, FILE_COMMON} = require('../constant');
const PATH = FILE_COMMON.CONFIG_PATH + FILE_COMMON.FILE;
const DOWNLOAD_FILE_NMAE = DateUtil.getDate() + '_download.zip';
const logger = require('../config/log.config').logger();

const FileService = {
  /**
   * 获取文件列表
   * @param {string} path 路径 (default: file.json rootPath)
   * @param {any} options 选项
   * @return {[any]} 文件列表
   */
  fileList(path, options) {
    const {page} = options;
    let result = {};

    path = path ? path : FileCommon.readJSONFileData(PATH).rootPath;
    path = FileCommon.checkPath(path);

    const exists = fs.existsSync(path);
    if (exists) {
      let files = fs.readdirSync(path);
      if (page) {
        files = CommonUtil.pagination(page.pageNo, page.pageSize, files);
      }
      const fileList = FileCommon.getFileStats(files, path);
      result = {path, fileList};
    }
    return result;
  },

  /**
   * 写入文件
   * @param {any} file 文件
   * @param {string} path 写入路径
   */
  uploadFile(file, path) {
    if (file) {
      const name = file.originalname, uploadPath = process.cwd() + '/' + file.path;
      const interval = setInterval(function() {
        const isExists = fs.existsSync(uploadPath);
        if (isExists) {
          const body = fs.readFileSync(uploadPath);
          fs.writeFileSync(path + name, body);
          console.log('write file success！' + name);

          fs.unlinkSync(uploadPath);
          console.log('delete tmp file success！' + uploadPath);
          clearInterval(interval);
        }
      }, 3000);
    }
  },

  /**
   * 下载文件
   * @param {[string]} files 文件名数组
   * @param {string} path 路径
   * @return {{filePath: string, fileNmae: string}|any} 文件路径|文件名称
   */
  downloadFile(files = [], path) {
    const fileList = fs.readdirSync(path);
    const allFileStats = FileCommon.getFileStats(fileList, path);

    const getFilePath = () => {
      const result = {filePath: '', fileName: ''};
      if (files.length === allFileStats.length) {
        FileCommon.compressionToZip(allFileStats, path);
        result.fileName = DOWNLOAD_FILE_NMAE;
        result.filePath = path + DOWNLOAD_FILE_NMAE;
        return result;
      } else if (files.length === 1) {
        const name = files[0];
        const filePath = path + name;
        const fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
          fileStat.name = name;
          const oneFileName = `${ name }.zip`;
          FileCommon.compressionToZip([fileStat], path, oneFileName);
          result.fileName = oneFileName;
          result.filePath = path + oneFileName;
          return result;
        } else if (fileStat.isFile()) {
          result.fileName = name;
          result.filePath = path + name;
          return result;
        }
      } else if (files.length > 1) {
        const fileStats = FileCommon.getFileStatsByNames(files, allFileStats);
        FileCommon.compressionToZip(fileStats, path);
        result.fileName = DOWNLOAD_FILE_NMAE;
        result.filePath = path + DOWNLOAD_FILE_NMAE;
        return result;
      }
    };
    return getFilePath();
  },

  /**
   * 删除文件/文件夹
   * @param {[string]} files 文件名数组
   * @param {string} path 路径
   * @return {boolean}
   */
  removeFile(files = [], path) {
    files.forEach(file => {
      const filePath = path + file;
      const fileStat = fs.statSync(filePath);
      if (fileStat.isFile()) {
        fs.unlink(filePath, function(e) {
          if (e) throw e;
          logger.log('removeFile file: %s', file);
        });
      } else if (fileStat.isDirectory()) {
        fs.rmdir(filePath, {maxRetries: 10, recursive: true, retryDelay: 1000},
          function(e) {
            if (e) throw e;
            logger.log('removeFile dir: %s', file);
          });
      }
    });
    return true;
  },
};

const FileCommon = {
  /**
   * 压缩为zip文件
   * @param {[any]} files 文件数组
   * @param {string} path 路径
   * @param {string} name 文件名称
   */
  compressionToZip(files, path, name) {
    const zip = new ADMZIP();
    files.forEach((file) => {
      if (file.isFile()) {
        zip.addLocalFile(path + file.name);
      } else if (file.isDirectory) {
        zip.addLocalFolder(path + file.name, file.name);
      }
    });
    name = name ? name : DOWNLOAD_FILE_NMAE;
    fs.writeFileSync(path + name, zip.toBuffer());
  },

  /**
   * 通过文件名数组过滤文件状态数组
   * @param {[string]} fileNames 文件名数组
   * @param {[any]} fileStats 文件状态数组
   * @returns {[any]} 过滤后的文件状态数组
   */
  getFileStatsByNames(fileNames = [], fileStats = []) {
    const newFileStats = [];
    for (let i = 0; i < fileNames.length; i++) {
      const name = fileNames[i];
      for (let j = 0; j < fileStats.length; j++) {
        const stat = fileStats[j];
        if (stat.name === name) {
          newFileStats.push(stat);
          break;
        }
      }
    }
    return newFileStats;
  },

  /**
   *
   * @param {[string]} fileList 文件名称数组
   * @param {string} path 路径
   * @returns {[any]} 文件状态数组
   */
  getFileStats(fileList, path) {
    const newFileList = [];
    try {
      fileList.map(file => {
        let newFile = path ? fs.statSync(path + file) : fs.statSync(file);
        newFileList.push({...newFile, name: file});
      });
    } catch (e) {
      logger.error('%c getFileStats error:', 'color:#0f0;', e);
    }
    return newFileList;
  },

  /**
   * 读取JSON文件
   * @param {string} path 文件路径
   * @return {json} 文件数据
   */
  readJSONFileData: function(path) {
    let fileSync;
    // 根据不通系统获取文件流
    if (os.type() === COMMON.SYSTEM_VERSION.LINUX || os.type() === COMMON.SYSTEM_VERSION.MACOS) {
      fileSync = fs.readFileSync(path, {flag: 'r', encoding: 'utf8'});
    } else if (os.type() === COMMON.SYSTEM_VERSION.WINDOWS) {
      fileSync = fs.readFileSync(path, {flag: 'r'}).toString();
    }
    // 解析为JSON格式
    if (typeof fileSync === 'string') {
      fileSync = JSON.parse(fileSync);
    }
    return fileSync;
  },

  /**
   * 检查路径
   * @param {string} path 路径
   * @return {string|boolean} 检查路径
   */
  checkPath: function(path) {
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
};

module.exports = {FileService, FileCommon};
