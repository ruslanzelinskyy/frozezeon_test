export default {
    name: 'refill_balance_modal',
    props: {
        bus: Object
    },
    components: {},
    data: function () {
        return {
            amount: 1,
            invalidSum: false,
            invalidResponse: false,
        }
    },
    computed: {
        login_status() {
            return this.$store.state.login_status
        },
        last_refill_status() {
            return this.$store.state.last_refill_status
        },
    },
    created() {
        const self = this
        this.bus.$on('openRefillMoneyModalCall', function () {
            self.openRefillBalanceModal()
        })
    },
    methods: {
        openRefillBalanceModal: function () {
            if (this.login_status == 'success') {
                $('#refillBalanceModal').modal('show')
            } else {
                this.bus.$emit('openAuthModalCall')
            }
        },
        refillBalance: function () {
            const self = this;
            if (self.amount <= 0) {
                self.invalidSum = true
            } else {
                self.invalidSum = false
                let addMoneyFormData = new FormData();
                addMoneyFormData.set('amount', self.amount);
                self.$store.dispatch('refillBalance', addMoneyFormData)
                    .then(function () {
                        self.invalidResponse = self.last_refill_status != 'success'

                        if (!self.invalidResponse) {
                            $('#refillBalanceModal').modal('hide');
                        }
                    })
                    .catch(err => console.log(err))
            }
        },
    },
    template: `
    <div class="modal fade" id="refillBalanceModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add money</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Enter sum</label>
                            <input type="text" class="form-control" id="addBalance" v-model="amount" required>
                            <div class="invalid-feedback" v-if="invalidSum">
                                Please write a sum.
                            </div>
                            <div class="invalid-feedback" v-if="invalidResponse">
                                Server error.
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-success" @click="refillBalance">Add</button>
                </div>
            </div>
        </div>
    </div>
    `,
};
