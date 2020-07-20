import post_comment from "./post_comment.js";
export default {
    name: 'post_comment_box',
    components: {
        post_comment
    },
    props: {
        comment_item: Object,
        bus: Object
    },
    data: function() {
        return {
            new_comment_parent: Object,
            comment_box_bus: new Vue()
        }
    },
    created() {
        this.bus.$on('addCommentCall', (new_comment_text) => {
            this.addComment(new_comment_text)
        })
        this.comment_box_bus.$on('openCommentModalCall', (new_comment_parent) => {
            this.openCommentModal(new_comment_parent)
        })
    },
    methods: {
        openCommentModal: function (new_comment_parent) {
            if (localStorage.getItem('login_status') == 'success') {
                this.new_comment_parent = new_comment_parent
                $('#addCommentModal').modal('show')
            } else {
                $('#postModal').modal('hide')
                $('#loginModal').modal('show')
            }
        },
        addComment: function (new_comment_text) {
            if (localStorage.getItem('login_status') == 'success') {
                let addCommentFormData = new FormData();
                addCommentFormData.set('new_comment_parent_id', this.new_comment_parent.id);
                addCommentFormData.set('new_comment_assign_id', this.new_comment_parent.assign_id);
                addCommentFormData.set('new_comment_text', new_comment_text);

                if(this.new_comment_parent.is_parent == '0') {
                    addCommentFormData.set('is_parent_updated', 1)
                    Vue.set(this.new_comment_parent, 'child_comments', {})
                    this.new_comment_parent.is_parent = 1
                }

                const self = this
                this.$store.dispatch('addComment', addCommentFormData)
                    .then((response) => {
                        // const comment = response.data.new_comment
                        const comment = response.data.new_comment

                        Vue.set(self.new_comment_parent.child_comments, comment.id, comment)

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
    <div class="comment-box-wrap">
        <post_comment 
            v-bind:comment_item="comment_item"
            :bus="comment_box_bus"
        ></post_comment>    
    </div>
    `
}
