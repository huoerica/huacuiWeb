import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from "@/router"

const PROXY_HOST = require('../../public/config.js')
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['responseType'] = 'json'
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PROXY_HOST.proxy : '/'
})

service.defaults.timeout = 5000

service.interceptors.request.use(
  config => {

    if (store.getters.token) {
      config.headers['accessToken'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.flag) {
      if (res.code === -20) {
        router.push({path: '/'})
        store.dispatch('user/logout')
        store.dispatch('app/setLoginRegister')
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: '遇到未知错误',
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error)
  }
)

export function request (url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url: url,
      method: 'post',
      data
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}

export function httpFilePost (url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url: url,
      method: 'post',
      data
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}
