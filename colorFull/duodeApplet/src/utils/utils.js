/**
 * 工具函数
 * author: gjl
*/

// 获取时间
function getCurrentTime() {
  let keep = ''
  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  keep = y + '' + m + '' + d + '' + h + '' + f + '' + s
  return keep // 20160614134947
}

// 得到时间格式2019-06-04
let currentDate = null
const formatDate = date => {
  currentDate = date
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  currentDate = [year, month, day].map(formatNumber).join('-')
  return currentDate
}
// 转化个位数时间：如6-06
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取当前的时间格式：06/04
function getCurrentDate (date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [month, day].map(formatNumber).join('/')
}

// nowdate默认参数是当前日期，格式为2019-06-04
function getDates(days, nowdate) {
  var dateArry = []
  // 获取当前日期前后15天的时间
  for (var i = -15; i < days; i++) {
    var dateObj = dateLater(nowdate, i)
    dateArry.push(dateObj)
  }
  return dateArry
}
function dateLater(nowdate, later) {
  let dateObj = {}
  let show_day = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  // 转化成当前国际标准时间
  let date = new Date(nowdate)
  // 设置i天以后的时间
  date.setDate(date.getDate() + later)
  let day = date.getDay()
  let year = date.getFullYear()
  let month = ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1)
  let dayFormate = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate())
  dateObj.time = month + '/' + dayFormate
  let otherDate = [year, month, dayFormate].map(formatNumber).join('-')
  if (otherDate === currentDate) {
    dateObj.week = '今天'
  } else {
    dateObj.week = show_day[day]
  }
  return dateObj
}

// 判断是否是空对象
function isEmptyObject(o) {
  let empty = false
  if (Object.keys(o).length === 0) {
    empty = true
  }
  return empty
}

module.exports = {
  getCurrentTime: getCurrentTime,
  formatDate: formatDate,
  getDates: getDates,
  getCurrentDate: getCurrentDate,
  isEmptyObject: isEmptyObject
}
