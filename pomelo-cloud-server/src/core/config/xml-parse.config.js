'use strict';

/**
 * code by PomeloCloud
 * xml解析配置类
 */
class XmlParseConfig {
  static fpxOptions() {
    return {
      attributeNamePrefix: '', //将给定的字符串添加到属性名称以进行识别
      attrNodeName: false, //将所有属性分组为给定名称的属性, 默认：false
      textNodeName: '#text',//文本节点名称
      ignoreAttributes: false,//忽略要解析的属性
      ignoreNameSpace: false,//从标记和属性名称中删除命名空间字符串
      allowBooleanAttributes: false,//标签可以有没有任何值的属性
      parseNodeValue: false,//将文本节点的值解析为浮点数、整数或布尔值
      parseAttributeValue: false,//将属性值解析为浮点数、整数或布尔值
      trimValues: true,// 修剪属性或节点的字符串值
      cdataTagName: false, //如果指定，解析器将 CDATA 解析为嵌套标签，而不是将其值添加到父标签，默认：false
      cdataPositionChar: false,//这将有助于将 JSON 转换回 XML 而不会丢失 CDATA 位置
      parseTrueNumberOnly: true,//如果为真，则诸如“+123”或“0123”之类的值将不会被解析为数字
      arrayMode: false, //When false，单次出现的标签被解析为对象，但在多次出现的情况下被解析为数组。当 时true，标签将被解析为一个始终不包括叶节点的数组。当 时strict，所有标签将仅被解析为数组。当实例为 时RegEx，只有标签会被解析为匹配正则表达式的数组。当function标签名称传递给可以检查的回调时,"strict"
      // attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//转换期间处理标签值。如 HTML 解码、单词大写等。仅适用于字符串的情况
      // tagValueProcessor : (val, tagName) => he.decode(val), //在转换过程中处理属性值。如 HTML 解码、单词大写等。仅适用于字符串的情况
      stopNodes: ['parse-me-as-string'],//不需要解析的标签名称数组。相反，它们的值被解析为字符串
      supressEmptyNode: true, //单行标签取消后缀
      format: true, //格式化
    };
  }
}

module.exports = XmlParseConfig;
