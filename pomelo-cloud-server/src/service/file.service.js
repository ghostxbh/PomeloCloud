'use strict';
const fs = require('fs');
const os = require('os');
const AdmZip = require('adm-zip');
const logger = require('log4js').getLogger();
const DateUtil = require('../core/utils/date.util');
const FileUtil = require('../core/utils/file.util');
const {CommonUtil} = require('../core/utils/common.util');
const {BizErrorCode} = require('../core/exception/biz-code');
const ServiceException = require('../core/exception/service.exception');
const DOWNLOAD_FILE_NMAE = DateUtil.getDate() + '_download.zip';
const {SYSTEM_PLATFORM_ENV} = require('../domain/constants/system.constant');
const {DATE_FORMAT} = require('../domain/constants/date.constant');
const {
  FILE_TYPE,
  FILE_ENCODING,
  CUSTOM_FILE_PATH,
} = require('../domain/constants/file.constant');

/**
 * code by PomeloCloud
 * 文件业务类
 */
class FileService {
  static readFile(name, path, options) {
    let fileData;
    let filePath = path + name;
    filePath = filePath.indexOf('\\') > -1 ? filePath.replace(/\\/g, '/') : filePath;
    if (!fs.existsSync(filePath)) {
      throw ServiceException.of(BizErrorCode.not_found_file);
    }
    const fileBuffer = fs.readFileSync(filePath, FILE_ENCODING.utf8);
    if (options && options.conversionType) {
      switch (options.conversionType) {
        case FILE_TYPE.XML:
          break;
        case FILE_TYPE.JSON:
          break;
        case FILE_TYPE.INI:
          break;
        default:
          fileData = fileBuffer;
          break;
      }
    } else {
      fileData = fileBuffer.trim();
    }
    return fileData;
  }

  /**
   * 获取文件列表
   * @param {string} path 路径
   * @param {object} page 分页
   * @param {any} options 选项
   * @return {[any]} 文件列表
   */
  static fileList(path, page, options) {
    path = FileUtil.checkFilePath(path ? path : CUSTOM_FILE_PATH.FILE_DEFAULT_PATH);
    const exists = fs.existsSync(path);
    if (!exists) {
      throw ServiceException.of(BizErrorCode.dir_path_error);
    }
    let fileNames = fs.readdirSync(path);
    const fileTypes = fs.readdirSync(path, {withFileTypes: true});
    const {fileCount, folderCount} = this.summaryFileFolder(fileTypes);
    page.total = fileNames.length;
    fileNames = CommonUtil.pagination(page.pageNo, page.pageSize, fileNames);
    const fileList = this.getFileStat(fileNames, path);
    const result = {
      path, fileList, fileCount, folderCount,
      condition: {page: {...page}, options: {...options}},
    };
    return result;
  }

  /**
   * 汇总文件与目录数量
   * @param files {any[]} 文件数组
   * @returns {{folderCount: number, fileCount: number}}
   */
  static summaryFileFolder(files = []) {
    let fileCount = 0, folderCount = 0;
    files.map(f => {
      if (f.isFile()) fileCount++;
      if (f.isDirectory()) folderCount++;
    });
    return {fileCount, folderCount};
  }

  /**
   * 获取文件状态
   * @param fileNames {any[]} 文件名数组
   * @param path {string} 路径
   * @return any[]
   */
  static getFileStat(fileNames = [], path) {
    let fileStatList = [];
    const folderList = [];
    const fileList = [];
    fileNames.forEach(name => {
      const newFileStat = Object.create(null);
      const filePath = path ? path + name : path;
      if (!fs.existsSync(filePath)) {
        throw ServiceException.of(BizErrorCode.dir_path_error);
      }
      const fileStat = fs.statSync(filePath);
      newFileStat.name = name;
      newFileStat.lastUpdateTime = DateUtil.parseDateTime(fileStat.mtimeMs, DATE_FORMAT.DATETIME_SLASH);
      if (fileStat.isFile()) {
        newFileStat.isFile = true;
        newFileStat.size = fileStat.size;
        fileList.push(newFileStat);
      } else if (fileStat.isDirectory()) {
        newFileStat.isFolder = true;
        const childDir = fs.readdirSync(filePath) || [];
        newFileStat.size = childDir.length;
        folderList.push(newFileStat);
      }
    });
    fileStatList = [...folderList, ...fileList];
    return fileStatList;
  }

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
  }

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
  }

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
  }
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
      fileList.map(name => {
        let newFile = path ? fs.statSync(path + name) : fs.statSync(name);
        const updateTime = DateUtil.parseDateTime(newFile.mtimeMs);
        const isFile = newFile.isFile();
        const isFolder = newFile.isDirectory();
        newFileList.push({size: newFile.blksize, name, isFile, isFolder, updateTime});
      });
    } catch (e) {
      logger.error('getFileStats error:', e);
    }
    return newFileList;
  },

  filterFilePermission(fileList, path) {
    const newFileList = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const filePath = path ? path + file : file;
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        newFileList.push(file);
      } catch (e) {
        logger.info('%s not permission', file);
      }
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
};

module.exports = FileService;
