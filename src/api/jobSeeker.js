import request from '@/utils/request'
import common from '@/common/common'

/**
 * G端求职者管理列表查询
 * @param data
 */
export function getSeekerList(data) {
  return request({
    url: common.CC_API + `/person/api/v2/person/selectAllOnSys`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: data
  })
}

/**
 * 根据用户的id（userid）获取简历
 * @param id
 */
export function getDetailById(id) {
  return request({
    url: common.CC_API + `/person/api/v2/person/${id}`,
    method: 'GET'
  })
}
/**
 * G端新增用户简历 求职者信息新增
 * @param data
 */
export function addSeeker(data) {
  return request({
    url: common.CC_API + `/person/api/v2/person/saveOnSys`,
    method: 'POST',
    data
  })
}
/**
 * G端根据简历id修改  求职者信息修改
 * @param id
 * @param data
 */
export function editSeeker(id, data) {
  return request({
    url: common.CC_API + `/person/api/v2/person/updateOnSys/${id}`,
    method: 'PUT',
    data
  })
}
