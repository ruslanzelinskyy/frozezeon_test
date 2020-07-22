import post_comment_box from "../components/post_comment_box.js";
import posts from "../components/posts.js";
import post_view_modal from "../components/post_view_modal.js";
import auth_modal from "../components/auth_modal.js";
import header_component from "../components/header_component.js";
import profile_modal from "../components/profile_modal.js";
import boosterpacks from "../components/boosterpacks.js";
import pack_likes_modal from "../components/pack_likes_modal.js";
import refill_balance_modal from "../components/refill_balance_modal.js";
import add_comment_modal from "../components/add_comment_modal.js";

export default {
    name: 'main_page',
    components: {
        post_comment_box,
        post_view_modal,
        auth_modal,
        header_component,
        profile_modal,
        boosterpacks,
        pack_likes_modal,
        refill_balance_modal,
        add_comment_modal,
        posts
    },
    data: function () {
        return {
            bus: new Vue(),
            likes: 0,
            new_comment_text: '',
        }
    },
    computed: {
        test: function () {
            var data = [];
            return data;
        }
    },
    created() {
        var self = this

        this.$store.dispatch('authorize')
            .then(function () {
            })
            .catch(err => console.log(err))
    },
    methods: {
        addLike: function (id) {
            var self = this;
            axios
                .get('/main_page/like')
                .then(function (response) {
                    self.likes = response.data.likes;
                })
        }
    },
    template: `
    <div id="main_page">
        <header_component :bus="bus"></header_component>
        <div class="main">
            <posts :bus="bus"></posts>
            <boosterpacks :bus="bus"></boosterpacks>

            If You need some help about core - read README.MD in system folder
            <br>
            What we have done All posts: <a href="/main_page/get_all_posts">/main_page/get_all_posts</a> One post: <a
            href="/main_page/get_post/1">/main_page/get_post/1</a>
            <br>
            Just go coding Login: <a href="/main_page/login">/main_page/login</a> Make boosterpack feature <a
            href="/main_page/buy_boosterpack">/main_page/buy_boosterpack</a> Add money feature <a
            href="/main_page/add_money">/main_page/add_money</a>
        </div>

        <post_view_modal :bus="bus"></post_view_modal>
        <auth_modal :bus="bus"></auth_modal>
        <profile_modal :bus="bus"></profile_modal>
        <pack_likes_modal :bus="bus"></pack_likes_modal>
        <refill_balance_modal :bus="bus"></refill_balance_modal>
        <add_comment_modal :bus="bus"></add_comment_modal>
    </div>
    `,
};