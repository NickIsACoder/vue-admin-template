
/**
 * 路由
 */
import { asyncRoutes } from './role/routes.js'
import mockData from './mock-data.js'

export default [
  // user login
  {
    url: '/user/api/v2/resources',
    type: 'get',
    response: config => {
      // mock error
      var list = mockData.resList
      console.log('resList', list)
      if (!list) {
        return {
          code: -200,
          message: '获取资源失败'
        }
      }

      return {
        code: 0,
        data: list
      }
    }
  },
  {
    url: '/api-user/resource/v2/findResourceByUserId',
    type: 'post',
    response: config => {
      // mock error
      console.log('resDetail')
      if (!asyncRoutes) {
        return {
          code: -200,
          message: '获取资源失败'
        }
      }

      return {
        code: 0,
        data: asyncRoutes
      }
    }
  }

]
