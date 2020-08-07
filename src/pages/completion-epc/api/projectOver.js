import http from '@/utils/http'
export default {
  //获取列表
  getList: data => {
    return http.construction.post(`/project/transfer/page`, {
      ...data
    })
  },
  //项目移交-修改
  getUpdate: data => {
    return http.construction.post(`/project/transfer/update`, {
      ...data
    })
  },
  //项目移交-详情
  getDetail: id => {
    return http.construction.get(`/project/transfer/view/${id}`)
  },
  //项目移交-移交状态
  getTurnOver: id => {
    return http.construction.get(`/project/transfer/turn/${id}`)
  }
}
