import {request} from '@/utils/request'

/*商城首页信息*/
export function getMallIndexInfo(data) {
  return request('/mall-info/getMallIndexInfo', data)
}

/*商城分类导航*/
export function getProductCategoryInfo(data) {
  return request('/mall-info/getProductCategoryInfo', data)
}

/*商品搜索*/
export function productSearch(data) {
  return request('/mall-info/productSearch', data)
}

/*获取商品详情*/
export function getProductInfo(data) {
  return request('/mall-info/getProductInfo', data)
}

/*获取商品详情*/
export function getProductCommentList(data) {
  return request('/product-comment/getProductCommentList', data)
}
