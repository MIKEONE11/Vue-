// 获取品牌管理的数据的模块
// /admin/product/baseTrademark/{page}/{limit}        get
import request from '@/utils/request'

// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({
  url: `production/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 新增品牌
// /admin/product/baseTrademark/save      post
// 注意：对于新增品牌，给服务器传递参数时不需要携带id，id是由服务器生成的

// 修改品牌
// /admin/product/baseTrademark/update          put       携带三个参数：id  logoUrl  tmName

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 修改品牌
  if (tradeMark.id) {
    return request({
      url: 'production/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    // 添加品牌
    return request({
      url: 'production/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌
// /admin/product/baseTrademark/remove/{id}       delete
export const reqDeleteTradeMark = (id) => request({
  url: `production/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})

