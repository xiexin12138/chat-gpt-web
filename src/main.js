import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Icon, Toast } from "vant";

import global from "@/api/global";
// import hljs from "highlight.js/lib/common";
// import "highlight.js/styles/github.css";
// import vuePlugin from "@highlightjs/vue-plugin";
// hljs.highlightAll();
// Vue.use(vuePlugin);
Vue.prototype.$global = global;

Vue.use(Icon);
// Vue.use(Toast);
Vue.prototype.$toast = Toast;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
