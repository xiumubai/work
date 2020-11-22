/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-14 19:54:56
 * @LastEditTime: 2019-10-16 16:23:22
 * @LastEditors: Please set LastEditors
 */
import { axios } from '@/utils/request'

/*
 * 组织架构
 * 部门管理api
 * 员工管理api
 */

// 部门管理api
export function getDepartments (parameter) {
  return axios({
    url: '/departments',
    method: 'get',
    params: parameter
  })
}

export function addDepartments (parameter) {
  return axios({
    url: '/departments',
    method: 'post',
    data: parameter
  })
}

export function editDepartments (parameter, id) {
  return axios({
    url: '/departments/' + id,
    method: 'put',
    params: parameter
  })
}

export function delDepartments (id) {
  return axios({
    url: '/departments/' + id,
    method: 'delete'
  })
}

// 员工管理api
export function getStaffs (parameter) {
  return axios({
    url: '/staffs',
    method: 'get',
    params: parameter
  })
}

export function addStaffs (parameter) {
  return axios({
    url: '/staffs',
    method: 'post',
    data: parameter
  })
}

export function editStaffs (parameter, id) {
  return axios({
    url: '/staffs/' + id,
    method: 'put',
    data: parameter
  })
}

export function delStaffs (id) {
  return axios({
    url: '/staffs/' + id,
    method: 'delete'
  })
}

export function downloadStaffs () {
  return axios({
    url: '/import-staffs',
    method: 'get',
    responseType: 'blob'
  })
}

export function importStaffs (parameter) {
  return axios({
    url: '/import-staffs',
    method: 'post',
    processData: false,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: parameter
  })
}

export function exportStaffs (parameter) {
  return axios({
    url: '/export-staffs',
    method: 'get',
    params: parameter
  })
}
