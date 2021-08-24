'use strict';
/**
 * code by PomeloCloud
 * 文件服务类
 */
const fs = require('fs');
const os = require('os');
const JSZIP = require('jszip');
const DateUtil = require('../util/date.util');
const CommonUtil = require('../util/common.util');
const {COMMON, FILE_COMMON} = require('../constant');
const PATH = FILE_COMMON.CONFIG_PATH + FILE_COMMON.FILE;
const DOWNLOAD_FILE_NMAE = DateUtil.getDate() + '_download.zip';


const FileService = {
  /**
   * 获取文件列表
   * @param {string} path 路径 (default: file.json rootPath)
   * @param {any} options 选项
   * @return [fileList]
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
      const fileList = FileCommon.formatFileType(files, path);
      result = {path, fileList};
    }
    return result;
  },

  /**
   * 写入文件
   * @param {any} file 文件
   * @param {string} path 写入路径
   */
  writeFile(file, path) {
    if (file) {
      const name = file.originalname, uploadPath = process.cwd() + '/' + file.path;
      const interval = setInterval(function () {
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
   * @param [string] files 文件名数组
   * @param {string} path 路径
   * @return {{filePath: string, fileNmae: string}|undefined}
   */
  downloadFile(files = [], path) {
    const fileList = fs.readdirSync(path);
    const allFiles = FileCommon.getFileStat(fileList, path);

    const getFilePath = () => {
      const result = {filePath: '', fileNmae: ''};
      if (files.length < 1 || files.length === allFiles.length) {
        const dupFiles = FileCommon.deleteDuplicate(allFiles);
        FileCommon.compression(dupFiles, path);
        result.fileNmae = DOWNLOAD_FILE_NMAE;
        result.filePath = path + DOWNLOAD_FILE_NMAE;
        return result;
      } else if (files.length === 1) {
        const name = files[0];
        const filePath = path + name;
        const fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
          const dirPath = `${filePath}${name}/`;
          const fileNmae = `${name}.zip`;
          const getFiles = fs.readdirSync(dirPath);
          const directory = FileCommon.getFileStat(getFiles, dirPath);

          FileCommon.compression(directory, dirPath, fileNmae);
          result.fileNmae = fileNmae;
          result.filePath = dirPath + result.DOWNLOAD_FILE_NMAE;
          return result;
        } else if (fileStat.isFile()) {
          result.DOWNLOAD_FILE_NMAE = name;
          result.filePath = path + name;
          return result;
        }
      } else if (files.length > 1) {
        const readFiles = [];
        files.forEach(file => {
          if (typeof file === 'object') {
            readFiles.push(file);
          } else if (typeof file === 'string') {
            const readFile = FileCommon.getReadFile(file, allFiles);
            if (readFile) readFiles.push(readFile);
          }
        });
        FileCommon.compression(readFiles, path, DOWNLOAD_FILE_NMAE);
        result.fileNmae = DOWNLOAD_FILE_NMAE;
        result.filePath = path + DOWNLOAD_FILE_NMAE;
        return result;
      }
    };

    if (files.length === 1) {
      return getFilePath();
    }

    const isExists = fs.existsSync(path + DOWNLOAD_FILE_NMAE);
    if (isExists) {
      fs.unlink(path + DOWNLOAD_FILE_NMAE, function (e) {
        if (e) throw e;
        console.log('delete old file: ' + path + DOWNLOAD_FILE_NMAE);
        return getFilePath();
      });
    } else {
      return getFilePath();
    }
  },

  /**
   * 删除文件/文件夹
   * @param [string] files 文件名数组
   * @param {string} path 路径
   * @return {boolean}
   */
  remove(files = [], path) {
    files.forEach(file => {
      const filePath = path + file;
      const fileStat = fs.statSync(filePath);
      if (fileStat.isFile()) {
        fs.unlink(filePath, function (e) {
          if (e) throw e;
          console.log('delete file: ' + file);
        });
      } else if (fileStat.isDirectory()) {
        fs.rmdir(filePath, {maxRetries: 10, recursive: true, retryDelay: 1000},
          function (e) {
            if (e) throw e;
            console.log('delete dir: ' + file);
          });
      }
    });
    return true;
  },

  getFileData(path = '', names = []) {
    const result = [];
    if (path && names.length > 0) {
      names.forEach(name => result.push(FileCommon.readFile(path + name)));
    } else if (path) {
      return FileCommon.readFile(path);
    }
    return result;
  },
  checkFile(file) {
    if (typeof file === 'object') {
      for (const key in file) {
        file[key] = FileCommon.checkPath(file[key]);
      }
    } else if (typeof file === 'string') {
      file = FileCommon.checkPath(file);
    }
    return file;
  },
};

const FileCommon = {
  pushZip(floder, files, path) {
    const zip = new JSZIP();
    files.forEach((dirent, index) => {
      let filePath = `${floder.root ? path + floder.root : path}${dirent.name}`;
      if (dirent.isDirectory()) {
        let zipFloder = zip.folder(filePath.replace(path, ''));
        const getFiles = fs.readdirSync(filePath);
        const childrenFiles = FileCommon.getFileStat(getFiles, filePath);

        FileCommon.pushZip(zipFloder, childrenFiles, path);
      } else {
        floder.file(dirent.name, fs.readFileSync(filePath));
      }
    });
  },
  compression(files, path, fName) {
    const filePath = fName ? path + fName : path + DOWNLOAD_FILE_NMAE;
    const zip = new JSZIP();
    FileCommon.pushZip(zip, files, path);
    zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    }).then(function (content) {
      fs.writeFile(filePath, content, err => {
        if (err) throw err;
        console.log('compression done!');
      });
    });
  },
  deleteDuplicate(files) {
    let index = -1;
    files.forEach((file, i) => {
      if (typeof file === 'object') {
        if (file.name === DOWNLOAD_FILE_NMAE) index = i;
      } else if (typeof file === 'string') {
        if (file === DOWNLOAD_FILE_NMAE) index = i;
      }
    });
    files.splice(index, index + 1);
    return files;
  },

  getReadFile(fName, fileArr = []) {
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      if (file.name === fName) {
        return file;
      }
    }
    return false;
  },

  formatFileType(fileList, path) {
    const newFileList = [];
    try {
      fileList.map(file => {
        const newFile = fs.statSync(path + file);
        newFileList.push({...newFile, name: file});
      });
    } catch (e) {
      console.error('formatFileType: ', e);
    }
    return newFileList;
  },

  getFileStat(fileList, path) {
    const allFiles = [];
    fileList.map(file => {
      let newFile = path ? fs.statSync(path + file) : fs.statSync(file);
      if (newFile) {
        newFile.name = file;
      } else {
        return;
      }
      allFiles.push(newFile);
    });
    return allFiles;
  },

  /**
   * 读取JSON文件
   * @param {string} path 文件路径
   * @return {json} fileData
   */
  readJSONFileData: function (path) {
    let fileSync;
    // 根据不通系统获取文件流
    if (os.type() === COMMON.SYSTEM_VERSION.LINUX || os.type() === COMMON.SYSTEM_VERSION.MACOS) {
      fileSync = fs.readFileSync(path, {flag: 'r', encoding: "utf8"});
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
   * @return {string|boolean} path
   */
  checkPath: function (path) {
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
