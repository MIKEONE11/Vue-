import request from '@/utils/request'

// 获取Spu列表数据的接口
// /admin/product/{page}/{limit}      get     参数：page,limit,category3Id
export const reqSpuList = (page,limit,category3Id) => request({
  url: `production/admin/product/${page}/${limit}`,
  method: 'get',
  params: {category3Id}
})



//获取Spu信息
// /admin/product/getSpuById/{spuId}      get     参数spuId
export const reqGetSpu = (spuId) => request({
  url: `production/admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌信息
// /admin/product/baseTrademark/getTrademarkList        get
export const reqTrademarkList = () => request({
  url: 'production/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})

//获取Spu图片接口
// /admin/product/spuImageList/{spuId}      get
export const reqSpuImageList = (spuId) => request({
  url: `production/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取平台全部销售属性       ----整个平台销售属性一共3个
// /admin/product/baseSaleAttrList       get
export const reqBasealeAttrList = () => request({
  url: 'production/admin/product/baseSaleAttrList',
  method: 'get'
})

// 添加||修改spu接口：对于修改或添加携带给服务器的参数是大致一样的，唯一的区别就是携带的参数是否带有id
// /admin/product/saveSpuInfo       post
export const reqAddOrUpdateSpuInfo = (spuInfo) => {
  // 携带的参数带有id----修改Spu
  if (spuInfo.id) {
    return request({
      url: 'production/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    // 不携带参数id ---- 添加Spu
    return request({
      url: 'production/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除Spu接口
// /admin/product/deleteSpu/{spuId}    delete
export const reqDeleteSpu = (spuId) => request({
  url: `production/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})

// 获取图片的接口
// /admin/product/spuImageList/{spuId}      get
export const reqSpuImgList = (spuId) => request({
  url: `production/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId}     get
export const reqSpuSaleAttrList = (spuId) => request({
  url: `production/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}    get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `production/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: "get"
})


// 添加sku接口
// /admin/product/saveSkuInfo   post
// 参数：
/*
{
  "category3Id": 0,
  "createTime": "2023-04-03T15:25:11.846Z",
  "id": 0,
  "isSale": 0,
  "price": 0,
  "skuAttrValueList": [{
    "attrId": 0,
    "attrName": "string",
    "id": 0,
    "skuId": 0,
    "valueId": 0,
    "valueName": "string"
  }],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [{
    "id": 0,
    "imgName": "string",
    "imgUrl": "string",
    "isDefault": "string",
    "skuId": 0,
    "spuImgId": 0
  }],
  "skuName": "string",
  "skuSaleAttrValueList": [{
    "id": 0,
    "saleAttrId": 0,
    "saleAttrName": "string",
    "saleAttrValueId": 0,
    "saleAttrValueName": "string",
    "skuId": 0,
    "spuId": 0
  }],
  "spuId": 0,
  "tmId": 0,
  "weight": "string"
}
 */
export const reqAddSku = (skuInfo) => request({
  url: 'production/admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})

// 获取sku列表数据的接口
// /admin/product/findBySpuId/{spuId}     get
export const reqFindBySpuId = (spuId) => request({
  url: `production/admin/product/findBySpuId/${spuId}`,
  method: 'get'
})