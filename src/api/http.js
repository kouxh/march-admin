/**
 *
 * http配置
 */
import axios from 'axios';
import qs from 'qs'
import config from '@/config';
import router from '../router/index';
import store from '../store/index';
import Cookies from 'js-cookie'
import { getToken } from '../libs/utils';

// axios 配置
axios.defaults.timeout = 500000;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
console.log(axios.defaults.baseURL, 'axios.defaults.baseURLaxios.defaults.baseURL')
console.log(config.baseUrl.dev, '测试')
console.log(config.baseUrl.pro, '正式')
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // console.log(config, '---33--')
  // 在发送请求之前做些什么
  // 判断是否存在token，如果存在的话，则每个http header都加上token
  // const token = Cookies.get('token')
  if (getToken()) {
    config.headers['Admin-Token'] = getToken();
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
});
// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // console.log(response, '---444--')
  // 对响应数据做点什么
  if (response.data.errCode == 41000) {
    router.replace({
      name: 'login',
    });
    Cookies.remove("token");
    // this.$message.error('当前登录状态已过期，请重新登录！');
  }
  return response;
}, (error) => {
  console.log(error,'errorer5555ror')
  // 对响应错误做点什么
  // if (error.response) {
  // switch (error.response.status) {
  //   case 401:
  //     //401 清除token信息并跳转到登录页面
  //     router.replace({
  //       name: '/login',
  //       query: {
  //         redirect: router.currentRoute.fullPath
  //       }
  //     });
  //     break;
  // }
  // }
  return Promise.reject(error.response);
});
// http response 拦截器
// instance.interceptors.response.use(
//     response => {
//       //拦截响应，做统一处理 
//       if (response.data.code) {
//         switch (response.data.code) {
//           case 1002:
//             store.state.isLogin = false
//             router.replace({
//               path: 'login',
//               query: {
//                 redirect: router.currentRoute.fullPath
//               }
//             })
//         }
//       }
//       return response
//     },
//     //接口错误状态处理，也就是说无响应时的处理
//     error => {
//       return Promise.reject(error.response.status) // 返回接口返回的错误信息
//     })
export default {
  // fetchPost  请求方式 创建
  fetchPost: function (url, params, query) {
    let urls = url;
    if (query) {
      urls = url + '?' + query;
    } else {
      urls = url;
    }
    return new Promise((resolve, reject) => {
      axios.post(urls, params)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // GET 请求方式 查看
  fetchGet: function (url, params, header) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
        responseType: header ? header.responseType : 'json'
      })
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // put请求方式 更新
  fetchPut:function(url, params, query){
    let urls = url;
    if (query) {
      urls = url + '?' + query;
    } else {
      urls = url;
    }
    return new Promise((resolve, reject) => {
      axios.put(urls, params,{
        responseType: header ? header.responseType : 'json'
      })
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        });
    })
  },
  // delete请求方式 删除 
  fetchDel:function(url, params, header){
    return new Promise((resolve, reject) => {
      axios.delete(url, {
        params: params,
        responseType: header ? header.responseType : 'json'
      })
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        });
    })
  },
};