import fetch from './http';
//方式-
// export const login = (params) => {
//   return fetch.fetchPost('/march/admin/login', params);
// };
//方式二
export default {
  /**
  * [登陆]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  login(params) {
    return fetch.fetchPost('/march/admin/login', params);
  },
  /**
   * [战地列表]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  positionList(params) {
    return fetch.fetchGet('/march/admin/position.list', params);
  },
  /**
  * [新增阵地]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  positionAdd(params) {
    return fetch.fetchPost('march/admin/position.add', params);
  },
}
