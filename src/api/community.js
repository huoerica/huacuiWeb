import {request} from '@/utils/request'

/*获取社区信息*/
export function communityIndexInfo(data) {
  return request('/community-info/list', data)
}

/*获取社区详细信息 [ communityInfoId ]*/
export function communityDetail(data) {
  return request('/community-info/detail/' + data)
}

/*发布社区信息*/
export function communityPublish(data) {
  return request('/community-info/publish', data)
}

/*更新社区信息 [ communityInfoId ]*/
export function communityUpate(data) {
  return request('/community-info/update', data)
}

/*删除社区信息 [ communityInfoId ]*/
export function communityDelete(data) {
  return request('/community-info/delete/' + data)
}

/*社区评论*/
export function addCommentDetail(data) {
  return request('/community-comment-detail/addCommentDetail', data)
}

/*社区点赞*/
export function communityInterest(data) {
  return request('/community-interest-detail/editInterestDetail', data)
}

/*获取社区评论*/
export function getCommentDetail(data) {
  return request('/community-comment-detail/getCommentDetail', data)
}
