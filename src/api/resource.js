import request from '@/utils/request'
import common from '@/common/common'

/**
 * 获取资源列表
 * @param id
 */
export function getRes(page, size) {
  return request({
    url: common.CC_API + `/user/api/v2/resources?page=${page}&size=${size}`,
    method: 'get'
  })
}
/**
 * 获取资源列表
 * @param id
 */
export function getResAll() {
  return request({
    url: common.CC_API + `user/api/v2/resources/allResourceTrees`,
    method: 'get'
  })
}

/**
 * 根据用户id获取资源信息
 * @param id
 */
export function findResById(id) {
  return request({
    url: common.CC_API + `/user/api/v2/resources/${id}`,
    method: 'get'
  })
}

/**
 * 接口描述 根据用户id获取资源树
 * @param id yong
 */
export function findResTreeById(id) {
  return request({
    url: common.CC_API + `/user/api/v2/resources/userResourceTree/${id}`,
    method: 'get'
  })
}
/**
 * 接口描述 根据用户id修改资源
 * @param id yong
 */
export function modifyRes(id, data) {
  return request({
    url: common.CC_API + `/user/api/v2/resources/${id}`,
    method: 'PUT',
    data
  })
}
/**
 * 接口描述 保存资源,新增资源
 * @param id yong
 */
export function addRes(data) {
  return request({
    url: common.CC_API + `/user/api/v2/resources`,
    method: 'POST',
    data
  })
}
/**
 * 接口描述 根据用户ids删除资源
 * @param id yong
 */
export function deleteRes(id) {
  return request({
    url: common.CC_API + `/user/api/v2/resources/${id}`,
    method: 'DELETE'
  })
}
