import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  getToken
} from '@/libs/utils.js';
import NProgress from 'nprogress'
Vue.use(VueRouter)
/* Layout */
import Layout from '@/Layout/Index.vue'
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login', //登录页
    name: 'login',
    meta: { title: '登录页', hiddle: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/home', //首页
    name: 'home',
    redirect: '/index',
    meta: { title: '首页' },
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'index',
        meta: { title: '首页' },
        component: () => import('../views/Home/index/index.vue')
      },
      {
        path: '/exercise/task/list',
        name: 'exercise-task-list',
        meta: { title: '运动战' },
        component: () => import('../views/Home/exercise/task-list.vue'),
      },
    ]
  },
  {
    path: '/position',
    name: 'position',
    meta: { title: '阵地战' },
    component: Layout,
    children: [
      {
        path: '/position/detail',
        name: 'position-detail',
        meta: {
          hidden: true,
          title: '阵地明细'
        },
        component: () => import('../views/Home/position/detail.vue'),
      },
      {
        path: '/position/index',
        name: 'position-index',
        meta: {
          hidden: true,
          title: '任务列表'
        },
        component: () => import('../views/Home/position/index.vue'),
      },
      {
        path: '/position/add',
        name: 'position-add',
        meta: {
          hidden: true,
          title: '新增阵地'
        },
        component: () => import('../views/Home/position/add.vue'),
      },
    ]

  },
  {
    path: '/assault',
    name: 'assault',
    meta: { title: '攻坚战' },
    component: Layout,
    children: [
      {
        path: '/assault/detail',
        name: 'assault-detail',
        meta: {
          hidden: true,
          title: '阵地明细'
        },
        component: () => import('../views/Home/assault/detail.vue'),
      },
      {
        path: '/assault/index',
        name: 'assault-index',
        meta: {
          hidden: true,
          title: '任务列表'
        },
        component: () => import('../views/Home/assault/index.vue'),
      },
      {
        path: '/assault/add',
        name: 'assault-add',
        meta: {
          hidden: true,
          title: '新增任务'
        },
        component: () => import('../views/Home/assault/add.vue'),
      },
      
    ]
  },
  
  {
    path: '/function',
    name: 'function',
    meta: { title: '功能管理' },
    component: Layout,
    children: [
      {
        path: '/function/task/review',
        name: 'function-task-review',
        meta: { title: '任务审核' },
        component: () => import('../views/Home/function/task-review.vue'),
      },
      {
        path: '/function/apply/list',
        name: 'function-apply-list',
        meta: { title: '报名名单' },
        component: () => import('../views/Home/function/apply-list.vue'),
      },
      {
        path: '/function/outside/rewards',
        name: 'function-outside-rewards',
        meta: { title: '外部奖励' },
        component: () => import('../views/Home/function/outside-rewards.vue'),
      },
      {
        path: '/function/export/manage',
        name: 'function-export-manage',
        meta: { title: '导出管理' },
        component: () => import('../views/Home/function/export-manage.vue'),
      },
      {
        path: '/function/carnet/detail',
        name: 'function-carnet-detail',
        meta: { title: '闯关明细' },
        component: () => import('../views/Home/function/carnet-detail.vue'),
      },
      {
        path: '/function/develop',
        name: 'function-develop',
        meta: { title: '意见建议' },
        component: () => import('../views/Home/function/develop.vue'),
      },
    ]
  },
  {
    path: '/other',
    name: 'other',
    meta: { title: '其他' },
    component: Layout,
    children: [
      {
        path: '/feedback',
        name: 'feedback',
        meta: { title: '问题反馈' },
        component: () => import('../views/Home/other/feedback.vue'),
      },
      {
        path: '/operation',
        name: 'operation',
        meta: { title: '操作日志' },
        component: () => import('../views/Home/other/operation.vue'),
      }
    ]
  },
  {
    path: '*', //登录页
    name: 'error',
    meta: { title: '404页'},
    component: () => import('../views/error.vue')
  },
]
const router = new VueRouter({
  routes,
  // mode: 'history',
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = '元家军小程序后台-' + to.meta.title
  const token = getToken()
  if (to.path === '/login') return next();
  if (!token) return next('/login');
  setTimeout(() => {
    next()
  }, 500)
});
router.afterEach((to, from) => {
  //跳转后你要做的事情
  NProgress.done()
})
//路由拦截
// to 将要访问的路径
// from 代表从哪个路径跳转而来
// next 是一个函数，表示放行
//     next()  放行    next('/login')  强制跳转
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') return next();
//   const tokenstr = window.sessionStorage.getItem('token')
//   if (!tokenstr) return next('/login');
//   next()
// if(!tokenstr){
//   if(to.path !== '/login'){
//     next('/login');
//   }
// }
// next()
// })

export default router
  

 
