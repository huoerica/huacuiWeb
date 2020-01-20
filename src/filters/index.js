export {parseTime, formatTime} from '@/utils'
import AREA from '../../public/area.js'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}


/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    {value: 1E18, symbol: 'E'},
    {value: 1E15, symbol: 'P'},
    {value: 1E12, symbol: 'T'},
    {value: 1E9, symbol: 'G'},
    {value: 1E6, symbol: 'M'},
    {value: 1E3, symbol: 'k'}
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function moneyFilter(money) {
  if (money !== null) {
    // return money ? ('¥' + money) : '¥0'
    return '¥' + (isNaN(money) ? 0.00 : parseFloat((money / 100).toFixed(2)).toFixed(2));
  } else {
    return 0.00
  }
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 省市区中文
 * @param money
 * @returns {string}
 */
const findOne = (list = [], value = '') => {
  if (list && list.length > 0) {
    return list.find(item => item.value === value)
  }
  return null
}

export function addressCN(areaIdPath) {
  let result = ''
  if (areaIdPath !== null && areaIdPath !== '') {
    areaIdPath = areaIdPath.split('_')
    let provience = findOne(AREA, areaIdPath[0])
    if (provience) {
      result += provience.label
      let city = findOne(provience.children, areaIdPath[1])
      result += city.label
      let area = findOne(city.children, areaIdPath[2])
      result += area ? area.label : ''
    }
  }
  return result
}
