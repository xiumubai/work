/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-24 15:47:05
 * @LastEditors: Please set LastEditors
 */

import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {}
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: '/login-mobile-code',
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: '/auth/user',
    method: 'get'
  })
}

export function logout () {
  return axios({
    url: '/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function refreshToken () {
  return axios({
    url: '/refresh-token',
    method: 'post'
  })
}

export function getRegionCodes () {
  return axios({
    url: '/util/region-codes',
    method: 'get'
  })
}
