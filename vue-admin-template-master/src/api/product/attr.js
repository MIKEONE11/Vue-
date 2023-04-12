// 平台属性管理模块请求接口
import request from '@/utils/request'

// 获取一级分类接口
// /admin/product/getCategory1    get
export const reqCategory1List = () => request({
  url: 'production/admin/product/getCategory1',
  method: 'get'
})

// 获取二级分类接口
// /admin/product/getCategory2/{category1Id}    get
export const reqCategory2List = (category1Id) => request({
  url: `production/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

// 获取三级分类接口
// /admin/product/getCategory3/{category2Id}    get
export const reqCategory3List = (category2Id) => request({
  url: `production/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取平台属性接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}      get
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `production/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加属性与属性值的接口
// /admin/product/saveAttrInfo    post
/*
{     参数说明
  "attrName": "string",     属性名
  "attrValueList": [{       属性值列表
    "attrId": 0,            属性名id
    "valueName": "string"   属性值
  }],
  "categoryId": 0,          category3Id
  "categoryLevel": 0,       3
} 
*/
export const reqAddOrUpdateAttr = (data) => request({
  url: 'production/admin/product/saveAttrInfo',
  method: 'post',
  data
})

// 删除属性
// /admin/product/deleteAttr/{attrId}    delete
export const reqDeleteAttr = (attrId) => request({
  url: `production/admin/product/deleteAttr/${attrId}`,
  method: 'delete'
})
