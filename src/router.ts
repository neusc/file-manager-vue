import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/filemanager",
  routes: [
    {
      path: "/",
      name: "list",
      component: () => import(/* webpackChunkName: "list" */ "./views/List.vue")
    },
    {
      path: "/list",
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
    }
  ]
});
