export default {
    name: 'post_comment',
    props: {
        comment_item: Object,
        bus: Object
    },
    methods: {
        openAddCommentModalCall: function (parent_comment) {
            this.bus.$emit('openAddCommentModalCall', parent_comment)
        },
    },
    template: `
    <ul class="comment-box">
        <li class="nav-item comment" v-for="item in comment_item" v-bind:key="item.id">
            <span class="card-text">{{item.author_name + ' - '}}<small class="text-muted">{{item.text}}</small></span>
            <div class="comment-btn-holder"><button type="button" class="btn btn-primary" @click="openAddCommentModalCall(item)">Reply</button></div>
            
            <post_comment
                v-if="item.is_parent" 
                v-bind:comment_item="item.child_comments"
                :bus="bus"
            ></post_comment>
        </li>
    </ul>
    `,
};
