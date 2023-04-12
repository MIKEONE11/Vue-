import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/admin/acl/index/login',
//     method: 'post',
//     data
//   })
// }

export const login = (data) => request({
  url: 'user/admin/acl/index/login',
  method: 'post',
  data
})

export function getInfo(token) {
  return request({
    url: 'user/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'user/admin/acl/index/logout',
    method: 'post'
  })
}
