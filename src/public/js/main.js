import App from './App.js';
import store from './store.js'

new Vue({
    store,
    render: h => h(App),
}).$mount(`#app`);
