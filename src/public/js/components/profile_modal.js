export default {
    name: 'profile_modal',
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
        userLikesCount() {
            return this.$store.state.userLikesCount
        },
        userMoney() {
            return this.$store.state.userMoney
        },
    },
    created() {
        const self = this
        this.bus.$on('auth_data_update', function () {
            self.update_on_auth()
        })
        this.bus.$on('openProfileModalCall', function () {
            self.openProfileModal()
        })
    },
    methods: {
        openProfileModal: function () {
            if (this.login_status == 'success') {
                $('#profileModal').modal('show')
            } else {
                this.bus.$emit('openAuthModalCall')
            }
        },
    },
    template: `
    <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Profile</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h2 class="text-center">Your likes: {{userLikesCount}}</h2>
                    <h2 class="text-center">Your money: {{userMoney}}$</h2>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
                </div>
            </div>
        </div>
    </div>
    `,
};
