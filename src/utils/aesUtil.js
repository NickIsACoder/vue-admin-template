import CryptoJS from 'crypto-js/crypto-js'
import Vue from 'vue'

const KEY = CryptoJS.enc.Utf8.parse('tecsuntecsun1234') // 'retedfgd' 与后台一致
const IV = CryptoJS.enc.Utf8.parse('o-kJW4_3AVXz5s96JgUkcBE4M3LA') // 'asdqwe' 与后台一致

/**
 * 加密 没IV
 * @param str
 * @returns {string}
 */
export function EncryptNoIV(str) {
  if (str) {
    var srcs = CryptoJS.enc.Utf8.parse(str)
    var encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7 })
    return encrypted.toString()
  } else {
    return ''
  }
}

/**
 * 解密 没IV
 * @param str
 * @returns {*}
 */
export function DecryptNoIV(str) {
  if (str) {
    var decrypt = CryptoJS.AES.decrypt(str, KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  } else {
    return ''
  }
}

// AES加密 ：字符串 key iv  返回base64

export function Encrypt(str) {
  const key = KEY
  const iv = IV

  const srcs = CryptoJS.enc.Utf8.parse(str)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    // mode: CryptoJS.mode.ECB,
    mode: CryptoJS.mode.CBC, // mode 与后台一致
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

// AES 解密 ：字符串 key iv  返回base64

export function Decrypt(str) {
  const key = KEY
  const iv = IV

  const base64 = CryptoJS.enc.Base64.parse(str)
  const src = CryptoJS.enc.Base64.stringify(base64)

  var decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    // mode: CryptoJS.mode.ECB,
    mode: CryptoJS.mode.CBC, // 保持一致
    padding: CryptoJS.pad.Pkcs7
  })

  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

  return decryptedStr.toString()
}
Vue.use(CryptoJS)
