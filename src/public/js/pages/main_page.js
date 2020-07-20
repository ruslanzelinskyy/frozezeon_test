import post_comment_box from "../components/post_comment_box.js";
export default {
    name: 'main_page',
    components: {
        post_comment_box
    },
    data: function () {
        return {
            bus: new Vue(),
            login: '',
            pass: '',
            post: false,
            login_status: localStorage.getItem('username') || 0,
            username: localStorage.getItem('username') || 0,
            invalidLogin: false,
            invalidPass: false,
            invalidSum: false,
            posts: [],
            addSum: 0,
            last_buy_likes_count: localStorage.getItem('last_buy_likes_count') || 0,
            userLikesCount: localStorage.getItem('userLikesCount') || 0,
            userMoney: localStorage.getItem('userMoney') || 0,
            likes: 0,
            new_comment_text: '',
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
        test: function () {
            var data = [];
            return data;
        }
    },
    created() {
        var self = this

        this.$store.dispatch('authorize')
            .then(function () {
                self.login_status = localStorage.getItem('login_status')
                if (self.login_status == 'success') {
                    self.username = localStorage.getItem('username')
                    self.userLikesCount = localStorage.getItem('userLikesCount')
                    self.userMoney = localStorage.getItem('userMoney')
                }
            })
            .catch(err => console.log(err))

        axios
            .get('/main_page/get_all_posts')
            .then(function (response) {
                self.posts = response.data.posts;
                console.log(self.posts)
            })
    },
    methods: {
        logOut: function () {
            var self = this;
            this.$store.dispatch('logout')
                .then(function () {
                    self.login_status = localStorage.getItem('login_status')
                    self.username = localStorage.getItem('username')
                })
                .catch(err => console.log(err))
        },
        logIn: function () {
            var self = this;
            if (self.login === '') {
                self.invalidLogin = true
            } else if (self.pass === '') {
                self.invalidLogin = false
                self.invalidPass = true
            } else {
                self.invalidLogin = false
                self.invalidPass = false
                let authFormData = new FormData();
                authFormData.set('login', self.login);
                authFormData.set('password', self.pass);
                this.$store.dispatch('authentificate', authFormData)
                    .then(function () {
                        self.login_status = localStorage.getItem('login_status')
                        if (self.login_status == 'success') {
                            $('#loginModal').modal('hide')
                            self.username = localStorage.getItem('username')
                            self.userLikesCount = localStorage.getItem('userLikesCount')
                            self.userMoney = localStorage.getItem('userMoney')
                        }
                    })
                    .catch(err => console.log(err))
            }
        },
        showAddMoneyModal: function () {
            if (localStorage.getItem('login_status') == 'success') {
                $('#addModal').modal('show');
            } else {
                $('#loginModal').modal('show')
            }
        },
        fiilIn: function () {
            var self = this;
            if (self.addSum === 0) {
                self.invalidSum = true
            } else {
                self.invalidSum = false
                let addMoneyFormData = new FormData();
                addMoneyFormData.set('amount', self.addSum);
                this.$store.dispatch('addMoney', addMoneyFormData)
                    .then(function () {
                        self.userMoney = localStorage.getItem('userMoney')
                        $('#addModal').modal('hide');
                    })
                    .catch(err => console.log(err))
            }
        },
        openPost: function (id) {
            var self = this;
            axios
                .get('/main_page/get_post/' + id)
                .then(function (response) {
                    self.post = response.data.post;
                    if (self.post) {
                        setTimeout(function () {
                            $('#postModal').modal('show');
                        }, 500);
                    }
                })
        },
        addLike: function (id) {
            var self = this;
            axios
                .get('/main_page/like')
                .then(function (response) {
                    self.likes = response.data.likes;
                })

        },
        buyPack: function (id) {
            var self = this;
            if (localStorage.getItem('login_status') == 'success') {
                let buyPackFormData = new FormData();
                buyPackFormData.set('boosterpack_id', id);
                this.$store.dispatch('buyPack', buyPackFormData)
                    .then(function () {
                        self.last_buy_likes_count = localStorage.getItem('last_buy_likes_count')
                        self.userLikesCount = localStorage.getItem('userLikesCount')
                        self.userMoney = localStorage.getItem('userMoney')
                        $('#amountModal').modal('show');
                    })
                    .catch(err => console.log(err))
            } else {
                $('#loginModal').modal('show')
            }
        },
        addCommentCall: function (new_comment_text) {
            this.bus.$emit('addCommentCall', new_comment_text)
        }
    },
    template: `
    <div id="main_page">
        <div class="header">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <li class="nav-item">
        <button
                id="logout-button"
                class="btn btn-primary my-2 my-sm-0"
                @click.prevent="logOut"
                v-if="login_status == 'success'"
        >Log out, {{ username }}
        </button>
        <button
                id="login-button"
                type="button"
                class="btn btn-success my-2 my-sm-0"
                data-toggle="modal"
                data-target="#loginModal"
                v-if="login_status != 'success'"
        >Log IN
        </button>
        </li>
        <li class="nav-item">
        <button type="button" class="btn btn-success my-2 my-sm-0"
                @click.prevent="showAddMoneyModal">Add balance
        </button>
        </li>
        <li class="nav-item">
        <button type="button" class="btn btn-success my-2 my-sm-0" data-toggle="modal"
                data-target="#profileModal">View profile
        </button>
        </li>
        </div>
        </nav>
        </div>
        <div class="main">
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
                            @click="openPost(post.id)">Open post
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
        
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
        If You need some help about core - read README.MD in system folder
        <br>
        What we have done All posts: <a href="/main_page/get_all_posts">/main_page/get_all_posts</a> One post: <a
        href="/main_page/get_post/1">/main_page/get_post/1</a>
        <br>
        Just go coding Login: <a href="/main_page/login">/main_page/login</a> Make boosterpack feature <a
        href="/main_page/buy_boosterpack">/main_page/buy_boosterpack</a> Add money feature <a
        href="/main_page/add_money">/main_page/add_money</a>
        </div>
        </div>
        
        <!-- Modal -->
        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Log in</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Please enter login</label>
                <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp"
                       v-model="login" required>
                <div class="invalid-feedback" v-if="invalidLogin">
                    Please write a username.
                </div>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Please enter password</label>
                <input type="password" class="form-control" id="inputPassword" v-model="pass" required>
                <div class="invalid-feedback" v-show="invalidPass">
                    Please write a password.
                </div>
            </div>
        </form>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button class="btn btn-primary" @click.prevent="logIn">Login</button>
        </div>
        </div>
        </div>
        </div>
        <!-- Modal -->
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
            <div class="avatar"><img :src="post.user.avatarfull" alt="Avatar"></div>
            <div class="name">{{post.user.personaname}}</div>
        </div>
        <div class="card mb-3">
            <div class="post-img" v-bind:style="{ backgroundImage: 'url(' + post.img + ')' }"></div>
            <div class="card-body">
                <div class="likes" @click="addLike(post.id)">
                    <div class="heart-wrap" v-if="!likes">
                        <div class="heart">
                            <svg class="bi bi-heart" width="1em" height="1em" viewBox="0 0 16 16"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 01.176-.17C12.72-3.042 23.333 4.867 8 15z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <span>{{post.likes}}</span>
                    </div>
                    <div class="heart-wrap" v-else>
                        <div class="heart">
                            <svg class="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <span>{{likes}}</span>
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
        <!-- Modal -->
        <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add money</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Enter sum</label>
                <input type="text" class="form-control" id="addBalance" v-model="addSum" required>
                <div class="invalid-feedback" v-if="invalidSum">
                    Please write a sum.
                </div>
            </div>
        </form>
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-success" @click="fiilIn">Add</button>
        </div>
        </div>
        </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="amountModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Amount</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
        <h2 class="text-center">Likes: {{last_buy_likes_count}}</h2>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
        </div>
        </div>
        </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Profile</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body">
        <h2 class="text-center">Your likes: {{userLikesCount}}</h2>
        <h2 class="text-center">Your money: {{userMoney}}$</h2>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
        </div>
        </div>
        </div>
        </div>
        <!-- Modal -->
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
            <input type="submit" @click="addCommentCall(new_comment_text)" value="Submit">
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
        </div>
        </div>
        </div>
        </div>
    </div>
  `,
};