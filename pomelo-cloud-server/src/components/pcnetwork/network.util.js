'use strict';

/**
 * code by PomeloCloud
 * 网络工具类
 */
const ip = require('ip');
const os = require('os');
const fs = require('fs');
const path = require('path');
const NetworkService = require('./network.service');

class NetworkUtil {
  /**
   * 替换前缀
   * 【::ffff:】
   * @param ip
   * @returns {*|string}
   */
  static replacePrefix(ip) {
    return ip.indexOf('::ffff:') > -1 ? ip.replace(/::ffff:/, '') : '-';
  }

  /**
   * 获取内网IP
   * @param name
   * @param family
   * @returns {string}
   */
  static intranetIp(name, family) {
    const intranetIp = name || family ? ip.address(name, family) : ip.address();
    return intranetIp ? intranetIp : '127.0.0.1';
  }

  /**
   * 获取所有网卡信息
   * @param name
   * @param family
   * @returns {NetworkInterfaceInfo[]|undefined}
   */
  static localAllNetworkInfo(name, family) {
    const interfaces = os.networkInterfaces();
    /**
     * is default ipv4
     */
    family = family ? family.toLowerCase() : 'ipv4';
    /**
     * If a specific network interface has been named,
     * return the address.
     */
    if (name && name !== 'private' && name !== 'public') {
      const res = interfaces[name].filter(function(details) {
        const itemFamily = details.family.toLowerCase();
        details.ifname = name;
        return itemFamily === family;
      });
      if (res.length === 0) {
        return undefined;
      }
      return res;
    }

    return Object.keys(interfaces).map(function(nic) {
      /**
       * Note: name will only be `public` or `private`
       * when this is called.
       */
      const addresses = interfaces[nic].filter(function(details) {
        details.family = details.family.toLowerCase();
        details.ifname = nic;
        if (details.family !== family || ip.isLoopback(details.address)) {
          return false;
        } else if (!name) {
          return true;
        }
        return name === 'public' ? ip.isPublic(details.address) : ip.isPrivate(details.address);
      });
      return addresses.length ? addresses : undefined;
    }).filter(Boolean);
  }

  /**
   * 创建目录
   * @param {String} dirname 目录
   * @param {Application} app app
   * @return {boolean} 是否成功
   */
  static mkdirsSync(dirname, app) {
    try {
      if (!dirname) return false;
      if (fs.existsSync(dirname)) {
        return true;
      }

      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    } catch (e) {
      console.error('创建目录失败', dirname);
      return false;
    }
  }

  /**
   * 判断是否在网卡黑名单中
   * @param {String} name 网卡
   * @return {boolean} 是否再网卡黑名单
   */
  static isInBlackIfNameList(name) {
    const blackIps = NetworkService.getBlackIpList();
    for (let i = 0; i < blackIps; i++) {
      if (name === NetworkService.getBlackNameList()[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * 判断是否在ip黑名单中
   * @param {String} ip ip
   * @return {Boolean} 是否在ip黑名单中
   */
  static isInblackIpList(ip) {
    const blackIps = NetworkService.getBlackIpList();
    for (let i = 0; i < blackIps.length; i++) {
      if (ip === blackIps[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取第一个合法内网ip
   * @return {String} 内网ip
   */
  static getFirstPrivateIp() {
    const ifs = this.localAllNetworkInfo();
    for (let i = 0; i < ifs.length; i++) {
      const ips = ifs[i];
      for (let j = 0; j < ips.length; j++) {
        const icurrentip = ips[j].address;
        const ifname = ips[j].ifname;
        if (ip.isPrivate(icurrentip)
          && !this.isInBlackIfNameList(ifname)
          && !this.isInblackIpList(icurrentip)) {
          return icurrentip;
        }
      }
    }
    return null;
  }
}

module.exports = NetworkUtil;
