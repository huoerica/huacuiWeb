import {login, getInfo, registerHttp} from '@/api/user'
import {
  getUserId, setUserId, removeUserId,
  getToken, setToken, removeToken,
  getName, setName, getScore, setScore, removeScore,
  getAvatar, setAvatar, removeAvatar
} from '@/utils/auth'
import {removeName} from "../../utils/auth";

const state = {
  userId: getUserId(),
  token: getToken(),
  name: getName(),
  avatar: getAvatar(),
  userScore: getScore(),
  introduction: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    if (token) {
      setToken(token)
    } else {
      removeToken()
    }
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
    if (userId) {
      setUserId(userId)
    } else {
      removeUserId()
    }
  },
  SET_NAME: (state, name) => {
    state.name = name
    if (name) {
      setName(name)
    } else {
      removeName()
    }
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    if (avatar) {
      setAvatar(avatar)
    } else {
      removeAvatar()
    }
  },
  SET_SCORE: (state, score) => {
    state.userScore = score
    if (score) {
      setScore(score)
    } else {
      removeScore()
    }
  }
}

const actions = {
  // user login
  login({commit, dispatch}, userInfo) {
    const {phoneNum, code} = userInfo
    return new Promise(async (resolve, reject) => {
      login({phoneNum: phoneNum.trim(), code: code}).then(async response => {
        const {accessToken = '', user = {}} = response.data
        commit('SET_TOKEN', accessToken)
        commit('SET_USERID', user.id)
        commit('SET_NAME', user.userName || user.userPhone || '')
        commit('SET_AVATAR', user.userPhoto || user.userPhoto || '')
        commit('SET_SCORE', user.userScore || 0)
        await dispatch('app/setLoginRegister', false, {root: true})

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  register({commit, dispatch}, userInfo) {
    const {phoneNum, code, inviteCode} = userInfo
    return new Promise(async (resolve, reject) => {
      registerHttp({phoneNum: phoneNum.trim(), code: code, inviteCode}).then(async response => {
        const {accessToken = '', user = {}} = response.data
        commit('SET_TOKEN', accessToken)
        commit('SET_USERID', user.id || '')
        commit('SET_NAME', user.userName || user.userPhone || '')
        commit('SET_AVATAR', user.userPhoto || user.userPhoto || '')
        await dispatch('app/setLoginRegister', false, {root: true})

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {name, userPhoto, introduction} = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', userPhoto)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateName({commit}, data) {
    commit('SET_NAME', data)
  },

  // user logout
  logout({commit}) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_USERID', '')
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_SCORE', '')
      resolve()
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      removeName()
      removeUserId()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
