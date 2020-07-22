export default {
    name: 'header_component',
    props: {
        bus: Object
    },
    components: {},
    data: function () {
        return {}
    },
    computed: {
        login_status() {
            return this.$store.state.login_status
        },
        username() {
            return this.$store.state.username
        },
    },
    created() {
        const self = this
        this.bus.$on('auth_data_update', function () {
            self.update_on_auth()
        })
    },
    methods: {
        update_on_auth: function () {
            this.login_status = localStorage.getItem('login_status')
            if (this.login_status == 'success') {
                this.username = localStorage.getItem('username')
            }
        },

        openAuthModalCall: function () {
            this.bus.$emit('openAuthModalCall')
        },
        openRefillMoneyModalCall: function () {
            this.bus.$emit('openRefillMoneyModalCall')
        },
        openProfileModalCall: function () {
            this.bus.$emit('openProfileModalCall')
        },

        logOut: function () {
            const self = this;
            this.$store.dispatch('logout')
                .then(function () {
                })
                .catch(err => console.log(err))
        },
    },
    template: `
    <div class="header">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                <li class="nav-item">
                    <button
                            id="logout-button"
                            class="btn btn-primary my-2 my-sm-0"
                            @click.prevent="logOut"
                            v-if="login_status == 'success'"
                    >Log out, {{ username }}
                    </button>
                    <button
                            id="login-button"
                            type="button"
                            class="btn btn-success my-2 my-sm-0"
                            data-toggle="modal"
                            v-if="login_status != 'success'"
                            @click="openAuthModalCall"
                    >Log IN
                    </button>
                </li>
                <li class="nav-item">
                    <button type="button" class="btn btn-success my-2 my-sm-0"
                            @click.prevent="openRefillMoneyModalCall">Add balance
                    </button>
                </li>
                <li class="nav-item">
                    <button type="button" class="btn btn-success my-2 my-sm-0" data-toggle="modal"
                           @click="openProfileModalCall">View profile
                    </button>
                </li>
            </div>
        </nav>
    </div>
    `,
};