/*

 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-18 10:02:08
 * @LastEditTime: 2019-10-19 15:44:40
 * @LastEditors: Please set LastEditors
 */
import { axios } from '@/utils/request'

export function tasksList (parameter) {
  return axios({
    url: '/tasks',
    method: 'get',
    params: parameter
  })
}

export function taskDetail (id) {
  return axios({
    url: '/tasks/' + id,
    method: 'get'
  })
}

export function spreadTrends (id, parameter) {
  return axios({
    url: '/tasks/' + id + '/spread-trends',
    method: 'get',
    params: parameter
  })
}

export function addTask (parameter) {
  return axios({
    url: '/tasks',
    method: 'post',
    data: parameter
  })
}

export function delTask (id) {
  return axios({
    url: '/tasks/' + id,
    method: 'delete'
  })
}

export function editTask (parameter, id) {
  return axios({
    url: '/tasks/' + id,
    method: 'put',
    data: parameter
  })
}

export function taskCovers (parameter) {
  return axios({
    url: '/task-covers',
    method: 'post',
    data: parameter
  })
}

export function taskPosters (parameter) {
  return axios({
    url: '/task-posters',
    method: 'post',
    data: parameter
  })
}

export function downloadTask () {
  return axios({
    url: '/export-tasks',
    method: 'get'
  })
}

export function taskContents (parameter) {
  return axios({
    url: '/task-contents',
    method: 'post',
    data: parameter,
    timeout: true
  })
}
