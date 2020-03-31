import request from '@/utils/request'
import common from '@/common/common'
import Qs from 'qs'

/**
 * 保存政策
 * @param data
 */
export function addPolicy(data) {
  return request({
    url: common.CC_API + '/info/api/v2/policy',
    method: 'post',
    data
  })
}

/**
 * 政策列表
 * @param page
 * @param size
 * @param data
 */
export function getPolicyList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/policy?page=${page}&size=${size}`,
    method: 'GET',
    params: data
  })
}

/**
 * 根据政策id获取政策
 * @param id
 */
export function getPolicyById(id) {
  return request({
    url: common.CC_API + `/info/api/v2/policy/${id}`,
    method: 'GET'
  })
}

/**
 * 根据id修改政策
 * @param id
 * @param data
 */
export function modifyPolicy(id, data) {
  return request({
    url: common.CC_API + `/info/api/v2/policy/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除政策
 * @param id
 */
export function deletePolicy(id) {
  return request({
    url: common.CC_API + `/info/api/v2/policy/${id}`,
    method: 'DELETE'
  })
}

/**
 * 公告列表
 * @param data
 * @param page
 * @param size
 */
export function getNewsList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/notice/findNoticeByPage?pageNo=${page}&pageSize=${size}`,
    method: 'post',
    data
  })
}

/**
 * 发布公告
 * @param data
 */
export function addNews(data) {
  return request({
    url: common.CC_API + '/info/api/v2/notice/addNotice',
    method: 'post',
    data
  })
}

/**
 * 根据id编辑公告
 * @param id
 * @param data
 */
export function editNews(id, data) {
  return request({
    url: common.CC_API + `/info/api/v2/notice/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除公告
 * @param id
 */
export function deleteNews(id) {
  return request({
    url: common.CC_API + `/info/api/v2/notice/delete?id=${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 查询轮播图列表及图片
 * @param data
 * @param page
 * @param size
 */
export function getCarouselList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/carousel/getCarouselInfos?page=${page}&size=${size}`,
    method: 'post',
    data
  })
}

/**
 * 新增轮播图片
 * @param data
 */
export function addCarouse(data) {
  return request({
    url: common.CC_API + '/info/api/v2/carousel/saveCarouselPic',
    method: 'post',
    data
  })
}

/**
 * 新增轮播图信息数据
 * @param data
 */
export function addCarouseData(data) {
  return request({
    url: common.CC_API + '/info/api/v2/carousel/saveCarouselInfo',
    method: 'post',
    data
  })
}

/**
 * 设置默认轮播图
 * @param id
 * @param data
 */
export function setCarouse(id, data) {
  return request({
    url: common.CC_API + `/info/api/v2/carousel/setDefault/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除轮播图
 * @param id
 */
export function delCarouse(id) {
  return request({
    url: common.CC_API + `/info/api/v2/carousel/deleteCarousel`,
    method: 'DELETE',
    data: id
  })
}
