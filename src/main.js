import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import config from "./api/config";
import server from "./api/server";
import { Icon, Toast, Lazyload } from "vant";

import global from "@/api/global";

Vue.prototype.$global = global;
Vue.prototype.$config = config;
Vue.prototype.$server = server;

Vue.use(Lazyload);
Vue.use(Icon);
Vue.prototype.$toast = Toast;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
