export default {
    name: 'pack_likes_modal',
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
        last_buy_status() {
            return this.$store.state.last_buy_status
        },
        last_buy_likes_count() {
            return this.$store.state.last_buy_likes_count
        },
    },
    created() {
        const self = this

        this.bus.$on('openPackLikesModalCall', function () {
            self.openPackLikesModal()
        })
    },
    methods: {
        openPackLikesModal: function () {
            $('#packLikesModal').modal('show')
        },
    },
    template: `
    <div class="modal fade" id="packLikesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Amount</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h2 class="text-center" v-if="last_buy_status == 'success'">Likes: {{last_buy_likes_count}}</h2>
                    <h2 class="text-center" v-else>No money - no honey!</h2>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
                </div>
            </div>
        </div>
    </div>
    `,
};
