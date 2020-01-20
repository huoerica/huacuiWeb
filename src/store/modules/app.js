import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  searchName: Cookies.get('searchName') || '',
  size: Cookies.get('size') || 'medium',
  layoutWidth: 0,
  loginRegister: false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  OPEN_SIDEBAR: state => {
    state.sidebar.opened = true
    Cookies.set('sidebarStatus', 1)
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_LAYOUTWIDTH: (state, layoutWidth) => {
    state.layoutWidth = layoutWidth
  },
  SET_LOGINREGISTER: (state, loginRegister) => {
    state.loginRegister = loginRegister
  },
  SET_SEARCHNAME: (state, searchName) => {
    state.searchName = searchName
    Cookies.set('searchName', searchName)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  openSideBar({ commit }) {
    commit('OPEN_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setLayoutWidth({ commit }, layoutWidth) {
    commit('SET_LAYOUTWIDTH', layoutWidth)
  },
  setLoginRegister({ commit }, loginRegister) {
    commit('SET_LOGINREGISTER', loginRegister)
  },
  setSearchName({ commit }, searchName) {
    commit('SET_SEARCHNAME', searchName)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
