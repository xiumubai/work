/**
 * production: appId = wx2622284418c2c641  __BASE_URL__ = 'https://duode.youlinkin.com/api/wxmini'
 * trial: appId = wx2622284418c2c641 __BASE_URL__ = https://duode-uat.youlinkin.com/api/wxmini
 * development: appId = wx5d7f1a9c4e9505b2  __BASE_URL__ = 'https://duode-test.youlinkin.com/api/wxmini'
 */

// 域名
// export const __BASE_URL__ = wepy.$appConfig.baseUrl
export const __BASE_URL__ = version()

/**
 * 用户信息
 * @type {String}
 */
export const USER_INFO = 'userInfo' // 用户信息

export const ACCESS_TOKEN = 'access_token' // token信息

export const ACCESS_TOKEN_EXPIRED_AT = 'access_token_expired_at' // token过期时间

export const ISFOOLOWEDTAG = 'isFollowedTag' // 是否关注用户标签

export const ISUSERINFOGRANTED = 'isUserinfoGranted' // 是否已经授权

/**
 * 系统信息
 * @type {String}
 */
export const SYSTEM_INFO = 'systemInfo'

export const ADDRESS_ID = 'addressId'

export const SEL_CLASS_CODE = 'selClassCode'

/**
 * 版本信息
 * envVersion: 'develop',     //开发版
 * envVersion: 'trial',       //体验版
 * envVersion: 'release',     //正式版
*/
function version() {
  let version = __wxConfig.envVersion
  let platform = __wxConfig.platform
  if (version === 'develop') {
    return 'https://duode-test.youlinkin.com/api/wxmini'
  } else if (version === 'trial') {
    return 'https://duode-uat.youlinkin.com/api/wxmini'
  } else if (version === 'release') {
    return 'https://duode.youlinkin.com/api/wxmini'
  } else {
    // version = 'undefined'
    if (platform === 'devtools') {
      // 运行环境为微信开发者工具
      return 'https://duode-test.youlinkin.com/api/wxmini'
    } else {
      return 'https://duode.youlinkin.com/api/wxmini'
    }
  }
}
