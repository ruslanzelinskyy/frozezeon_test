export default new Vuex.Store({
    state: {
        login_status: localStorage.getItem('login_status') || '',
        last_add_comment_status: localStorage.getItem('last_add_comment_status') || '',
        last_refill_status: localStorage.getItem('last_refill_status') || '',
        last_buy_status: localStorage.getItem('last_buy_status') || '',
        last_post_open_status: localStorage.getItem('last_post_open_status') || '',

        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || '',
        userMoney: localStorage.getItem('userMoney') || 0,
        userLikesCount: localStorage.getItem('userLikesCount') || 0,
        userTotalRefilled: localStorage.getItem('userTotalRefilled') || '',
        userTotalWithdrawn: localStorage.getItem('userTotalWithdrawn') || '',
        last_buy_likes_count: localStorage.getItem('last_buy_likes_count') || 0,
        last_opened_post: localStorage.getItem('last_opened_post') || '',
    },
    mutations: {
        auth(state, payload) {
            localStorage.setItem('token', payload.token)
            state.token = payload.token

            localStorage.setItem('login_status', payload.status)
            state.login_status = payload.status

            localStorage.setItem('username', payload.username)
            state.username = payload.username

            localStorage.setItem('userMoney', payload.money)
            state.userMoney = payload.money

            localStorage.setItem('userLikesCount', payload.likes)
            state.userLikesCount = payload.likes

            localStorage.setItem('userTotalRefilled', payload.total_refilled)
            state.userTotalRefilled = payload.total_refilled

            localStorage.setItem('userTotalWithdrawn', payload.user_total_withdrawn)
            state.userTotalWithdrawn = payload.user_total_withdrawn
        },
        auth_error(state) {
            localStorage.setItem('login_status', 'server-error')
        },
        auth_logout(state, payload) {
            localStorage.setItem('token', '')
            state.token = ''
            localStorage.setItem('login_status', payload.status)
            state.login_status = payload.status
        },
        refill_balance(state, payload) {
            localStorage.setItem('last_refill_status', payload.last_refill_status)
            state.last_refill_status = payload.last_refill_status

            localStorage.setItem('userMoney', payload.userMoney)
            state.userMoney = payload.userMoney

            localStorage.setItem('userTotalRefilled', payload.userMoney)
            state.userTotalRefilled = payload.total_refilled
        },
        buy_pack(state, payload) {
            localStorage.setItem('last_buy_status', payload.last_buy_status)
            state.last_buy_status = payload.last_buy_status

            localStorage.setItem('userLikesCount', payload.userLikesCount)
            state.userLikesCount = payload.userLikesCount

            localStorage.setItem('userMoney', payload.userMoney)
            state.userMoney = payload.userMoney

            localStorage.setItem('last_buy_likes_count', payload.last_buy_likes_count)
            state.last_buy_likes_count = payload.last_buy_likes_count

            localStorage.setItem('userTotalWithdrawn', payload.user_total_withdrawn)
            state.userTotalWithdrawn = payload.user_total_withdrawn
        },
        add_comment(state, payload) {
            localStorage.setItem('last_add_comment_status', payload.last_add_comment_status)
        },
        open_post(state, payload) {
            localStorage.setItem('last_opened_post', payload.last_opened_post)
            state.last_opened_post = payload.last_opened_post
        },
        open_post_error(state) {
            localStorage.setItem('last_opened_post', 'server-error')
            state.last_post_open_status = 'server-error'
        },
        like_comment(state, payload) {
            state.last_like_comment_status = payload.last_like_comment_status
        },
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
                        const money = response.data.money
                        const likes = response.data.likes
                        const total_refilled = response.data.total_refilled
                        const user_total_withdrawn = response.data.user_total_withdrawn

                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', {token, status, username, money, likes, total_refilled, user_total_withdrawn})
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
                        const total_refilled = response.data.total_refilled
                        const user_total_withdrawn = response.data.user_total_withdrawn

                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', {token, status, username, money, likes, total_refilled, user_total_withdrawn})
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
        refillBalance({commit}, addMoneyFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/add_money',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: addMoneyFormData,
                })
                    .then(response => {
                        const last_refill_status = response.data.last_refill_status
                        const userMoney = response.data.userMoney
                        const total_refilled = response.data.total_refilled
                        commit('refill_balance', {last_refill_status, userMoney, total_refilled})
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
                        const user_total_withdrawn = response.data.user_total_withdrawn
                        commit('buy_pack', {
                            last_buy_status,
                            userMoney,
                            userLikesCount,
                            last_buy_likes_count,
                            user_total_withdrawn
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
        openPost({commit}, openPostFormData) {
            return new Promise((resolve, reject) => {
                axios.get('/main_page/get_post?post_id=' + openPostFormData.get('post_id'))
                    .then(response => {
                        const last_opened_post = response.data.post
                        commit('open_post', {
                            last_opened_post
                        })
                        resolve(response)
                    })
                    .catch(err => {
                        commit('open_post_error')
                        reject(err)
                    })
            })
        },
        likeComment({commit}, likeCommentFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/like_comment',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: likeCommentFormData,
                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        likePost({commit}, likePostFormData) {
            return new Promise((resolve, reject) => {
                axios({
                    url: '/main_page/like_post',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: likePostFormData,
                })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
    }
})
