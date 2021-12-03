'use strict';

/**
 * code by PomeloCloud
 * 全局缓存
 */
const uuid = require('uuid');
const logger = require('log4js').getLogger();
const DATA_TYPE = {
  'boolean': 'boolean',
  'string': 'string',
  'number': 'number',
  'null': 'null',
  'undefined': 'undefined',
  'symbol': 'symbol',
  'object': 'object',
  'array': 'array',
  'function': 'function',
};

const CACHE_MAP = new Map();
const DATA_TYPE_MAP = new Map();
const CACHE_SET = new Set();

const GlobleCache = {
  set(key, value) {
    /**
     * 单个参数，生成默认key
     */
    if (key && !value) {
      value = key;
      key = uuid.v4();
    }

    /**
     * key必须是string类型
     */
    if (typeof key !== DATA_TYPE.string) {
      logger.warn('[GlobleCache] key{ %s } is not string', key);
      return;
    }

    if (typeof value === DATA_TYPE.boolean) {
      DATA_TYPE_MAP.set(key, DATA_TYPE.boolean);
    } else if (typeof value === DATA_TYPE.string) {
      DATA_TYPE_MAP.set(key, DATA_TYPE.boolean);
    } else if (typeof value === DATA_TYPE.number) {
      DATA_TYPE_MAP.set(key, DATA_TYPE.number);
    } else if (typeof value === DATA_TYPE.symbol) {
      DATA_TYPE_MAP.set(key, DATA_TYPE.symbol);
    } else if (value === null) {
      logger.warn('[GlobleCache] %s == null', key);
      DATA_TYPE_MAP.set(key, DATA_TYPE.null);
    } else if (typeof value === DATA_TYPE.undefined) {
      logger.warn('[GlobleCache] %s == undefined', key);
      DATA_TYPE_MAP.set(key, DATA_TYPE.undefined);
    } else if (typeof value === DATA_TYPE.object) {
      if (Array.prototype.isPrototypeOf(value)) {
        DATA_TYPE_MAP.set(key, DATA_TYPE.array);
      } else {
        DATA_TYPE_MAP.set(key, DATA_TYPE.object);
      }
    } else if (typeof value === DATA_TYPE.function) {
      DATA_TYPE_MAP.set(key, DATA_TYPE.function);
    }

    if (CACHE_MAP.has(key)) {
      CACHE_MAP.set(key, value);
    } else {
      CACHE_MAP.set(key, value);
      CACHE_SET.add(key);
    }
    return key;
  },

  get(key, defaultValue) {
    return CACHE_SET.has(key) ? CACHE_MAP.get(key) : defaultValue;
  },

  hasKey(key) {
    return CACHE_SET.has(key);
  },

  getKeys() {
    return CACHE_SET.keys();
  },

  remove(key) {
    if (CACHE_SET.has(key)) {
      CACHE_SET.delete(key);
    }
    if (CACHE_MAP.has(key)) {
      CACHE_MAP.delete(key);
    }
  },

  clear() {
    CACHE_SET.clear();
    CACHE_MAP.clear();
  },

  mapToJson(map = CACHE_MAP) {
    let obj = Object.create(null);
    if (CACHE_SET.size > 0) {
      map.forEach((v, k) => {
        const type = CACHE_MAP.get(k);
        switch (type) {
          case DATA_TYPE.boolean:
          case DATA_TYPE.number:
          case DATA_TYPE.string:
          case DATA_TYPE.symbol:
          case DATA_TYPE.array:
          case DATA_TYPE.null:
          case DATA_TYPE.undefined:
          case DATA_TYPE.function:
            obj[k] = v;
            break;
          case DATA_TYPE.object:
            this.mapToJson(v);
            break;
        }
      });
    }
    return obj;
  },
};

module.exports = GlobleCache;
