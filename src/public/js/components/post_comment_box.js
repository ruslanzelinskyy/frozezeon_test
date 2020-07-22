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
    data: function () {
        return {}
    },
    created() {
    },
    methods: {},
    template: `
    <div class="comment-box-wrap">
        <button type="button" class="btn btn-info ml-30" @click="bus.$emit('commentOpenedPostCall')">Comment post</button>
        <post_comment
            v-bind:comment_item="comment_item"
            :bus="bus"
        ></post_comment>    
    </div>
    `
}
