'use strict';
/**
 * code by PomeloCloud
 * 通用工具类
 */
module.exports = {
  /**
   * 分页组件
   * @param {number} pageNo 页码
   * @param {number} pageSize 页面数量
   * @param {any} array 被分页数组
   * @return [any] 分页数组
   */
  pagination(pageNo = 1, pageSize = 10, array = []) {
    const offset = (pageNo - 1) * pageSize;
    return array && array.length > 0 ?
      ((offset + pageSize >= array.length) ?
        array.slice(offset, array.length) :
        array.slice(offset, offset + pageSize)) : [];
  }
}
