import http from '@/utils/http'
export default {
  // 获取列表
  getList: data => {
    return http.construction.post('/project/acceptance/page', data)
  },
  delete: id => {
    return http.construction.get(`/project/acceptance/delete/${id}`)
  },
  add: data => {
    return http.construction.post('/project/acceptance/add', data)
  },
  update: data => {
    return http.construction.post('/project/acceptance/update', data)
  },
  getDetail: id => {
    return http.construction.get(`project/acceptance/view/${id}`)
  },
  //验收方提交验收
  inspect: data => {
    return http.construction.post('/project/acceptance/fill', data)
  },
  //通知整改
  noticeRectify: data => {
    return http.construction.post('/project/acceptance/orderRectify', data)
  },
  //填写整改
  rectify: data => {
    return http.construction.post('/project/acceptance/rectify', data)
  },
  //填写复检结果
  review: data => {
    return http.construction.post('/project/acceptance/review', data)
  },
}
