import request from '@/utils/request'
import common from '@/common/common'

export function getRoutes() {
  return request({
    url: '/user',
    method: 'get'
  })
}

/**
 * 获取用户列表
 * @param page
 * @param size
 */
export function getRoles(page, size) {
  return request({
    url: common.CC_API + `/user/api/v2/roles?page=${page}&size=${size}`,
    method: 'get'
  })
}
/**
 * 保存用户/添加用户
 *
 * */
export function addRole(data) {
  return request({
    url: common.CC_API + '/user/api/v2/roles',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param id
 * @param data
 */
export function updateRole(id, data) {
  return request({
    url: common.CC_API + `/user/api/v2/roles/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户id获取用户
 * @param id  用户id
 */
export function deleteRole(id) {
  return request({
    url: common.CC_API + `/user/api/v2/roles/${id}`,
    method: 'delete'
  })
}
/**
   * 根据id获取角色，包含资源树
   * @param id  用户id
   */
export function getRoleResTree(id) {
  return request({
    url: common.CC_API + `/user/api/v2/roles/resourceTree/${id}`,
    method: 'GET'
  })
}
