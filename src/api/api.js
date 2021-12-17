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
    return fetch.fetchPost('/march/admin/position.add', params);
  },
  /**
  * [阵地删除]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  positionDel(params) {
    return fetch.fetchGet('/march/admin/position.del', params);
  },
  /**
  * [阵地编辑]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  positionEdit(params) {
    return fetch.fetchPost('/march/admin/position.edit', params);
  },
  /**
  * [新增任务]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskAdd(params) {
    return fetch.fetchPost('/march/admin/task.add', params);
  },
  /**
  * [任务列表]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskList(params) {
    return fetch.fetchGet('/march/admin/task.list', params);
  },
  /**
  * [任务删除]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskDel(params) {
    return fetch.fetchGet('/march/admin/task.del', params);
  },
  /**
  * [编辑任务]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskEdit(params) {
    return fetch.fetchPost('/march/admin/task.edit', params);
  },
  /**
  * [任务列表控制前端展示不展示该任务]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskShow(params) {
    return fetch.fetchGet('/march/admin/task.reception', params);
  },
  /**
  * [获取单条任务]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskGet(params) {
    return fetch.fetchGet('/march/admin/task.get', params);
  },
  /**
  * [审核列表]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  examineList(params) {
    return fetch.fetchGet('/march/admin/examine.list', params);
  },
  /**
  * [审核通过不通过（单条及批量）]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  examineCheck(params) {
    return fetch.fetchGet('/march/admin/examine.one', params);
  },
  /**
  * [根据任务ID搜索]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  examineSearch(params) {
    return fetch.fetchGet('/march/admin/examine.search', params);
  },
  /**
  * [任务搜索]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  taskSearch(params) {
    return fetch.fetchGet('/march/admin/task.search', params);
  },
  /**
  * [新增导出]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  exportAdd(params) {
    return fetch.fetchPost('/march/admin/export.add', params);
  },
  /**
  * [导出列表]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  exportList(params) {
    return fetch.fetchGet('/march/admin/export.list', params);
  },
  /**
  * [关注明细]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  followList(params) {
    return fetch.fetchGet('/march/admin/position.follow', params);
  },
  /**
  * [外部奖励]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  externalRewards(params) {
    return fetch.fetchPost('/march/admin/external.rewards', params);
  },

  /**
* [新消息通知列表]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  messageList(params) {
    return fetch.fetchGet('/march/admin/message.list', params);
  },
  /**
* [添加与编辑新消息通知]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  messageAdd(params) {
    return fetch.fetchPost('/march/admin/message.add.edit', params);
  },
  /**
* [新消息通知删除]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  messageDel(params) {
    return fetch.fetchGet('/march/admin/message.del', params);
  },
  /**
 * [问题反馈]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
  feedback(params) {
    return fetch.fetchGet('/march/admin/problem.feedback', params);
  },
  /**
  * [操作日志]
  * @param  {[type]} params [description]
  * @return {[type]}        [description]
  */
  operation(params) {
    return fetch.fetchGet('/march/admin/user.operation', params);
  },
  /**
 * [设置抽奖所需要的积分]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
  setIntegral(params) {
    return fetch.fetchPost('/march/admin/set.prize.set', params);
  },
  /**
* [抽奖奖品列表]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  drawList(params) {
    return fetch.fetchGet('/march/admin/luck.draw.list', params);
  },
  /**
* [抽奖奖品新增&编辑]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  drawAdd(params) {
    return fetch.fetchPost('/march/admin/luck.draw.add.edit', params);
  },
  /**
* [抽奖奖品删除]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  drawDel(params) {
    return fetch.fetchGet('/march/admin/luck.draw.del', params);
  },
  /**
* [中奖记录]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  winRecord(params) {
    return fetch.fetchGet('/march/admin/luck.winning.record', params);
  },
  /**
* [查看收货地址]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  cheackAddress(params) {
    return fetch.fetchGet('/march/admin/luck.view.receipt.information', params);
  },
  /**
* [徽章列表]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  badgeList(params) {
    return fetch.fetchGet('/march/admin/badge.list', params);
  },
  /**
* [徽章增加&编辑]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  badgeAdd(params) {
    return fetch.fetchPost('/march/admin/badge.add.edit', params);
  },
  /**
* [徽章删除]
* @param  {[type]} params [description]
* @return {[type]}        [description]
*/
  badgeDel(params) {
    return fetch.fetchGet('/march/admin/badge.del', params);
  },


}
