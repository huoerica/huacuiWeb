import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)
const asyncRoutes = []
const constantRoutes = [
  {
    path: '/',
    name: 'run',
    component: Home,
    meta: { requiresAuth: false, title: '首页', ifShow: true }
  },
  {
    path: '/course',
    name: 'course',
    component: () => import('@/views/Course.vue'),
    meta: { requiresAuth: false, title: '课程', ifShow: true }
  },
  {
    path: '/college',
    name: 'college',
    component: () => import('@/views/College.vue'),
    meta: { requiresAuth: false, title: '学院', ifShow: true },
    redirect: '/college/index',
    children: [
      {
        path: '/college/index',
        name: 'collegeindex',
        component: () => import('@/views/college/CollegeIndex.vue'),
        meta: { requiresAuth: false, title: '公开课', ifShow: true }
      },
      {
        path: '/college/cloud',
        name: 'cloudindex',
        component: () => import('@/views/college/CloudIndex.vue'),
        meta: { requiresAuth: true, title: '云课堂', ifShow: true }
      },
      {
        path: '/college/detail',
        name: 'collegedetail',
        component: () => import('@/views/college/CollegeDetail.vue'),
        meta: { requiresAuth: false, title: '公开课详情', ifShow: true }
      },
      {
        path: '/college/catalog',
        name: 'cloudcatalog',
        component: () => import('@/views/college/CloudCatalog'),
        meta: { requiresAuth: true, title: '目录', ifShow: true }
      },
      {
        path: '/college/clouddetail',
        name: 'clouddetail',
        component: () => import('@/views/college/CloudDetail.vue'),
        meta: { requiresAuth: true, title: '云课堂详情', ifShow: true }
      },
      {
        path: '/college/train',
        name: 'pointtrain',
        component: () => import('@/views/college/PointTrain.vue'),
        meta: { requiresAuth: true, title: '点位训练', ifShow: true }
      }
    ]
  },
  {
    path: '/market',
    name: 'market',
    component: () => import('@/views/Market.vue'),
    meta: { requiresAuth: false, title: '华粹商城', ifShow: true },
    redirect: '/market/index',
    children: [
      {
        path: '/market/index',
        name: 'marketindex',
        component: () => import('@/views/market/MarketIndex.vue'),
        meta: { requiresAuth: false, title: '华粹商城', ifShow: true }
      },
      {
        path: '/market/search',
        name: 'marketsearch',
        component: () => import('@/views/market/MarketSearch.vue'),
        meta: { requiresAuth: false, title: '商城搜索', ifShow: true }
      },
      {
        path: '/market/detail',
        name: 'marketdetail',
        component: () => import('@/views/market/MarketDetail.vue'),
        meta: { requiresAuth: false, title: '商品详情', ifShow: false }
      }
    ]
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('@/views/Community.vue'),
    meta: { requiresAuth: false, title: '社区', ifShow: true },
    redirect: '/community/index',
    children: [
      {
        path: '/community/index',
        name: 'communityindex',
        component: () => import('@/views/community/CommunityIndex.vue'),
        meta: { requiresAuth: false, title: '社区首页', ifShow: true }
      },
      {
        path: '/community/detail',
        name: 'communitydetail',
        component: () => import('@/views/community/CommunityDetail.vue'),
        meta: { requiresAuth: false, title: '社区详情', ifShow: true }
      }
    ]
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: () => import('@/views/ShopCart.vue'),
    meta: { requiresAuth: true, title: '我的购物车', ifShow: true },
    redirect: '/shopcart/my',
    children: [
      {
        path: '/shopcart/my',
        name: 'mycart',
        component: () => import('@/views/cart/MyCart.vue'),
        meta: { requiresAuth: true, title: '我的购物车', ifShow: true }
      },
      {
        path: '/shopcart/orders',
        name: 'orders',
        component: () => import('@/views/cart/Orders.vue'),
        meta: { requiresAuth: true, title: '我的订单', ifShow: true }
      }
    ]
  },
  {
    path: '/shopcart/settle',
    name: 'settle',
    component: () => import('@/views/cart/OrderSettle.vue'),
    meta: { requiresAuth: true, title: '订单结算', ifShow: true }
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/views/Sign.vue'),
    meta: { requiresAuth: true, title: '签到', ifShow: true }
  },
  {
    path: '/bookcircle',
    name: 'bookcircle',
    component: () => import('@/views/BookCircle.vue'),
    meta: { requiresAuth: true, title: '我的作品', ifShow: true }
  },
  {
    path: '/study',
    name: 'study',
    component: () => import('@/views/Study.vue'),
    meta: { requiresAuth: true, title: '我的学习', ifShow: true },
    children: [
      {
        path: '/study/my',
        name: 'mystudy',
        component: () => import('@/views/study/Studying.vue'),
        meta: { requiresAuth: true, title: '学习中', ifShow: true }
      },
      {
        path: '/study/works',
        name: 'works',
        component: () => import('@/views/study/Works.vue'),
        meta: { requiresAuth: true, title: '我的学习', ifShow: true }
      }
    ]
  },
  {
    path: '/publish',
    name: 'MyPublish',
    component: () => import('@/views/MyPublish.vue'),
    meta: { requiresAuth: true, title: '发布作品', ifShow: true }
  },
  {
    path: '/percenter',
    name: 'percenter',
    component: () => import('@/views/Percenter.vue'),
    meta: { requiresAuth: true, title: '个人中心', ifShow: true },
    redirect: '/percenter/mycount',
    children: [
      {
        path: '/percenter/mycount',
        name: 'mycount',
        component: () => import('@/views/percenter/MyCount.vue'),
        meta: { requiresAuth: true, title: '账号设置', ifShow: true },
      },
      {
        path: '/percenter/myaddress',
        name: 'myaddress',
        component: () => import('@/views/percenter/MyAddress.vue'),
        meta: { requiresAuth: true, title: '我的收货地址', ifShow: true },
      },
      {
        path: '/percenter/guide',
        name: 'guide',
        component: () => import('@/views/percenter/Guide.vue'),
        meta: { requiresAuth: true, title: '新人指南', ifShow: true },
      },
      {
        path: '/percenter/join',
        name: 'join',
        component: () => import('@/views/percenter/Join.vue'),
        meta: { requiresAuth: true, title: '加盟代理', ifShow: true },
      }
      ,
      {
        path: '/percenter/about',
        name: 'about',
        component: () => import('@/views/percenter/About.vue'),
        meta: { requiresAuth: true, title: '关于我们', ifShow: true },
      }
    ]
  }
]

// const createRouter = new Router({
//   mode: 'history', // require service support
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRoutes
// })
const createRouter = () => new Router({
  mode: 'hash',
  base: process.env.BABEL_ENV,
  routes: constantRoutes
})

const router = createRouter()

export {
  constantRoutes,
  asyncRoutes
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
