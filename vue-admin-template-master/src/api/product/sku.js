import request from "@/utils/request"

// 获取sku列表数据
// /admin/product/list/{page}/{limit}         get
export const reqSkuList = (page,limit) => request({
  url: `production/admin/product/list/${page}/${limit}`,
  method: 'get'
})

//上架
// /admin/product/onSale/{skuId}   get
export const reqSale = (skuId) => request({
  url: `production/admin/product/onSale/${skuId}`,
  method: 'get'
})


// 下架
// /admin/product/cancelSale/{skuId}      get
export const reqCancel = (skuId) => request({
  url: `production/admin/product/cancelSale/${skuId}`,
  method: 'get'
})

// 获取sku详情的接口
// /admin/product/getSkuById/{skuId}        get
export const reqSkuById = (skuId) => request({
  url: `production/admin/product/getSkuById/${skuId}`,
  method: 'get'
})
