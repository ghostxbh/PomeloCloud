'use strict';
/**
 * code by PomeloCloud
 */
module.exports = Object.freeze(
  {
    COMMON: {
      SYSTEM_VERSION: {
        LINUX: 'Linux',
        MACOS: 'Darwin',
        WINDOWS: 'Windows_NT',
      }
    },
    FILE_COMMON: {
      CONFIG_PATH: `${process.cwd()}/configuration/`,
      FILE: 'file.json',
      CONFIG_LIST: [
        'file.json',
      ]
    },
  }
);
