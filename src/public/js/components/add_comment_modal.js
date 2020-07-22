export default {
    name: 'add_comment_modal',
    props: {
        bus: Object
    },
    components: {},
    data: function () {
        return {
            new_comment_text: '',
            new_comment_parent: Object,
            invalidResponse: false,
            isFirst: false
        }
    },
    computed: {
        login_status() {
            return this.$store.state.login_status
        },
        last_refill_status() {
            return this.$store.state.last_refill_status
        },
        post() {
            return this.$store.state.last_opened_post
        }
    },
    created() {
        const self = this
        this.bus.$on('commentOpenedPostCall', function () {
            self.isFirst = true
            self.new_comment_parent = {
                'assign_id': self.post.id,
                'id': 0,
                'is_parent': 0
            }
            self.openAddCommentModal()
        })
        this.bus.$on('openAddCommentModalCall', function (parent_comment) {
            self.isFirst = false
            self.new_comment_parent = parent_comment
            self.openAddCommentModal()
        })
    },
    methods: {
        openAddCommentModal: function () {
            if (this.login_status == 'success') {
                $('#addCommentModal').modal('show')
            } else {
                this.bus.$emit('closePostModalCall')
                this.bus.$emit('openAuthModalCall')
            }
        },
        addComment: function (new_comment_text) {
            if (localStorage.getItem('login_status') == 'success') {
                let addCommentFormData = new FormData();
                addCommentFormData.set('new_comment_parent_id', this.new_comment_parent.id);
                addCommentFormData.set('new_comment_assign_id', this.new_comment_parent.assign_id);
                addCommentFormData.set('new_comment_text', new_comment_text);

                const self = this

                if(
                    self.new_comment_parent.is_parent == '0' &&
                    !self.isFirst
                ) {
                    addCommentFormData.set('is_parent_updated', 1)
                } else {
                    addCommentFormData.set('is_parent_updated', 0)
                }
                self.$store.dispatch('addComment', addCommentFormData)
                    .then((response) => {
                        // const comment = response.data.new_comment
                        const comment = response.data.new_comment
                        if(self.isFirst) {
                            Vue.set(self.post.comments, comment.id, comment)
                        } else {
                            if(self.new_comment_parent.is_parent == '0') {
                                Vue.set(self.new_comment_parent, 'child_comments', {})
                            }
                            self.new_comment_parent.is_parent = 1
                            Vue.set(self.new_comment_parent.child_comments, comment.id, comment)
                        }

                        $('#addCommentModal').modal('hide')
                    })
                    .catch(err => console.log(err))
            } else {
                $('#postModal').modal('hide')
                $('#loginModal').modal('show')
            }
        }
    },
    template: `
    <div class="modal fade" id="addCommentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Reply</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="text" v-model="new_comment_text">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="addComment(new_comment_text)" data-dismiss="modal">Comment</button>
                </div>
            </div>
        </div>
    </div>
    `,
};
