import request from '@/utils/request'
import common from '@/common/common'

/**
 * 获取区域
 * @param id
 * */
export function getArea(id) {
  return request({
    url: common.CC_API + `/person/api/v2/rasicRegion/findByCode/${id}`,
    method: 'get'
  })
}

/**
 * 获取区域树
 * @param id
 * */
export function getAreaTree(id) {
  return request({
    url: common.CC_API + `/person/api/v2/rasicRegion/findRegionTree/${id}`,
    method: 'get'
  })
}

/**
 * 新增区域
 * *@param data
 * */
export function addRegion(data) {
  return request({
    url: common.CC_API + '/person/api/v2/rasicRegion/addRegion',
    method: 'post',
    data
  })
}

/**
 * 编辑区域
 * *@param data
 * */
export function updateRegion(data) {
  return request({
    url: common.CC_API + '/person/api/v2/rasicRegion/updateRegion',
    method: 'put',
    data
  })
}

/**
 * 删除区域
 * @param id
 * */
export function delRegion(id) {
  return request({
    url: common.CC_API + '/person/api/v2/rasicRegion/delRegion',
    method: 'delete',
    params: { id }
  })
}

/**
 * 区域查询，根据登录用户类型及所属区域返回，默认返回国家，根据父级code查询下级
 * @param id
 * */
export function findUserRegionByCode(id) {
  return request({
    url: common.CC_API + `/person/api/v2/rasicRegion/findUserRegionByCode/${id}`,
    method: 'get'
  })
}
