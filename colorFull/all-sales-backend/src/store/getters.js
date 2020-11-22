/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-14 15:04:08
 * @LastEditors: Please set LastEditors
 */
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  tokenExpiredAt: state => state.user.token_expired_at,
  authorized: state => !!state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
  multiTab: state => state.app.multiTab
}

export default getters
