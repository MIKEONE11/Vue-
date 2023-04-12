import mockRequest from '@/utils/mock-request'

const state = {
  list: {}
};
// mutations:修改state的唯一手段
const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
};
// actions:处理actions，可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 发请求获取首页mock数据
  async getData({commit}) {
    let res = await mockRequest.get('./home/list')
    if (res.code == 20000) {
      commit('GETDATA', res.data)
    }
  }
};
// getters: 理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
// 可以把将来在组件当中需要用到的数据简化一下（将来组件获取数据的时候就方便了）
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
}