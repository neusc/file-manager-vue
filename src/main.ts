import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import Toasted from "vue-toasted";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import global from "@/utils/global.ts";

Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.prototype.$global = global;
Vue.use(Toasted, {
  duration: 3000
});

new Vue({
  router,
  // @ts-ignore
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
