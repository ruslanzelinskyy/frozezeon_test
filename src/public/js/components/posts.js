export default {
    name: 'posts',
    props: {
        bus: Object
    },
    data: function () {
        return {
            post: false,
            posts: []
        }
    },
    created() {
        const self = this
        axios
            .get('/main_page/get_all_posts')
            .then(function (response) {
                self.posts = response.data.posts;
                console.log(self.posts)
            })
    },
    methods: {
        openPostModalCall: function (post_id) {
            this.bus.$emit('openPostModalCall', post_id)
        },
    },
    template: `
    <div class="posts">
        <h1 class="text-center">Posts</h1>
        <div class="container">
            <div class="row">
                <div class="col-4" v-for="post in posts" v-if="posts">
                    <div class="card">
                        <img :src="post.img" class="card-img-top"
                             alt="Photo">
                        <div class="card-body">
                            <h5 class="card-title">Post - {{post.id}}</h5>
                            <p class="card-text">{{post.text}}</p>
                            <button type="button" class="btn btn-outline-success my-2 my-sm-0"
                                    @click="openPostModalCall(post.id)">Open post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
};
