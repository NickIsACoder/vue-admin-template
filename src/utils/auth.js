import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userName = 'userName'
const userType = 'userType'
const errorCode = 'errorCode'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem('token')
}

export function setToken(token) {
  token = token.length > 10 ? token.substring(0, 9) : ''
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getUserName() {
  return Cookies.get(userName)
}
export function getUserType() {
  return Cookies.get(userType)
}

export function setUserName(token) {
  return Cookies.set(userName, token)
}
export function setUserType(userType) {
  return Cookies.set(userType, userType)
}

export function removeUserName() {
  return Cookies.remove(userName)
}

export function removeUserType() {
  return Cookies.remove(userType)
}
export function getErrorCode() {
  return Cookies.get(errorCode)
}

export function setErrorCode(code) {
  return Cookies.set(errorCode, code)
}
