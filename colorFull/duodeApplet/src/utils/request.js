/**
 * weRequest封装
 * author: 郭建利
*/

import wepy from 'wepy'
import api from '@/api/api'
import {
  __BASE_URL__,
  ACCESS_TOKEN,
  USER_INFO,
  ACCESS_TOKEN_EXPIRED_AT,
  ISFOOLOWEDTAG,
  ISUSERINFOGRANTED
} from '@/utils/constant'

const host = __BASE_URL__
// 普通请求
const request = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }
  // 拼接请求地址
  options.url = host + '/' + options.url
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (showLoading) {
  // 隐藏加载中
    wepy.hideLoading()
  }

  // 服务器异常后给与提示
  // if (response.statusCode === 500) {
  //   wepy.showModal({
  //     title: '提示',
  //     content: '服务器错误，请联系管理员或重试'
  //   })
  // }
  return response
}

// 登录，获取code，返回用户信息
const login = async (params = {}) => {
  // code 只能使用一次，所以每次单独调用
  let loginData = await wepy.login()
  params.code = loginData.code
  let authResponse = await request({
    url: api.authorizations,
    data: params,
    method: 'POST'
  }, false)

  // 登录成功，记录 token 信息
  if (authResponse.statusCode === 200) {
    wepy.setStorageSync(ACCESS_TOKEN, authResponse.data.data.accessToken)
    wepy.setStorageSync(ACCESS_TOKEN_EXPIRED_AT, new Date().getTime() + authResponse.data.data.expiresIn * 1000)
    wepy.setStorageSync(USER_INFO, authResponse.data.data.user)
    // 暂未使用
    wepy.setStorageSync(ISFOOLOWEDTAG, authResponse.data.data.user.isFollowedTag)
    wepy.setStorageSync(ISUSERINFOGRANTED, authResponse.data.data.user.isUserinfoGranted)
  }

  return authResponse
}

// 授权成功，更新用户信息
const updateUser = async () => {
  let userInfoResponse = await wepy.getUserInfo({
    lang: 'zh_CN'
  })
  let updateUserResponse = await authRequest({
    url: api.updateUsers,
    method: 'PUT',
    data: userInfoResponse
  }, false)
  if (updateUserResponse.statusCode === 200) {
    wepy.setStorageSync(USER_INFO, updateUserResponse.data.data)
  }
  return updateUserResponse
}

// 刷新 Token
const refreshToken = async (accessToken) => {
  // 请求刷新接口
  let refreshResponse = await wepy.request({
    url: host + '/' + api.updateToken,
    method: 'PUT',
    header: {
      'Authorization': 'Bearer ' + accessToken
    }
  })
  if (refreshResponse.statusCode === 200) {
    // 将 Token 及过期时间保存在 storage 中
    wepy.setStorageSync(ACCESS_TOKEN, refreshResponse.data.data.accessToken)
    wepy.setStorageSync(ACCESS_TOKEN_EXPIRED_AT, new Date().getTime() + refreshResponse.data.data.expiresIn * 1000)
  }

  return refreshResponse
}

// 获取 Token
const getToken = async (options) => {
  // 从缓存中取出 Token
  let accessToken = wepy.getStorageSync(ACCESS_TOKEN)
  let expiredAt = wepy.getStorageSync(ACCESS_TOKEN_EXPIRED_AT)

  // 如果 token 过期了，则调用刷新方法
  if (accessToken && new Date().getTime() > expiredAt) {
    let refreshResponse = await refreshToken(accessToken)

    // 刷新成功
    if (refreshResponse.statusCode === 200) {
      accessToken = refreshResponse.data.access_token
    } else {
      // 刷新失败了，重新调用登录方法，设置 Token
      let authResponse = await login()
      if (authResponse.statusCode === 200) {
        accessToken = authResponse.data.access_token
      }
    }
  }

  return accessToken
}

// 带身份认证的请求
const authRequest = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options,
      data: {
        // 添加formId
        formId: wx.getStorageSync('formId') || ''
      }
    }
  } else {
    // 添加formId
    options.data['formId'] = wx.getStorageSync('formId') || ''
  }
  // 获取Token
  let accessToken = await getToken()

  // 将 Token 设置在 header 中
  let header = options.header || {}
  header.Authorization = 'Bearer ' + accessToken
  options.header = header
  return request(options, showLoading)
}

//  退出登录
const logout = async (params = {}) => {
  let accessToken = wepy.getStorageSync(ACCESS_TOKEN)
  // 调用删除 Token 接口，让 Token 失效
  let logoutResponse = await wepy.request({
    url: host + '/' + api.authorizations,
    method: 'DELETE',
    header: {
      'Authorization': 'Bearer ' + accessToken
    }
  })

  // 调用接口成功则清空缓存
  if (logoutResponse.statusCode === 204) {
    wepy.clearStorage()
  }

  return logoutResponse
}

const updateFile = async (options = {}) => {
  // 显示loading
  wepy.showLoading({title: '上传中'})

  // 获取 token
  let accessToken = await getToken()

  // 拼接url
  options.url = host + '/' + options.url
  let header = options.header || {}
  // 将 token 设置在 header 中
  header.Authorization = 'Bearer ' + accessToken
  options.header = header
  // 上传文件
  let response = await wepy.uploadFile(options)

  // 隐藏 loading
  wepy.hideLoading()

  return response
}

/**
 * 登陆处理
 * 判断是否授权，是否关注用户标签
 * isUserinfoGranted:是否已经授权
 * 未授权，跳转到welcome页面
 * 已经授权，刷新用户信息，进行登陆
 */
let getCurrentUser = async () => {
  let authResponse = await login()
  if (authResponse.statusCode === 200) {
    let userInfo = authResponse.data.data.user
    if (!userInfo.isUserinfoGranted) {
      // 新用户,未授权,未关注用户标签,跳转到welcome
      wepy.reLaunch({
        url: '/pages/welcome'
      })
    } else {
      // 老用户,已授权,缓存用户的信息
      wepy.setStorageSync(USER_INFO, userInfo)
    }
  }
  return authResponse
}

export default {
  request,
  authRequest,
  refreshToken,
  login,
  logout,
  updateFile,
  updateUser,
  getCurrentUser
}
