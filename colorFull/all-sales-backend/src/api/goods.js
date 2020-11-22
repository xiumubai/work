/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-24 16:05:58
 * @LastEditTime: 2019-10-29 14:56:00
 * @LastEditors: Please set LastEditors
 */
import { axios } from '@/utils/request'

export function getGoodsList (parameter) {
  return axios({
    url: '/goods',
    method: 'get',
    params: parameter
  })
}

export function addGoodCover (parameter) {
  return axios({
    url: '/goods-covers',
    method: 'post',
    data: parameter
  })
}

export function addGoods (parameter) {
  return axios({
    url: '/goods',
    method: 'post',
    data: parameter
  })
}

export function downloadGoodsCode (parameter) {
  return axios({
    url: '/import-goods-codes',
    method: 'get',
    params: parameter
  })
}

export function importGoodsCode (parameter) {
  return axios({
    url: '/import-goods-codes',
    method: 'post',
    data: parameter
  })
}

export function exportUnusedGoodsCode (id) {
  return axios({
    url: '/export-goods-codes/' + id,
    method: 'get'
  })
}

export function getGoodsDetail (id) {
  return axios({
    url: '/goods/' + id + '/edit',
    method: 'get'
  })
}

export function editGoods (parameter, id) {
  return axios({
    url: '/goods/' + id,
    method: 'put',
    data: parameter
  })
}

export function exchanges (parameter) {
  return axios({
    url: '/exchanges',
    method: 'get',
    params: parameter
  })
}

export function exchangesStatus (id) {
  return axios({
    url: '/exchanges-status/' + id,
    method: 'put'
  })
}

export function exchangeNotices () {
  return axios({
    url: '/exchange-notices',
    method: 'get'
  })
}

export function saveExchangeNotices (parameter) {
  return axios({
    url: '/exchange-notices',
    method: 'post',
    data: parameter
  })
}
