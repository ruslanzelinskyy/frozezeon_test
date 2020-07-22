import post_comment_box from "./post_comment_box.js";

export default {
    name: 'post_view_modal',
    props: {
        bus: Object
    },
    components: {
        post_comment_box
    },
    data: function () {
        return {}
    },
    computed: {
        post() {
            return this.$store.state.last_opened_post
        },
        user_avatar() {
            return this.$store.state.last_opened_post.user ? this.$store.state.last_opened_post.user.avatarfull : ''
        },
        username() {
            return this.$store.state.last_opened_post.user ? this.$store.state.last_opened_post.user.personaname : ''
        },
        user_logined() {
            return this.$store.state.login_status === 'success'
        },
    },
    created() {
        const self = this

        this.bus.$on('openPostModalCall', function (post_id) {
            self.openPostModal(post_id)
        })
        this.bus.$on('closePostModalCall', function () {
            self.closePostModal()
        })
    },
    methods: {
        closePostModal: function () {
            $('#postModal').modal('hide')
        },
        likePost: function (id) {
            const self = this

            if (self.user_logined) {
                const likePostFormData = new FormData()
                likePostFormData.set('post_id', id)
                this.$store.dispatch('likePost', likePostFormData)
                    .then((response) => {
                        if (response.data.last_like_post_status === 'success') {
                            self.post.likes = response.data.post_likes_result
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                self.bus.$emit('openAuthModalCall')
            }
        },
        openPostModal: function (post_id) {
            const self = this;

            let openPostFormData = new FormData();
            openPostFormData.set('post_id', post_id);

            this.$store.dispatch('openPost', openPostFormData)
                .then(function () {
                    $('#postModal').modal('show');
                })
                .catch(err => console.log(err))
        },
    },
    template: `
    <div class="modal fade bd-example-modal-xl" id="postModal" tabindex="-1" role="dialog"
     aria-labelledby="exampleModalLabel"
     aria-hidden="true" v-if="post">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Post {{post.id}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="user">
                        <div class="avatar"><img :src="user_avatar" alt="Avatar"></div>
                        <div class="name">{{ username }}</div>
                    </div>
                    <div class="card mb-3">
                        <div class="post-img" v-bind:style="{ backgroundImage: 'url(' + post.img + ')' }"></div>
                        <div class="card-body">
                            <div class="likes"
                                 @click="likePost(post.id)">
                                <div class="heart-wrap" v-if="post.likes">
                                    <div class="heart">
                                        <svg class="bi bi-heart" width="1em" height="1em" viewBox="0 0 16 16"
                                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                  d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                    <span v-if="post.likes != '0'">{{post.likes}}</span>
                                </div>
                            </div>
                        </div>
                        <post_comment_box
                                :bus="bus"
                                v-bind:comment_item="post.comments"
                        ></post_comment_box>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `,
};