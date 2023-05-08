import Vue from "vue";
// 引入vuex
import Vuex from 'vuex';
import App from "./App.vue";
import router from "./router";
import config from "./api/config";
import server from "./api/server";
import store from './store/store';
import {Icon, Toast, Lazyload, Dialog} from "vant";

import global from "@/api/global";

Vue.prototype.$global = global;
Vue.prototype.$config = config;
Vue.prototype.$server = server;

Vue.use(Vuex);
Vue.use(Lazyload);
Vue.use(Icon);
Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;

Vue.config.productionTip = false;

new Vue({
    store,
    router,
    render: (h) => h(App)
}).$mount("#app");
