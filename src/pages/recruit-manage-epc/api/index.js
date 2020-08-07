import http from '@/utils/http'
export default {
  // 招标管理
  getTenderList: data => {
    return http.construction.post('/epc/invitation/bid/list', data)
  },
  deleteTender: id => {
    return http.construction.get(`/epc/invitation/bid/delete/${id}`)
  },
  addTender: data => {
    return http.construction.post('/epc/invitation/bid/save', data)
  },
  submitTender: data => {
    return http.construction.post('/epc/invitation/bid/submit', data)
  },
  getTenderDetail: id => {
    return http.construction.get(`/epc/invitation/bid/get/${id}`)
  },
  publish: id => {
    return http.construction.get(`/epc/invitation/bid/publish/${id}`)
  },
  withdraw: id => {
    return http.construction.get(`/epc/invitation/bid/withdraw/${id}`)
  },
  audit: id => {
    return http.construction.get(`/epc/invitation/bid/auditPass/${id}`)
  },
  // 中标
  getWinningList: data => {
    return http.construction.post('/epc/tender/list', data)
  },
  addWinning: data => {
    return http.construction.post('/epc/tender/save', data)
  },
  deleteWinning: id => {
    return http.construction.get(`/epc/tender/delete/${id}`)
  },
  submitWinning: data => {
    return http.construction.post('/epc/tender/submit', data)
  },
  getWinningDetail: id => {
    return http.construction.get(`/epc/tender/get/${id}`)
  },
  getAvailableTenderList: projectId => {
    return http.construction.get(`/epc/tender/available/invitation/${projectId}`)
  }
}
