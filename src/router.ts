import Vue from "vue";
import Router from "vue-router";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { host } from "@/config";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.NODE_ENV === "production" ? "/filemanager" : "/",
  routes: [
    {
      path: "/",
      name: "list",
      component: () => import(/* webpackChunkName: "list" */ "./views/List.vue")
    },
    {
      path: "/signup",
      name: "signup",
      component: () =>
        import(/* webpackChunkName: "signup" */ "./views/SignUp.vue")
    },
    {
      path: "/signin",
      name: "signin",
      component: () =>
        import(/* webpackChunkName: "signin" */ "./views/SignIn.vue")
    },
  ]
});

router.beforeEach((to, from, next) => {
  const sessionid = Cookies.get("filemanager");
  if (sessionid) {
    const user = Vue.prototype.$global.getUser(sessionid);
    if (user && user.name) {
      if (to.name === "signin") {
        next({ name: "list" });
      } else {
        next();
      }
    } else {
      axios
        .post(`${host}/api/user/getUserInfo`)
        .then((res: AxiosResponse) => {
          const d = res.data;
          if (d.statusCode === 0 && d.data.sessionid && d.data.name) {
            Vue.prototype.$global.setUser(sessionid, d.data);
            if (to.name === "signin") {
              next({ name: "list" });
            } else {
              next();
            }
          } else {
            next({ name: "signin" });
          }
        })
        .catch((e) => {
          next({ name: "signin" });
        });
    }
  } else if (to.name === "signin" || to.name === "signup") {
    next();
  } else {
    next({ name: "signin" });
  }
});

export default router;
