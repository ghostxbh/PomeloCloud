'use strict';

/**
 * code by PomeloCloud
 * 网络业务类
 */
const ini = require('ini');
const fs = require('fs');

class NetworkService {
  static init() {
    let nework = fs.readFileSync(__dirname + '/data/network.data.ini', 'utf8');
    nework = ini.parse(nework);
    return nework;
  }

  static editList(config) {
    const data = ini.stringify(config);
    fs.writeFileSync(__dirname + '/data/network.data.ini', data);
  }

  static getBlackIpList() {
    const network = this.init();
    let blackIpList = [];
    if (network.blacklist && network.blacklist.ips) {
      blackIpList = network.blacklist.ips;
    }
    return blackIpList;
  }

  static getWhiteIpList() {
    const network = this.init();
    let whiteIpList = [];
    if (network.whitelist && network.whitelist.ips) {
      whiteIpList = network.whitelist.ips;
    }
    return whiteIpList;
  }

  static getBlackNameList() {
    const network = this.init();
    let whiteNameList = [];
    if (network.blacklist && network.blacklist.names) {
      whiteNameList = network.whitelist.names;
    }
    return whiteNameList;
  }
}
module.exports = NetworkService;
