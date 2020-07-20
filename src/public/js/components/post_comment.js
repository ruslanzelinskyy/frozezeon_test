export default {
    name: 'post_comment',
    props: {
        comment_item: Object,
        bus: Object
    },
    methods: {
        openCommentModalCall: function(new_comment_parent_id, new_comment_post_id) {
            this.bus.$emit('openCommentModalCall', new_comment_parent_id, new_comment_post_id);
        },
    },
    template: `
    <ul class="comment-box">
        <li class="nav-item comment" v-for="item in comment_item" v-bind:key="item.id">
            <span class="card-text">{{item.author_name + ' - '}}<small class="text-muted">{{item.text}}</small></span>
            <button type="button" class="btn btn-primary" @click="openCommentModalCall(item)">Reply</button>
            <post_comment
                v-if="item.is_parent" 
                v-bind:comment_item="item.child_comments"
                :bus="bus"
            ></post_comment>
        </li>
    </ul>
  `,
};
