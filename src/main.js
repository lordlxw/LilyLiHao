import Vue from "vue";
import App from "./App";
import { sync } from "vuex-router-sync";
import router from "./router";
import store from "./store";
import "amfe-flexible";
import "@/assets/theme/index.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// font icon
import "@/assets/font-awesome-4.7.0/css/font-awesome.min.css";
import "@/assets/css/style.scss";
import { default as Layout } from "@/layout";
import Filters from "@/utils/filter";
// import axios from "axios";

Vue.use(Filters);
Vue.config.productionTip = false;
sync(store, router);
Vue.use(ElementUI, {
  size: "small"
});
Vue.component(Layout.name, Layout);

// import wapi_json from "../static/config.json";
if (process.env.NODE_ENV === "testing") {
  console.log("正在运行 测试 环境");
} else if (process.env.NODE_ENV === "development") {
  console.log("正在运行 开发 环境");
} else {
  console.log("正在运行 正式 环境");
}
Vue.prototype.$apiUrl = process.env.BASE_API;
Vue.prototype.$wsUrl = process.env.WS_URL;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
  // render: h => h(App)
});
// axios.get('./static/config.json').then(result => {
//   Vue.prototype.$apiUrl = result.data.apiUrl
//   Vue.prototype.$wsUrl = result.data.wsUrl
//   /* eslint-disable no-new */
//   new Vue({
//     el: '#app',
//     router,
//     store,
//     components: { App },
//     template: '<App/>'
//     // render: h => h(App)
//   })
// })
