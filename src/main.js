import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Icon, Toast } from "vant";

import global from "@/api/global";

Vue.prototype.$global = global;

Vue.use(Icon);
// Vue.use(Toast);
Vue.prototype.$toast = Toast;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
