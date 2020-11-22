import { axios } from '@/utils/request'

export function rankStaffs (parameter) {
  return axios({
    url: '/rank/staffs',
    method: 'get',
    params: parameter
  })
}

export function rankDepartments (parameter) {
  return axios({
    url: '/rank/departments',
    method: 'get',
    params: parameter
  })
}

export function overviewQuantities (parameter) {
  return axios({
    url: '/statistics/overview-quantities',
    method: 'get',
    params: parameter
  })
}

export function taskQuantities (parameter) {
  return axios({
    url: '/statistics/task-quantities',
    method: 'get',
    params: parameter
  })
}

export function pointQuantities (parameter) {
  return axios({
    url: '/statistics/point-quantities',
    method: 'get',
    params: parameter
  })
}

export function spreadQuantities (parameter) {
  return axios({
    url: '/statistics/spread-quantities',
    method: 'get',
    params: parameter
  })
}

export function participationQuantities (parameter) {
  return axios({
    url: '/statistics/participation-quantities',
    method: 'get',
    params: parameter
  })
}

export function spreadTrends (parameter) {
  return axios({
    url: '/statistics/spread-trends',
    method: 'get',
    params: parameter
  })
}

export function pointTrends (parameter) {
  return axios({
    url: '/statistics/point-trends',
    method: 'get',
    params: parameter
  })
}

export function participationTrends (parameter) {
  return axios({
    url: '/statistics/participation-trends',
    method: 'get',
    params: parameter
  })
}
