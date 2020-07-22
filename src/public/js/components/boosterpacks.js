export default {
    name: 'boosterpacks',
    props: {
        bus: Object
    },
    components: {},
    data: function () {
        return {
            packs: [
                {
                    id: 1,
                    price: 5
                },
                {
                    id: 2,
                    price: 20
                },
                {
                    id: 3,
                    price: 50
                }
            ]
        }
    },
    computed: {
        login_status() {
            return this.$store.state.login_status
        },
    },
    created() {
        const self = this
    },
    methods: {
        buyPack: function (id) {
            const self = this
            if (self.login_status == 'success') {
                let buyPackFormData = new FormData();
                buyPackFormData.set('boosterpack_id', id);
                self.$store.dispatch('buyPack', buyPackFormData)
                    .then(function () {
                        self.bus.$emit('openPackLikesModalCall')
                    })
                    .catch(err => console.log(err))
            } else {
                self.bus.$emit('openAuthModalCall')

            }
        },
    },
    template: `
    <div class="boosterpacks">
        <h1 class="text-center">Boosterpack's</h1>
        <div class="container">
            <div class="row">
                <div class="col-4" v-for="box in packs" v-if="packs">
                    <div class="card">
                        <img src="/images/box.png"
                             class="card-img-top" alt="Photo">
                        <div class="card-body">
                            <button type="button" class="btn btn-outline-success my-2 my-sm-0"
                                    @click="buyPack(box.id)">Buy boosterpack {{box.price}}$
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
};
