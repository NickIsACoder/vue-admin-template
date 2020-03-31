import request from '@/utils/request'
import common from '@/common/common'
import Qs from 'qs'

/**
 * 机构列表
 * @param pageNo
 * @param pageSize
 * @param data
 */
export function getOrganList(pageNo, pageSize, data) {
  return request({
    url: common.CC_API + '/user/api/v2/department/selectAll',
    method: 'post',
    params: { pageNo, pageSize },
    data
  })
}

/**
* 新增机构
 * @param data
* */
export function addOrg(data) {
  return request({
    url: common.CC_API + '/user/api/v2/department/save',
    method: 'POST',
    data
  })
}

/**
* 修改机构
 * @param data
* */
export function updateOrg(data) {
  return request({
    url: common.CC_API + `/user/api/v2/department/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 修改机构
 * @param id
 * */
export function deleteOrg(id) {
  return request({
    url: common.CC_API + '/user/api/v2/department/delete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}
