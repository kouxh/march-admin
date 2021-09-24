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
        meta: { title: '首页',affix: true },
        component: () => import('../views/Home/index/index.vue')
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
        path: '/position/manage/:type',
        name: 'position-manage',
        meta: {
          hidden: true,
          title: '阵地管理'
        },
        props:true,
        component: () => import('../views/Home/position/manage.vue'),
      },
      {
        path: '/position/task/list/:type',
        name: 'position-task-list',
        meta: {
          hidden: true,
          title: '任务列表'
        },
        props:true,
        component: () => import('../views/Home/position/task-list.vue'),
      },
      {
        path: '/position/task/add/:type',
        name: 'position-task-add',
        meta: {
          hidden: true,
          title: '新增阵地任务'
        },
        component: () => import('../views/Home/position/task-add.vue'),
      },
      {
        path: '/position/task/review/:type',
        name: 'position-task-review',
        meta: { title: '任务审核' },
        props:true,
        component: () => import('../views/Home/function/task-review.vue'),
      },
      {
        path: '/position/develop',
        name: 'position-develop',
        meta: { title: '意见建议' },
        component: () => import('../views/Home/function/develop.vue'),
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
        path: '/assault/manage/:type',
        name: 'assault-manage',
        meta: {
          hidden: true,
          title: '阵地管理'
        },
        props:true,
        component: () => import('../views/Home/position/manage.vue'),
        // component: () => import('../views/Home/assault/manage.vue'),
      },
      {
        path: '/assault/task/list/:type',
        name: 'assault-task-list',
        meta: {
          hidden: true,
          title: '任务列表'
        },
        props:true,
        component: () => import('../views/Home/position/task-list.vue'),
        // component: () => import('../views/Home/assault/task-list.vue'),
      },
      {
        path: '/assault/task/add/:type',
        name: 'assault-task-add',
        meta: {
          hidden: true,
          title: '新增阵地任务'
        },
        component: () => import('../views/Home/position/task-add.vue'),
        // component: () => import('../views/Home/assault/add.vue'),
      },
      {
        path: '/assault/task/review/:type',
        name: 'assault-task-review',
        meta: { title: '任务审核' },
        props:true,
        component: () => import('../views/Home/function/task-review.vue'),
      },
    ]
  },
  {
    path: '/exercise',
    name: 'exercise',
    meta: { title: '运动战' },
    component: Layout,
    children: [
      {
        path: '/exercise/manage/:type',
        name: 'exercise-manage',
        meta: {
          hidden: true,
          title: '阵地管理'
        },
        props:true,
        component: () => import('../views/Home/position/manage.vue'),
        // component: () => import('../views/Home/exercise/manage.vue'),
      },
      {
        path: '/exercise/task/list/:type',
        name: 'exercise-task-list',
        meta: {
          hidden: true,
          title: '任务列表'
        },
        props:true,
        component: () => import('../views/Home/position/task-list.vue'),
        // component: () => import('../views/Home/exercise/task-list.vue'),
      },
      {
        path: '/exercise/task/add/:type',
        name: 'exercise-task-add',
        meta: {
          hidden: true,
          title: '新增阵地任务'
        },
        // component: () => import('../views/Home/exercise/add.vue'),
        component: () => import('../views/Home/position/task-add.vue'),
      },
      {
        path: '/exercise/task/review/:type',
        name: 'exercise-task-review',
        meta: { title: '任务审核' },
        props:true,
        component: () => import('../views/Home/function/task-review.vue'),
      },
      {
        path: '/exercise/attention/detail',
        name: 'exercise-attention-detail',
        meta: { title: '关注明细' },
        component: () => import('../views/Home/function/carnet-detail.vue'),
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
    path: '*', //错误页
    name: 'error',
    meta: { title: '404页'},
    component: () => import('../views/error.vue')
  },
]
const router = new VueRouter({
  //  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes,
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
  

 
