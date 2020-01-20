import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Router from 'vue-router'
import Element from 'element-ui'
import '@/styles/index.scss'
import './permission'
import Cookies from 'js-cookie'
import './icons' // icon

import * as filters from './filters'

Vue.prototype.defaultAvatar = require('./assets/img/defaultAvatar.png')
Vue.prototype.defaultImg = require('./assets/img/imgError.png')
Vue.prototype.BASE64 = 'data:image/png;base64,'
Vue.prototype.pageSize = 6
Vue.prototype.htmlText = (content) => {
  if (content && content !== '') {
    let reg = new RegExp(' ', 'g')
    content = content.replace(reg, "<br/>")
    content = content.replace(/\\n/gm, "<br/>")
    return `${content}`
  }
  return ''
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

/* 滚动加载 */
class Scroll {
  static get top() {
    return Math.max(document.documentElement.scrollTop || document.body.scrollTop)
  }

  static get clientHeight() {
    return Math.max(document.documentElement.clientHeight || document.body.clientHeight)
  }

  static get clientWidth() {
    return Math.max(document.documentElement.clientWidth || document.body.clientWidth)
  }

  static get height() {
    return Math.max(document.documentElement.scrollHeight || document.body.scrollHeight)
  }

  static get width() {
    return Math.max(document.documentElement.scrollWidth || document.body.scrollWidth)
  }

  static get bottom() {
    return Scroll.height - Scroll.clientHeight - Scroll.top
  }
}
const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()
const downsampler = (function () {
  let result = null
  return function (time, func) {
    if (!result) {
      result = setTimeout(function () {
        func()
        result = null
      }, time)
    }
  }
})()
Vue.directive('scroll', {
  // eslint-disable-next-line no-unused-vars
  bind(el, binding, vnode) {
    on(window, 'scroll', function () {
      if (typeof binding.value === 'function' && Scroll.bottom === 0) {
        downsampler(50, binding.value)
      }
    })
  }
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
