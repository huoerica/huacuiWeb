import {request} from '@/utils/request'

/*加入购物车*/
export function addProductCart(data) {
    return request('/product-cart/addProductCart', data)
}


/*获取购物车列表*/
export function getProductCartList(data) {
    return request('/product-cart/getProductCartList', data)
}

/*移除购物车*/
export function removeProductCart(data) {
    return request('/product-cart/removeProductCart', data)
}

