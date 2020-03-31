import request from '@/utils/request'
import common from '@/common/common'
import Qs from 'qs'
/**
 * 查询应用管理
 * @param data
 */
export function getTabList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/collectApp/getCollectApp?page=${page}&size=${size}`,
    method: 'post',
    data
  })
}
/**
 * 新增应用管理
 * @param data
 */
export function addApp(data) {
  return request({
    url: common.CC_API + '/info/api/v2/collectApp/saveCollectApp',
    method: 'post',
    data
  })
}

/**
 * 修改应用管理
 * @param data
 */
export function editApp(data) {
  return request({
    url: common.CC_API + `/info/api/v2/collectApp/updateCollectApp`,
    method: 'POST',
    data
  })
}

/**
 * 删除应用管理
 * @param id
 */
export function delApp(id) {
  return request({
    url: common.CC_API + `/info/api/v2/collectApp/deleteCollectApp`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}

/**
 * 新增问卷（问卷）
 * @param data
 */
export function addSurvey(data) {
  return request({
    url: common.CC_API + `/info/api/v2/survey`,
    method: 'post',
    data
  })
}

/**
 * 编辑问卷（问卷）
 * @param data
 */
export function editSurvey(data) {
  return request({
    url: common.CC_API + `/info/api/v2/survey`,
    method: 'put',
    data
  })
}

/**
 * 查询采集信息（问卷）
 * @param page
 * @param size
 * @param data
 */
export function getSurveyList(page, size, data) {
  return request({
    url: common.CC_API + `/info/api/v2/survey/getSurvey?page=${page}&size=${size}`,
    method: 'post',
    data
  })
}

/**
 * 删除采集信息（问卷）
 * @param id
 */
export function delSurvey(id) {
  return request({
    url: common.CC_API + `/info/api/v2/survey/deleteSurvey`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ id })
  })
}
/**
 * 获取调查问卷题目
 * @param id
 */
export function getSurveyQuest(id) {
  return request({
    url: common.CC_API + `/info/api/v2/survey/questions?surveyId=${id}`,
    method: 'get'
  })
}
/**
 * 发布采集信息（问卷）
 * @param surveyId
 */
export function releaseSurvey(surveyId) {
  return request({
    url: common.CC_API + `/info/api/v2/survey/releaseSurvey`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ surveyId })
  })
}
/**
 * 下架采集信息（问卷）
 * @param surveyId
 */
export function withdrawnSurvey(surveyId) {
  return request({
    url: common.CC_API + `/info/api/v2/survey/withdrawnSurvey`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: Qs.stringify({ surveyId })
  })
}

/**
 * 获取调查问卷题库
 * @param id
 */
export function getStandardSurvey() {
  return request({
    url: common.CC_API + `/info/api/v2/survey/getStandardSurvey`,
    method: 'get'
  })
}
