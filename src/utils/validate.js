/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 是否密码大于6位
 * @param value
 */
export function isLengthMax6(rule, value, callback) {
  if (value && value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码不能少于6位'))
  }
}

/**
 * 检测邮箱
 * @param rule
 * @param value
 * @param callback
 */
export function validateEmail(rule, value, callback) {
  if (!value || value === '') {
    callback()
  } else {
    if (value !== '') {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的邮箱'))
      }
    }
    callback()
  }
}

/**
 * 检测手机号
 * @param rule
 * @param value
 * @param callback
 */
export function validateMobile(rule, value, callback) {
  if (!value || value === '') {
    callback()
  } else {
    if (value !== '') {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      }
    }
    callback()
  }
}

/**
 * 检测手机号
 * @param rule
 * @param value
 * @param callback
 */
export function validateChinese(rule, value, callback) {
  if (value !== '') {
    var reg = /[\u4E00-\u9FA5]/g
    if (reg.test(value)) {
      callback(new Error('请不要输入中文'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * 检测手机号
 * @param rule
 * @param value
 * @param callback
 */
export function validatelng(rule, value, callback) {
  if (!value) {
    callback()
  } else
  if (value !== '') {
    var reg = /^[0-9]+\.[0-9]+$/
    console.log('validatelng', reg.test(value))
    if (!reg.test(value)) {
      callback(new Error('请输入正确的经纬度'))
    }
    callback()
  } else {
    callback()
  }
}

