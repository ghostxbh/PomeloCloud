'use strict';
/**
 * code by PomeloCloud
 * 通用工具类
 */
/**
 * 随机码类型
 * @type {{U: string, NLU: string, NU: string, LU: string, L: string, N: string, NL: string}}
 */
const RandomCodeType = {
  N: 'n',// number
  L: 'l',// lower case letters
  U: 'u',// upper case letters
  NL: 'nl',// number and lower case
  NU: 'nu',// number and upper case
  LU: 'lu',// lower case and upper case
  NLU: 'nlu',// number、lower case and upper case
}

exports.RandomCodeType = RandomCodeType;

exports.CommonUtil = {
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
  },

  /**
   * 生成随机码
   * @param {number} min 最小数
   * @param {number} max 最大数
   * @param {number} len 长度
   * @param {{U: string, NLU: string, NU: string, LU: string, L: string, N: string, NL: string}} type 随机码类型
   * @returns {string | number} 随机码
   */
  randomCode({min, max, len, type = RandomCodeType}) {
    let res = '';
    // 解析各类型数组
    const combination = (type) => {
      const nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        lowerCases = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        upperCases = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      const nlu = nums.concat(lowerCases).concat(upperCases),
        nl = lowerCases.concat(nums),
        nu = upperCases.concat(nums),
        lu = lowerCases.concat(upperCases);

      const randomArr = {
        'n': nums, 'l': lowerCases, 'u': upperCases, 'nlu': nlu, 'nl': nl, 'nu': nu, 'lu': lu,
      };

      return randomArr[type] || [];
    };

    // 使用混合类型与生产随机码长度
    if (len && type) {
      const combinationArr = combination(type);
      for (let i = 0; i < len; i++) {
        const id = Math.floor(Math.random() * combinationArr.length);
        res += combinationArr[id];
      }
      return res;
    }

    // 使用长度获取随机码（默认为数字类型）
    if (len) {
      for (let i = 0; i < len; i++) {
        res += Math.floor(Math.random() * 10);
      }
      return res;
    }

    // 获取最大最小区间数据
    if (min || max) {
      res = Math.floor(Math.random() * (max - min + 1)) + min;
      return res;
    }
    return res;
  },
}
