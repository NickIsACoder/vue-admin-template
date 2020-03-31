import axios from 'axios'
import VueAxios from 'vue-axios'
import { Message } from 'element-ui'
import store from '@/store'
// import Qs from 'qs' // 引入Qs，这个库是axios里面包含的，不需要再下载了
import Vue from 'vue'
import router from '@/router/index.js'
import { setErrorCode } from '@/utils/auth.js'
// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000, // request timeout
  // transformRequest: [function(data) {
  //   data = Qs.stringify(data)
  //   return data
  // }],
  headers: {
    'Content-Type': 'application/json'
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.headers.Authorization = 'bearer ' + store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log('service error', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // const _this = this
    // 如果不是code为零的时候，就是失败失败要相应的操作.
    setErrorCode(res.code)
    if (res.code && res.code !== 0) {
      var msg = res.data ? res.data : res.msg
      // 2012超时，返回登录页面
      if (res.code && (res.code === 100002)) {
        // to re-login
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        Message({
          message: '已超时未认证，请重新登录',
          type: 'error',
          duration: 3 * 1000
        })
        sessionStorage.clear()
        router.replace({
          path: '/login?redirect=/welcome'
        })
        return Promise.reject(res)
      } else {
        Message({
          message: msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    const msg = error.response.data.msg
    const statusCode = error.response.status
    const code = error.response.data.code
    setErrorCode(code)
    if (code && (code === 100002)) {
      // to re-login
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      Message({
        message: '已超时未认证，请重新登录',
        type: 'error',
        duration: 3 * 1000
      })
      sessionStorage.clear()
      router.replace({
        path: '/login?redirect=/welcome'
      })
      return Promise.reject(error)
    } else {
      Message({
        message: msg || error.toString(),
        type: 'error',
        duration: 5 * 1000
      })
      // if (statusCode.indexOf('401') !== -1) {
      //   this.$router.push('/login')
      // }
    }
    return Promise.reject(error)
  }
)

Vue.use(VueAxios, service)
export default service
