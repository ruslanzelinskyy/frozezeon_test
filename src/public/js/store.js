var store = new Vuex.Store({
    state: {
        status: localStorage.getItem('status') || '',
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || ''
    },
    mutations: {
        auth(state, payload){
            localStorage.setItem('token', payload.token)
            localStorage.setItem('status', payload.status)
            localStorage.setItem('username', payload.username)
        },
        auth_error(state){
            localStorage.setItem('status', 'server-error')
        },
        auth_logout(state, payload){
            localStorage.setItem('token', '')
            localStorage.setItem('status', payload.status)
            localStorage.setItem('username', '')
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
                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth', { token, status, username })
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
    },
    getters : {
        isLoggedIn: state => !!localStorage.getItem('token'),
        authStatus: state => localStorage.getItem('status')
    }
})
