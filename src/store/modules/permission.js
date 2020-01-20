import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use token to determine if the current user has permission
 * @param token
 * @param route
 */
function hasPermission(token, route) {
  if (route.meta.requiresAuth && token) {
    return true
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param token
 */
export function filterAsyncRoutes(routes, token) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(token, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, token)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, token) {
    return new Promise(resolve => {
      let accessedRoutes
      if (token) {
        accessedRoutes = constantRoutes.concat(asyncRoutes || [])
      } else {
        accessedRoutes = constantRoutes
      }
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
