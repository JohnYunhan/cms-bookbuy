import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'minireset.css/minireset.css'
import Login from './components/Login.vue'
// import Welcome from './components/Welcome.vue'
import Home from './components/Home.vue'
import Member from './components/member/member.vue'
import Order from './components/member/order.vue'
import Book from './components/book/book.vue'
import Category from './components/book/category.vue'
import Publish from './components/book/publish.vue'
import InStorage from './components/storage/inStorage.vue'
import OutStorage from './components/storage/outStorage.vue'
import Inventory from './components/storage/inventory.vue'
import Administrator from './components/system/administrator.vue'
import Module from './components/system/module.vue'
import Role from './components/system/role.vue'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [{
    path: '/login',
    component: Login,
    hidden: true //不显示在导航中
}, {
    path: '/',
    component: Home,
    name: '会员',
    iconCls: 'fa fa-user',
    children: [
        { path: '/member', component: Member, name: '会员管理' },
        { path: '/order', component: Order, name: '订单管理' }
    ]
}, {
    path: '/',
    component: Home,
    name: '图书',
    iconCls: 'fa fa-book',
    children: [
        { path: '/book', component: Book, name: '图书管理' },
        { path: '/category', component: Category, name: '类别管理' },
        { path: '/publish', component: Publish, name: '出版社管理' }
    ]
}, {
    path: '/',
    component: Home,
    name: '仓库',
    iconCls: 'fa fa-home',
    children: [
        { path: '/inStorage', component: InStorage, name: '入库管理' },
        { path: '/outStorage', component: OutStorage, name: '出库管理' },
        { path: '/inventory', component: Inventory, name: '库存管理' }
    ]
}, {
    path: '/',
    component: Home,
    name: '系统',
    iconCls: 'fa fa-gear',
    children: [
        { path: '/administrator', component: Administrator, name: '管理员管理' },
        { path: '/moudle', component: Module, name: '模块管理' },
        { path: '/role', component: Role, name: '角色管理' }
    ]
}]

const router = new VueRouter({
    routes
});

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

router.replace('/member');
