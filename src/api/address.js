import {request} from '@/utils/request'

/*获取用户收货地址*/
export function getAllAddress(data) {
    return request('/user-address/getAllAddress', data)
}


/*获取省市区信息*/
export function getAreas(data) {
    return request('/user-address/getAreas', data)
}

/*添加用户收货地址*/
export function insertAddress(data) {
    return request('/user-address/insertAddress', data)
}

/*更新用户收货地址*/
export function updateAddress(data) {
    return request('/user-address/updateAddress', data)
}

/*删除用户收货地址: addressId*/
export function deleteAddress(data) {
    return request('/user-address/deleteAddress', data)
}

