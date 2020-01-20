import {request} from '@/utils/request'

/**
 * 获取订单列表
 *  page: 页码(默认第一页)
 *  pageSize
 * status: 订单状态（不传查询所有)
 **/
export function getOrderList(data) {
    return request('/orders/getOrderList', data)
}


/**
 * 删除订单
 * orderNo: 订单编号
 **/
export function deleteOrder(data) {
    return request('/orders/deleteOrder', data)
}

/**
 * 下单
 * source: 下单来源：1 购物车 2 立即购买 3 云课堂
 * userAddressId: 收货地址编号
 * productCartIds: 购物车编号集合
 * productId: 购买商品编号
 * score: 使用积分
 *
 * buyNumber: 购买商品数量
 **/
export function orderProduct(data) {
    return request('/orders/orderProduct', data)
}

/**
 * 积分兑换试算
 * score: 订单编号
 **/
export function getConversionMoney(data) {
    return request('/user-scores/getConversionMoney', data)
}

/**
 * 获取单个订单信息
 * orderNo: 订单编号
 **/
export function getOrderOne(data) {
    return request('/orders/getOrderOne', data)
}
