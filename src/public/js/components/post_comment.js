export default {
    name: 'post_comment',
    props: {
        comment_item: Object,
        bus: Object
    },
    computed: {
        user_logined() {
            return this.$store.state.login_status === 'success'
        },
    },
    methods: {
        likeComment: function (id) {
            const self = this
            if(self.user_logined) {
                const likeCommentFormData = new FormData()
                likeCommentFormData.set('comment_id', id)
                this.$store.dispatch('likeComment', likeCommentFormData)
                    .then((response) => {
                        if(response.data.last_like_comment_status === 'success') {
                            self.comment_item[id].likes = response.data.comment_likes_result
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                self.bus.$emit('openAuthModalCall')
            }
        },
        openAddCommentModalCall: function (parent_comment) {
            this.bus.$emit('openAddCommentModalCall', parent_comment)
        },
    },
    template: `
    <ul class="comment-box">
        <li class="nav-item comment" v-for="item in comment_item" v-bind:key="item.id">
            <span class="card-text">{{item.author_name + ' - '}}<small class="text-muted">{{item.text}}</small></span>
            <div class="comment-btn-holder">
                <div class="likes"
                     @click="likeComment(item.id)">
                    <div class="heart-wrap">
                        <div class="heart">
                            <svg class="bi bi-heart" width="1em" height="1em" viewBox="0 0 16 16"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <span v-if="item.likes != '0'">{{item.likes}}</span>
    
                    </div>
                </div>
                <button type="button" class="btn btn-primary" @click="openAddCommentModalCall(item)">Reply</button>
            </div>

            <post_comment
                v-if="item.is_parent" 
                v-bind:comment_item="item.child_comments"
                :bus="bus"
            ></post_comment>
        </li>
    </ul>
    `,
};
