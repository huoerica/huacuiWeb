import {request} from '@/utils/request'

/**
 * 签到记录
 **/
export function signRecordList(data) {
    return request('/user-sign-record/record', data)
}

/**
 * 签到操作
 **/
export function signRecord(data) {
    return request('/user-sign-record/sigin', data)
}
