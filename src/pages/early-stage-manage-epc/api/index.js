import http from '@/utils/http'
export default {
  //获取申报文件列表(父级)
  getParentTaskList: data => {
    return http.construction.post('/pre/task/parent/list', data)
  },
  getParentTaskDetail: id => {
    return http.construction.get(`/pre/task/parent/get/${id}`)
  },
  //暂存
  addParentTask: data => {
    return http.construction.post('/pre/task/parent/add', data)
  },
  deleteParentTask: id => {
    return http.construction.get(`/pre/task/delete/${id}`)
  },
  updateParentTask: data => {
    return http.construction.post('/pre/task/parent/update', data)
  },
  //提交
  submitParentTask: data => {
    return http.construction.post('/pre/task/parent/submit', data)
  },
  getChildTaskList: pid => {
    return http.construction.post(`/pre/task/child/list/${pid}`, {})
  },
  getChildTaskDetail: id => {
    return http.construction.get(`/pre/task/child/get/${id}`)
  },
  deleteChildTask: id => {
    return http.construction.get(`/pre/task/delete/${id}`)
  },
  //暂存
  addChildTask: data => {
    return http.construction.post('/pre/task/child/add', data)
  },
  //提交
  submitChildTask: data => {
    return http.construction.post('/pre/task/child/submit', data)
  },
  //填报人点击开始按钮
  handleStart: id => {
    return http.construction.get(`/pre/task/start/${id}`)
  },
  //保存进度填报
  addProcess: data => {
    return http.construction.post('/pre/task/fill/save', data)
  },
  //提交进度填报
  submitProcess: data => {
    return http.construction.post('/pre/task/fill/submit', data)
  },
  //审核通过
  passAudit: data => {
    return http.construction.post(`/pre/task/auditPass`, data)
  },
  //审核驳回
  rejectAudit: data => {
    return http.construction.post(`/pre/task/auditReject`, data)
  },
  //前期文件归档添加
  addFileArchive: data => {
    return http.construction.post('/pre/task/fill/save', data)
  },
  //前期文件归档提交审核
  submitFileArchive: data => {
    return http.construction.post('/pre/task/parent/submit', data)
  },
  //归档审核通过
  passArchiveAudit: data => {
    return http.construction.post(`/pre/task/auditPass`, data)
  },
  //归档审核驳回
  rejectArchiveAudit: data => {
    return http.construction.post(`/pre/task/auditReject`, data)
  }
}
