import request from '@/utils/request'
import common from '@/common/common'

/**
 * 大屏列表
 * @param data
 */
export function getTableList(data) {
  return request({
    url: common.CC_API + `/support/api/v2/enterpriseResumption/queryAreaAddress`,
    method: 'get',
    params: data
  })
}

/**
 * 根据id获取大屏详情
 * @param id
 */
export function getDetailById(id) {
  return request({
    url: common.CC_API + `/support/api/v2/enterpriseResumption/findAllEnterpriseByArea`,
    method: 'get',
    params: { area: id }
  })
}

/**
 * 根据id修改 大屏详情
 * @param data
 */
export function modifyData(data) {
  return request({
    url: common.CC_API + `/support/api/v2/enterpriseResumption/editAllEnterprise`,
    method: 'POST',
    data
  })
}

/**
 * 保存大屏/添加大屏
 *
 * */
export function addMonitor(data) {
  return request({
    url: common.CC_API + '/support/api/v2/enterpriseResumption/addAreaAddress',
    method: 'post',
    data
  })
}

/**
 * 修改大屏详情
 * @param data
 */
export function updateMonitor(data) {
  return request({
    url: common.CC_API + `/support/api/v2/enterpriseResumption/aditAreaAddress`,
    method: 'put',
    data
  })
}
