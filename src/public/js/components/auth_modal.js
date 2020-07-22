export default {
    name: 'auth_modal',
    props: {
        bus: Object
    },
    data: function () {
        return {
            login: '',
            pass: '',
            invalidLogin: false,
            invalidPass: false,
            invalidResponse: false
        }
    },
    computed: {
        login_status() {
            return this.$store.state.login_status
        },
    },
    created() {
        this.bus.$on('openAuthModalCall', function () {
            $('#authModal').modal('show')
        })
    },
    methods: {
        logIn: function () {
            var self = this;
            if (self.login === '') {
                self.invalidLogin = true
            } else if (self.pass === '') {
                self.invalidLogin = false
                self.invalidPass = true
            } else {
                self.invalidLogin = false
                self.invalidPass = false
                let authFormData = new FormData();
                authFormData.set('login', self.login);
                authFormData.set('password', self.pass);
                this.$store.dispatch('authentificate', authFormData)
                    .then(function () {
                        if (self.login_status == 'success') {
                            $('#authModal').modal('hide')
                        } else {
                            self.invalidResponse = true
                        }
                    })
                    .catch(err => console.log(err))
            }
        },
    },
    template: `
    <div class="modal fade" id="authModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Log in</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Please enter login</label>
                            <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp"
                                   v-model="login" required>
                            <div class="invalid-feedback" v-if="invalidLogin">
                                Please write a username.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Please enter password</label>
                            <input type="password" class="form-control" id="inputPassword" v-model="pass" required>
                            <div class="invalid-feedback" v-show="invalidPass">
                                Please write a password.
                            </div>
                        </div>
                        <div class="invalid-feedback" v-show="invalidResponse">
                            Validation error. Please check your input.
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button class="btn btn-primary" @click.prevent="logIn">Login</button>
                </div>
            </div>
        </div>
    </div>
    `,
};