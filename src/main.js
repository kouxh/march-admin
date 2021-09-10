import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import Fragment from 'vue-fragment'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import cookie from 'js-cookie'; // cookie
// 导入全局样式表
import './assets/css/global.css'
//加入接口 api
import api from './api/api.js'; // 引入 api
import less from 'less'
Vue.use(less)
Vue.use(ElementUI);
Vue.use(Fragment.Plugin)
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$cookie = cookie;
Vue.prototype.$http=axios;
// axios.defaults.baseURL = ''

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
