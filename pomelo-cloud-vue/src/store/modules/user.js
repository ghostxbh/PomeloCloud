import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  Login({ commit }, userInfo) {
    const { username, password, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  GetInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        const user = res.user
        const avatar = user.avatar == "" ? require("@/assets/images/profile.png") : process.env.VUE_APP_BASE_API + user.avatar;
        if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', res.roles)
          commit('SET_PERMISSIONS', res.permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_NAME', user.userName)
        commit('SET_AVATAR', avatar)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit, state }) {
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

