import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'minireset.css/minireset.css'

Vue.use(ElementUI)
Vue.use(Vuex)

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
});

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
}).$mount('#app')

// router.replace('/member');
