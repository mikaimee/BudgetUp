const state = {
    userInfo: null
}

const mutations = {
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    resetUserInfo(state) {
        state.userInfo = null;
    },
}

const actions = {
    setUser({ commit }, userInfo) {
        // Handle user login logic and commit userInfo to setUserInfo
        commit('setUserInfo', userInfo)
        // store user information in local storage
        localStorage.setItem('account', JSON.stringify(userInfo))
    },
    logout({ commit /*, state */ }) {
        // Handle user logout logic
        commit ('resetUserInfo')
        localStorage.removeItem('account')
    }
}

const getters = {
    getUserInfo: (state) => state.userInfo
}

export default {
    state,
    mutations,
    actions,
    getters
}