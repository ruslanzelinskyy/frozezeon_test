export default new Vuex.Store({
    state: {
        login_status: localStorage.getItem('login_status') || '',
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || '',
        last_refill_status: localStorage.getItem('last_refill_status') || 0,
        last_buy_status: localStorage.getItem('last_buy_status') || 0,
        userMoney: localStorage.getItem('userMoney') || 0,
        userLikesCount: localStorage.getItem('userLikesCount') || 0,
        last_buy_likes_count: localStorage.getItem('last_buy_likes_count') || 0,
        last_add_comment_status: localStorage.getItem('last_add_comment_status') || 0,
    },
    mutations: {
        auth(state, payload) {
            localStorage.setItem('token', payload.token)
            localStorage.setItem('login_status', payload.status)
            localStorage.setItem('username', payload.username)
            localStorage.setItem('userMoney', payload.money)
            localStorage.setItem('userLikesCount', payload.likes)
        },
        auth_error(state) {
            localStorage.setItem('login_status', 'server-error')
        },
        auth_logout(state, payload) {
            localStorage.setItem('token', '')
            localStorage.setItem('login_status', payload.status)
            localStorage.setItem('username', '')
        },
        add_money(state, payload) {
            localStorage.setItem('last_refill_status', payload.last_refill_status)
            localStorage.setItem('userMoney', payload.result_balance)
        },
        buy_pack(state, payload) {
            localStorage.setItem('last_buy_status', payload.last_buy_status)
            localStorage.setItem('userLikesCount', payload.userLikesCount)
            localStorage.setItem('userMoney', payload.userMoney)
            localStorage.setItem('last_buy_likes_count', payload.last_buy_likes_count)
        },
        add_comment(state, payload) {
            localStorage.setItem('last_add_comment_status', payload.last_add_comment_status)
        }

    },
    actions: {
        authentificate({commit}, authFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/authentificate',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: authFormData,
                })
                    .then(response => {
                        const token = response.data.token
                        const status = response.data.status
                        const username = response.data.username

                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', {token, status, username})
                        resolve(response)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        authorize({commit}) {
            return new Promise((resolve, reject) => {
                let authFormData = new FormData();
                authFormData.set('token', localStorage.getItem('token'));
                axios({
                    url: '/main_page/authorize',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: authFormData,
                })
                    .then(response => {
                        const token = response.data.token
                        const status = response.data.status
                        const username = response.data.username
                        const money = response.data.money
                        const likes = response.data.likes
                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', {token, status, username, money, likes})
                        resolve(response)
                    })
                    .catch(err => {
                        commit('auth_error')
                        reject(err)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/logout',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                })
                    .then(response => {
                        const status = response.data.status
                        axios.defaults.headers.common['Authorization'] = ''
                        commit('auth_logout', {status})
                        resolve(response)
                    })
                    .catch(err => {
                        commit('auth_error')
                        reject(err)
                    })
            })
        },
        addMoney({commit}, addMoneyFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/add_money',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: addMoneyFormData,
                })
                    .then(response => {
                        const last_refill_status = response.data.last_refill_status
                        const result_balance = response.data.result_balance
                        commit('add_money', {last_refill_status, result_balance})
                        resolve(response)
                    })
                    .catch(err => {
                        commit('add_money_error')
                        reject(err)
                    })
            })
        },
        buyPack({commit}, buyPackFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/buy_boosterpack',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: buyPackFormData,
                })
                    .then(response => {
                        const last_buy_status = response.data.last_buy_status
                        const userMoney = response.data.userMoney
                        const userLikesCount = response.data.userLikesCount
                        const last_buy_likes_count = response.data.last_buy_likes_count
                        commit('buy_pack', {
                            last_buy_status,
                            userMoney,
                            userLikesCount,
                            last_buy_likes_count
                        })
                        resolve(response)
                    })
                    .catch(err => {
                        commit('add_money_error')
                        reject(err)
                    })
            })
        },
        addComment({commit}, addCommentFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/comment',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: addCommentFormData,
                })
                    .then(response => {
                        const last_add_comment_status = response.data.last_add_comment_status
                        commit('add_comment', {
                            last_add_comment_status
                        })
                        resolve(response)
                    })
                    .catch(err => {
                        commit('add_money_error')
                        reject(err)
                    })
            })
        },
    }
})
