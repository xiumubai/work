/*

 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-28 15:53:33
 * @LastEditTime: 2019-10-28 20:09:45
 * @LastEditors: Please set LastEditors
 */
import { axios } from '@/utils/request'

export function getPointAccounts (parameter) {
  return axios({
    url: '/point/accounts',
    method: 'get',
    params: parameter
  })
}

export function getPointLogs (parameter) {
  return axios({
    url: '/point/logs',
    method: 'get',
    params: parameter
  })
}

export function addPoint (parameter) {
  return axios({
    url: '/point/add-points',
    method: 'post',
    data: parameter
  })
}

export function subPoint (parameter) {
  return axios({
    url: '/point/sub-points',
    method: 'post',
    data: parameter
  })
}

export function applyApproves (parameter) {
  return axios({
    url: '/point/apply-approves',
    method: 'get',
    params: parameter
  })
}

export function agreeApproves (id) {
  return axios({
    url: '/point/apply-approves/' + id,
    method: 'put'
  })
}

export function deleteApproves (id) {
  return axios({
    url: '/point/apply-approves/' + id,
    method: 'delete'
  })
}

export function applyPoint (parameter) {
  return axios({
    url: '/point/applies',
    method: 'post',
    data: parameter
  })
}

export function mineLogs (parameter) {
  return axios({
    url: '/point/mine-logs',
    method: 'get',
    data: parameter
  })
}

export function applies (parameter) {
  return axios({
    url: '/point/applies',
    method: 'get',
    data: parameter
  })
}
