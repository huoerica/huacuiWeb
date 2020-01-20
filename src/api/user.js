import {request} from '@/utils/request'

/*手机验证码*/
export function sendSmsCodeHttp(data) {
  return request('/sms/sendSmsCode', data)
}

/*登录*/
export function login(data) {
  return request('/user/login', data)
}

/*注册*/
export function registerHttp(data) {
  return request('/user/register', data)
}

/*个人信息*/
export function getInfo(data) {
  return request('/user/getUserInfoIndex', data)
}

/*更新个人信息*/
export function updateUserInfo(data) {
  return request('/user/updateUserInfo', data)
}

/*上传文件【头像】*/
export function updateUserPhoto(data) {
  return request('/file/upload/image', data)
}


/*退出*/

/*首页*/
export function getIndexInfo(data) {
  return request('/user/getIndexInfo', data)
}

