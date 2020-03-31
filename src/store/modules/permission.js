import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  if (routes && routes.length > 0) {
    routes = routes.map(item => {
      var path = item.path
      var select = true
      roles.forEach(item2 => {
        var path2 = item2.url
        var select2 = item2.selected
        if (path === path2 && select2) {
          select = false
        }
      })
      item.hidden = select
      return item
    })
  }
  return routes
}

const state = {
  routes: [],
  addRoutes: [],
  roles: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  generateRoutes({ commit }, resources) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // if (roles.includes('admin')) {
      console.log('routes', resources)
      var newRoles = []
      if (!resources || resources.length === 0) {
        resources = constantRoutes
      } else {
        for (let i = 0; i < resources.length; i++) {
          const path = resources[i].url
          var select = resources[i].selected
          var children = resources[i].children
          for (let j = 0; j < asyncRoutes.length; j++) {
            const path2 = asyncRoutes[j].path
            var item = asyncRoutes[j]
            if (path === path2 && select) {
              item.hidden = false
              item.children = filterAsyncRoutes(item.children, children)
              newRoles.push(item)
            }
          }
        }
        console.log('newRoles', newRoles)
        resources = newRoles
      }
      accessedRoutes = resources
      // todo debug router
      // accessedRoutes = asyncRoutes
      console.log('generateRoutes accessedRoutes', accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
