import request from '@/utils/request'
import common from '@/common/common'

/**
 * 保存招聘会
 * @param data
 */
export function addJob(data) {
  return request({
    url: common.CC_API + '/info/api/v2/jobfair',
    method: 'post',
    data
  })
}

/**
 * 招聘会列表
 * @param page
 * @param size
 * @param
 */
export function getJobList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair?page=${page}&size=${size}`,
    method: 'GET',
    params: data
  })
}

/**
 * 根据id获取详情 招聘会
 * @param id
 */
export function getDetailById(id) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/${id}`,
    method: 'GET'
  })
}

/**
 * 根据id修改招聘会
 * @param id
 * @param data
 */
export function modifyJob(id, data) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除招聘会
 * @param id
 */
export function deleteJob(id) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/${id}`,
    method: 'DELETE'
  })
}
/**
 * 根据招聘会id获取已报名的公司
 * @param id page, size
 */
export function jobfairEnt(jobfairid, page, size) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/ent/${jobfairid}?page=${page}&size=${size}`,
    method: 'GET'
  })
}
/**
 * 根据招聘会id 公司id 获取公司报名的职位
 * @param data
 */
export function getEntPosition(data) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/ent/position`,
    method: 'GET',
    params: data
  })
}
/**
 * 审核公司
 * @param data
 */
export function examineEnt(jobfairid, data) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/examine/${jobfairid}`,
    method: 'POST',
    data
  })
}
/**
 * 给公司分配展位
 * @param data
 */
export function jobfairBooth(data) {
  return request({
    url: common.CC_API + `/info/api/v2/jobfair/booth`,
    method: 'POST',
    data
  })
}
/**
 * 展位列表
 * @param page, size
 */
export function boothList(page, size) {
  return request({
    url: common.CC_API + `/info/api/v2/booth?page=${page}&size=${size}`,
    method: 'GET'
  })
}
/**
 * 新建展位
 * @param data
 */
export function addBooth(data) {
  return request({
    url: common.CC_API + `/info/api/v2/booth`,
    method: 'POST',
    data
  })
}
/**
 * 根据id修改 展位
 * @param id
 * @param data
 */
export function modifyBooth(id, data) {
  return request({
    url: common.CC_API + `/info/api/v2/booth/${id}`,
    method: 'PUT',
    data
  })
}
/**
 * 根据id删除展位
 * @param id
 */
export function delBooth(id) {
  return request({
    url: common.CC_API + `/info/api/v2/booth/${id}`,
    method: 'DELETE'
  })
}
/**
 * PAD列表
 * @param page, size
 */
export function padList(page, size) {
  return request({
    url: common.CC_API + `/info/api/v2/pad?page=${page}&size=${size}`,
    method: 'GET'
  })
}
/**
 * 新建设备 pad
 * @param data
 */
export function addPad(data) {
  return request({
    url: common.CC_API + `/info/api/v2/pad`,
    method: 'POST',
    data
  })
}

/**
 * 根据mac获取设备
 * @param mac
 */
export function getDevByMac(mac) {
  return request({
    url: common.CC_API + `/info/api/v2/pad/mac?mac=${mac}`,
    method: 'GET'
  })
}
/**
 * 根据id删除 PAD 设备
 * @param id
 */
export function delPad(id) {
  return request({
    url: common.CC_API + `/info/api/v2/pad/${id}`,
    method: 'DELETE'
  })
}
