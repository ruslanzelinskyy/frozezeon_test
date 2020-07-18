var app = new Vue({
	el: '#app',
	data: {
		login: '',
		pass: '',
		post: false,
		invalidLogin: false,
		invalidPass: false,
		invalidSum: false,
		posts: [],
		addSum: 0,
		last_buy_likes_count: localStorage.getItem('last_buy_likes_count') || 0,
		userLikesCount: localStorage.getItem('userLikesCount') || 0,
		userMoney: localStorage.getItem('userMoney') || 0,
		likes: 0,
		commentText: '',
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
			},
		],
	},
	computed: {
		test: function () {
			var data = [];
			return data;
		}
	},
	created(){
		var self = this

		store.dispatch('authorize')
			.then(function () {
				if (localStorage.getItem('status') == 'success') {
					let logoutButton = $('#logout-button')
					logoutButton.removeClass('hidden')
					logoutButton.text(logoutButton.text() + localStorage.getItem('username'))

					$('#login-button').addClass('hidden')
				}
			})
			.catch(err => console.log(err))

		axios
			.get('/main_page/get_all_posts')
			.then(function (response) {
				self.posts = response.data.posts;
			})
	},
	methods: {
		logOut: function () {
			store.dispatch('logout')
				.then(function() {
					if(!store.isLoggedIn) {
						$('#logout-button').addClass('hidden')
						$('#login-button').removeClass('hidden')
					}
				})
				.catch(err => console.log(err))
		},
		logIn: function () {
			var self= this;
			if(self.login === ''){
				self.invalidLogin = true
			}
			else if(self.pass === ''){
				self.invalidLogin = false
				self.invalidPass = true
			}
			else{
				self.invalidLogin = false
				self.invalidPass = false
				let authFormData = new FormData();
				authFormData.set('login', self.login);
				authFormData.set('password', self.pass);
				store.dispatch('authentificate', authFormData)
					.then(function() {
						if(store.getters.isLoggedIn) {
							$('#loginModal').modal('hide')
							$('#logout-button').removeClass('hidden')
							$('#login-button').addClass('hidden')
						}
					})
					.catch(err => console.log(err))
			}
		},
		showAddMoneyModal: function() {
			if(localStorage.getItem('status') == 'success') {
				$('#addModal').modal('show');
			} else {
				$('#loginModal').modal('show')
			}
		},
		fiilIn: function () {
			var self= this;
			if(self.addSum === 0){
				self.invalidSum = true
			}
			else{
				self.invalidSum = false
				let addMoneyFormData = new FormData();
				addMoneyFormData.set('amount', self.addSum);
				store.dispatch('addMoney', addMoneyFormData)
					.then(function () {
						self.userMoney = localStorage.getItem('userMoney')
						$('#addModal').modal('hide');
					})
					.catch(err => console.log(err))
			}
		},
		openPost: function (id) {
			var self= this;
			axios
				.get('/main_page/get_post/' + id)
				.then(function (response) {
					self.post = response.data.post;
					if(self.post){
						setTimeout(function () {
							$('#postModal').modal('show');
						}, 500);
					}
				})
		},
		addLike: function (id) {
			var self= this;
			axios
				.get('/main_page/like')
				.then(function (response) {
					self.likes = response.data.likes;
				})

		},
		buyPack: function (id) {
			var self= this;
			if(localStorage.getItem('status') == 'success') {
				let buyPackFormData = new FormData();
				buyPackFormData.set('boosterpack_id', id);
				store.dispatch('buyPack', buyPackFormData)
					.then(function() {
						self.last_buy_likes_count = localStorage.getItem('last_buy_likes_count')
						self.userLikesCount = localStorage.getItem('userLikesCount')
						self.userMoney = localStorage.getItem('userMoney')
						$('#amountModal').modal('show');
					})
					.catch(err => console.log(err))
			} else {
				$('#loginModal').modal('show')
			}
		}
	}
});
