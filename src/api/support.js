import request from '@/utils/request'
import common from '@/common/common'
import Qs from 'qs'

/**
 * 个人信息列表 查询所有简历
 * */
export function getPersonList(data) {
  return request({
    url: common.CC_API + '/person/api/v2/person/selectAll',
    method: 'get',
    params: data
  })
}

/**
* 根据id删除个人简历
 * @param id
* */
export function deletePerson(id) {
  return request({
    url: common.CC_API + `/person/api/v2/person/delete`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}

/**
* @param data
* */
export function exportPerson(data) {
  return request({
    url: common.CC_API + `/person/api/v2/person/excelExport`,
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

/**
* 获取企业复工信息list
* @param data
* */
export function getResumptionList(data) {
  return request({
    url: common.CC_API + '/ent/api/v2/enterprise/selectAll',
    method: 'get',
    params: data
  })
}

/**
 * 根据id删除企业复工登记记录
 * @param id
 * */
export function deleteResumption(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/enterprise/delete`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}

/**
 * 企业复工信息 导出
 * @param data
 * */
export function exportResumption(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/enterprise/excelExport`,
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

/**
 * 获取企业招聘信息list
 * @param data
 * */
export function getEmployList(data) {
  return request({
    url: common.CC_API + '/ent/api/v2/ent/selectAll',
    method: 'get',
    params: data
  })
}

/**
 * 根据id删除企业招聘记录
 * @param id
 * */
export function deleteEmploy(id) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/delete`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}

/**
 * 企业招聘信息 导出
 * @param data
 * */
export function exportEmploy(data) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/excelExport`,
    method: 'get',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    params: data,
    responseType: 'blob'
  })
}

/**
 * 数据导入记录数据 列表查询
 * @param data
 * */
export function getImportRecord(data) {
  return request({
    url: common.CC_API + '/user/api/v2/importRecord/selectList',
    method: 'get',
    params: data
  })
}

/**
* 用户信息导出（个人信息）
* */
export function excelLoadPerson(batchNumber) {
  return request({
    url: common.CC_API + `/person/api/v2/person/excelLoad/${batchNumber}`,
    method: 'get'
  })
}

/**
 * 用户信息导出（企业复工）
 * */
export function excelLoadRework(batchNumber) {
  return request({
    url: common.CC_API + `/ent/api/v2/enterprise/downloadImportReworkRecordFile/${batchNumber}`,
    method: 'get'
  })
}

/**
 * 用户信息导出（企业招聘）
 * */
export function excelLoadPosition(batchNumber) {
  return request({
    url: common.CC_API + `/ent/api/v2/ent/downloadImportPositionFile/${batchNumber}`,
    method: 'get'
  })
}

/**
* 模板下载
* 企业复工
* */
export function downloadImportReworkRecordTemplate() {
  return request({
    url: common.CC_API + '/ent/api/v2/enterprise/downloadImportReworkRecordTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 模板下载
 * 企业招聘
 * */
export function downloadImportPositionTemplate() {
  return request({
    url: common.CC_API + '/ent/api/v2/ent/downloadImportPositionTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 模板下载
 * 个人求职
 * */
export function excelImportsTemplate() {
  return request({
    url: common.CC_API + '/person/api/v2/person/excelImportsTemplate',
    method: 'get',
    responseType: 'blob'
  })
}
