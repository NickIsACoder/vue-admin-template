import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getErrorCode } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // console.log('hasRoles', hasRoles)
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          store.dispatch('user/getInfo').then(res => {
            // console.log('info', res)
            var resourceList = []
            var id = '0'
            console.log('roles 拦截', res)
            // 开发注释，暂不拦截，直接改路由页面 20200227
            if (res) {
              id = res.roles[0].id ? res.roles[0].id : '0'
            }
            // console.log('id', id)
            if (id) {
              store.dispatch('user/findResById', id).then(res1 => {
                resourceList = res1.resourceTree[0].children ? res1.resourceTree[0].children : []
                store.dispatch('permission/generateRoutes', resourceList).then(res2 => {
                  router.addRoutes(res2)
                  next({ ...to, replace: true })
                }).catch(res2 => {
                  next(`/login?redirect=${to.path}`)
                })
              }).catch(res1 => {
                store.dispatch('user/resetToken')
                next(`/login?redirect=${to.path}`)
              })
            }
            // set the replace: true, so the navigation will not leave a history record
          }).catch(res => {
            // console.log('info error', res)
            store.dispatch('user/resetToken')
            next(`/login?redirect=${to.path}`)
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    console.log('has no token')
    var code = getErrorCode()
    console.log('has code', code)
    if (code === 100002) {
      NProgress.done()
      return
    }
    if (whiteList.indexOf(to.path) !== -1) {
      console.log('to.path', to.path)
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
