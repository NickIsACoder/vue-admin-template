import request from '@/utils/request'
import common from '@/common/common'
import Qs from 'qs'

/**
 * 新增企业保存
 * @param data
 */
export function addHandle(data) {
  return request({
    url: common.CC_API + '/ent/api/v2/ent',
    method: 'post',
    data
  })
}

/**
 * 企业列表
 * @param data
 */
export function getTableList(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/list`,
    method: 'get',
    params: data
  })
}

/**
 * 根据id获取企业详情
 * @param id
 */
export function getDetailById(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/info/${id}`,
    method: 'GET'
  })
}

/**
 * 根据id修改 企业
 * @param id
 * @param data
 */
export function modifyData(id, data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/${id}`,
    method: 'POST',
    data
  })
}

/**
 * 根据id删除(更改企业状态)
 * @param id
 */
export function deleteData(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/${id}`,
    method: 'DELETE'
  })
}
/**
 * 企业下面的职位
 * @param id
 */
export function getEntJobList(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/positions/${id}`,
    method: 'get'
  })
}
/**
 * 审核企业
 * @param id  data
 */
export function examineEnt(id, data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/examine/${id}`,
    method: 'post',
    data
  })
}
/**
 * 根据职位id获取职位详情
 * @param id
 */
export function getPositionDetaill(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/position/${id}`,
    method: 'get'
  })
}

/**
 * 个人信息导出
 * @param data
 * */
export function exportEnt(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/excelExport`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify(data),
    responseType: 'blob'
  })
}

/**
 * 企业列表导出
 * @param data
 * */
export function exportEntList(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/exportEnterpriseList`,
    method: 'GET',
    params: data
  })
}

/**
 * 列表下载
 * @param data
 * */
export function downloadName(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/common/download`,
    method: 'GET',
    params: data
  })
}
