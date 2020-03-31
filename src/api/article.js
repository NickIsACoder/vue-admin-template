import request from '@/utils/request'
import common from '@/common/common'

export function fetchList(query) {
  return request({
    url: common.CC_MOCK + '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: common.CC_MOCK + '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: common.CC_MOCK + '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: common.CC_MOCK + '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: common.CC_MOCK + '/article/update',
    method: 'post',
    data
  })
}
