/*
 * @Description: In User Settings Edit
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-19 13:47:12
 * @LastEditors: Please set LastEditors
 */
import { axios } from '@/utils/request'

export function getDepartmentList (parameter) {
  return axios({
    url: '/util/departments',
    method: 'get',
    params: parameter
  })
}

export function getRolesList (parameter) {
  return axios({
    url: '/util/roles',
    method: 'get',
    params: parameter
  })
}

export function pointAccounts (parameter) {
  return axios({
    url: '/point-accounts',
    method: 'get',
    params: parameter
  })
}

export function managerList (parameter) {
  return axios({
    url: '/admins',
    method: 'get',
    params: parameter
  })
}

export function addmanager (parameter) {
  return axios({
    url: '/admins',
    method: 'post',
    data: parameter
  })
}

export function delmanager (id) {
  return axios({
    url: '/admins/' + id,
    method: 'delete'
  })
}

export function edtimanager (id, parameter) {
  return axios({
    url: '/admins/' + id,
    method: 'put',
    data: parameter
  })
}

export function getWechatReply () {
  return axios({
    url: '/wechat/replies/get',
    method: 'get'
  })
}
export function saveWechatReply (parameter) {
  return axios({
    url: '/wechat/replies/store',
    method: 'post',
    data: parameter
  })
}
export function deleteWechatReply (parameter) {
  return axios({
    url: '/wechat/replies/destroy',
    method: 'post',
    data: parameter
  })
}
export function getWechatMenu () {
  return axios({
    url: '/wechat/menus/get',
    method: 'get'
  })
}
export function saveWechatMenuToWechat () {
  return axios({
    url: '/wechat/menus/storeWechat',
    method: 'post'
  })
}
export function deleteWechatMenuToWechat () {
  return axios({
    url: '/wechat/menus/deleteWechat',
    method: 'post'
  })
}
export function saveWechatMenu (parameter) {
  return axios({
    url: '/wechat/menus/store',
    method: 'post',
    data: parameter
  })
}
export function getTemlateMessageList (parameter) {
  return axios({
    url: '/wechat/templatemessages',
    method: 'get',
    data: parameter
  })
}
export function editTemplateMessage (parameter) {
  return axios({
    url: '/wechat/wechat/templatemessages/edit',
    method: 'get',
    data: parameter
  })
}
export function updateTemplateMessage (parameter) {
  return axios({
    url: '/wechat/templatemessages/',
    method: 'post',
    data: parameter
  })
}
export function getAliossParams () {
  return axios({
    url: '/alioss/params',
    method: 'get'
  })
}
export function uploadAliossFile (url, file) {
  return axios({
    url: url,
    method: 'post',
    data: file
  })
}
