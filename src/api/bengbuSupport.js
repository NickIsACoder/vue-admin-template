import request from '@/utils/request'
import common from '@/common/common'
// import Qs from 'qs'

/**
 * 获取列表
 * */
export function getTableList(data) {
  return request({
    url: common.CC_API + '/bengbu/api/v2/ent/enterprise/queryByExample',
    method: 'post',
    data
  })
}

/**
 * 导出
 * */
export function exportExcel(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/downLoadqueryByExample`,
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

/**
 * 删除
 * */
export function delEporRecodes(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/delEporRecodesById`,
    method: 'post',
    data
  })
}

/**
 * 编辑
 * */
export function modifyByExample(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/modifyByExample`,
    method: 'post',
    data
  })
}

/**
 * 检验用户所属市
 * */
export function isShowOper(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/isShowOper`,
    method: 'get',
    params: data
  })
}

/**
 * 用工情况变动表
 * */
export function getCountChangeList(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/queryRecodesCompareByExample`,
    method: 'post',
    data
  })
}

/**
 * 用工情况变动表导出
 * */
export function exportCountChangeList(data) {
  return request({
    url: common.CC_API + `/bengbu/api/v2/ent/enterprise/downRecodesCompareByExample`,
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}
