import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })
router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (!to.meta.requiresAuth || to.path === '/') {
    next()
  } else {
    if (hasToken) {
      next()
      NProgress.done()
    } else {
      next({
        path: '/',
        query: {
          redirect: to.path
        }
      })
      await store.dispatch('user/resetToken')
      await store.dispatch('app/setLoginRegister', true)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
