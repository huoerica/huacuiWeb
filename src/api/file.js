import {httpFilePost, request} from '@/utils/request'

/*一个*/
export const uploadOne = '/file/upload/image'

/*多个*/
export function uploadMultiple(data) {
    return httpFilePost('/file/upload/images', data)
}

/*多个*/
export function uploadSingle(data) {
    return httpFilePost('/file/upload/image', data)
}

/*会员加盟*/
export function agentApply(data) {
    return request('/user-agent-info/agentApply', data)
}

/*会员加盟*/
export function getBannerInfo(data) {
    return request('/banner-info/info', data)
}

