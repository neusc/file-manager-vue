import Vue from 'vue';
import Router from 'vue-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { host } from '@/config';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: "/filemanager",
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import(/* webpackChunkName: "list" */ './views/List.vue')
    },
    {
      path: "/list",
      name: "list",
      component: () => import(/* webpackChunkName: "list" */ "./views/List.vue")
    },
    {
      path: '/signup',
      name: 'signup',
      component: () =>
        import(/* webpackChunkName: "signup" */ './views/SignUp.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      component: () =>
        import(/* webpackChunkName: "signin" */ './views/SignIn.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  const uid = Cookies.get('uid');
  if (uid) {
    const user = Vue.prototype.GLOBAL.getUser(uid);
    if (user) {
      if (to.path === '/signin') {
        next('/');
      } else {
        next();
      }
    } else {
      axios
        .post(`${host}/api/user/getUserInfo`, { uid })
        .then(res => {
          const d = res.data;
          if (d.statusCode === 0 && d.data.uid && d.data.name) {
            Vue.prototype.GLOBAL.setUser(uid, d.data);
            if (to.path === '/signin') {
              next('/');
            } else {
              next();
            }
          } else {
            next('/signin');
          }
        })
        .catch(e => {
          next('/signin');
        });
    }
  } else if (to.path === '/signin' || to.path === '/signup') {
    next();
  } else {
    next('/signin');
  }
});

export default router;
