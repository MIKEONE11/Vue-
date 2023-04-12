import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 服务器返回的菜单信息：【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
    routes: [],
    // 角色信息
    buttons: [],
    // 按钮权限信息
    roles: [],
    // 对比之后【项目中已有的异步路由:与服务器返回的标记信息进行对比最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token（持久化存储在cookie中）
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name;
    // 用户头像
    state.avatar = userInfo.avatar;
    // 菜单权限标记
    state.routes = userInfo.routes;
    // 按钮权限标记
    state.buttons = userInfo.buttons;
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes;
    //计算出当前用户需要展示所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

//定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1 
    if (routes.indexOf(item.name) != -1) {
      //递归:别忘记还有2、3、4、5、6级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 结构出用户名与密码
    const { username, password } = userInfo
    let res = await login({ username: username.trim(), password: password })
    // 当前登录使用的是mock数据
    if (res.code == 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
      return "ok"
    } else {
      return Promise.reject(new Error('fail'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // data：获取用户信息，返回的数据包含：用户名、用户头像、routes【返回的标识：不同的用户应该展示哪些菜单】、roles（用户角色信息）、bittons【按钮权限的信息】
        const { data } = response
        console.log(data.routes);
        //vuex存储所有的用户信息
        commit("SET_USERINFO", data);
        // 提交一个mutation，传入一个自己封装的函数调用作为参数
        commit("SET_RESULTASYNCROUTES", computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

