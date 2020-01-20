import {request} from '@/utils/request'

/**
 * 获取公开课程列表
 * type： 课程类型：1公开课，2云课堂.[暂不适用云课堂查
 * courseName： 课程名称
 * */
export function getCourseList(data) {
  return request('/course-info/list', data)
}

/**
* 获取公开课程详情
* courseId
* */
export function getCourseOpenDetail(data) {
  return request('/course-info/open/detail/'+data)
}

/**
* 获取云课堂子目录+章节视频列表信息
* catalogId： 目录ID
* courseId： 课程ID
* */
export function getCourseCatalog(data) {
  return request('/course-info/catalog/'+data)
}

/**
 * 获取云课程详情+套餐信息+目录列表
 * catalogId： 目录ID
 * courseId： 课程ID
 * */
export function getCourseDetail(data) {
  return request('/course-info/detail/' + data)
}


/**
 * 获取章节详情
 * chapterId： 课程章节ID
 * */
export function getCourseChapterDetail(data) {
  return request('/course-chapter-info/detail/' + data)
}

/**
 * 搜索章节列表
 * keyWord：搜索关键字
 * */
export function searchCourseChapter(data) {
  return request('/course-chapter-info/search', data)
}


/**
 * 获取课程/章节评论列表
 * chapterId：章节ID
 * courseId: 课程ID/看课程评论时传
 * page:
 * pageSize:
 * */
export function getCourseCommentList(data) {
  return request('/course-comment-detail/list', data)
}

/**
 * 添加课程评论
 * chapterId：章节ID
 * courseId: 课程ID/看课程评论时传
 * commentContent: 评论内容
 * commentImages: 评论图片，多张分号隔开
 * */
export function addCourseComment(data) {
  return request('/course-comment-detail/addComment', data)
}

/**
 * 提交学习作业
 * chapterId：搜索关键字
 * courseId: 课程ID/看课程评论时传
 * workImage: 课后作业练习URL
 * remark: 备注
 * */
export function submitCourseWork(data) {
  return request('/course-user-work-info/submit', data)
}

/**
 * 同步学习时长/30s同步一次
 * chapterId：搜索关键字
 * courseId: 课程ID/看课程评论时传
 *
 * chapterExercise: 课后练习
 * lastLearnTime: 最后学习的时间/秒 [int]
 * learnTime: 学习时间/秒 [int]
 * remark: 备注
 * */
export function syncLearn(data) {
  return request('/course-user-learn-info/syncLearn', data)
}

/**
 * 获取用户积分排名信息
 * page:
 * pageSize:
 * */
export function getUserRakingInfo(data) {
  return request('/user/getUserRakingInfo', data)
}

/**
 * 购买云课程
 * courseId：课程ID
 * mealId: 套餐ID
 * payPrice: 支付价格
 * userDeliveryAddressId: 收货地址编号/选择套餐商品后必传
 * */
export function purchaseCourse(data) {
  return request('/course-order-info/purchase', data)
}

/**
 * 查询云课程订单信息
 * orderNo：订单ID
 * */
export function queryOrder(data) {
  return request('/course-order-info/queryOrder', data)
}
