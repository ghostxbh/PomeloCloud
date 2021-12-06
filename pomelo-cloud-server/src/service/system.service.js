'use strict';
const si = require('systeminformation');
const logger = require('log4js').getLogger();
const FileService = require('./file.service');
const FileUtils = require('../core/utils/file.util');
const {FILE_TYPE, CUSTOM_FILE_PATH} = require('../domain/constants/file.constant');

/**
 * code by PomeloCloud
 * 设置业务类
 */
class SystemService {
  static async getSystemInformatica() {
    try {
      const [system, osInfo, cpu, mem, blockDevices, versions] = await Promise.all([
        si.system(), si.osInfo(), si.cpu(), si.mem(),
        si.blockDevices(), si.versions(),
      ]);
      const computer = {
        system, osInfo, cpu, memory: mem, disk: blockDevices, versions,
      };
      const path = CUSTOM_FILE_PATH.CONFIG_DIR + 'system/device.json';
      FileUtils.checkFilePath(path, {hasCreating: true});
      FileService.saveFile(null, computer, path, {conversionType: FILE_TYPE.JSON});
      logger.info('[SystemService] save device success');
    } catch (e) {
      logger.error('[SystemService] save device error', e);
    }
  }
}

module.exports = SystemService;
