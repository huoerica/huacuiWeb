import Cookies from 'js-cookie'
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
const OrderKey = 'orderInfo'
const state = {
    orderInfo: Cookies.getJSON(OrderKey)
}

const mutations = {
    SET_ORDER: (state, orderInfo) => {
        state.orderInfo = orderInfo
        Cookies.set(OrderKey, orderInfo)
    }
}

const actions = {
    initOrder({ commit }, orderInfo) {
        return new Promise((resolve) => {
            commit('SET_ORDER', orderInfo)
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
