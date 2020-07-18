var store = new Vuex.Store({
    state: {
        status: localStorage.getItem('status') || '',
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || '',
        userMoney: localStorage.getItem('userMoney') || 0,
        userLikesCount: localStorage.getItem('userLikesCount') || 0,
    },
    mutations: {
        auth(state, payload){
            localStorage.setItem('token', payload.token)
            localStorage.setItem('status', payload.status)
            localStorage.setItem('username', payload.username)
            localStorage.setItem('userMoney', payload.money)
            localStorage.setItem('userLikesCount', payload.likes)
        },
        auth_error(state){
            localStorage.setItem('status', 'server-error')
        },
        auth_logout(state, payload){
            localStorage.setItem('token', '')
            localStorage.setItem('status', payload.status)
            localStorage.setItem('username', '')
        },
        add_money(state, payload){
            localStorage.setItem('last_refill_status', payload.last_refill_status)
            localStorage.setItem('userMoney', payload.result_balance)
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

                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', { token, status, username })
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
                        commit('auth', { token, status, username, money, likes })
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
                        commit('auth_logout', { status })
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
                        commit('add_money', { last_refill_status, result_balance })
                        resolve(response)
                    })
                    .catch(err => {
                        commit('add_money_error')
                        reject(err)
                    })
            })
        },
    },
    getters : {
        isLoggedIn: state => !!localStorage.getItem('token'),
        authStatus: state => localStorage.getItem('status'),
    }
})
