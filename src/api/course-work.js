import {request} from '@/utils/request'

/**
 * 章节用户学习列表/根据积分排序
 *
 * chapterId： 章节ID
 * courseId： 课程ID
 * page:
 * pageSize
 * */
export function getUserWorkList(data) {
  return request('/course-user-work-info/getUserWorkList', data)
}

/**
 * 章节用户学习列表/根据积分排序
 *
 * chapterId： 章节ID
 * courseId： 课程ID
 * page:
 * pageSize
 * */
export function getCourseWorkList(data) {
  return request('/course-user-work-info/list', data)
}

/**
 * 提交学习作业
 *
 * chapterId： 章节ID
 * courseId： 课程ID
 * remark: 备注
 * workImage: 课后作业练习URL
 * */
export function submitCourseWork(data) {
  return request('/course-user-work-info/submit', data)
}
