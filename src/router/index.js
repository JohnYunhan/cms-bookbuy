import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Welcome from './../components/welcome/welcome.vue'
import Home from '../components/Home.vue'
import Member from './../components/member/member.vue'
import Order from './../components/order/order.vue'
import Book from './../components/book/book.vue'
import Category from './../components/book/category.vue'
import Publish from './../components/book/publish.vue'
import Administrator from './../components/system/administrator.vue'
import Module from './../components/system/module.vue'
import Role from './../components/system/role.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
    hidden: true //不显示在侧边栏导航中
  }, {
    path: '/',
    component: Home,
    name: '首页',
    iconCls: 'fa fa-home',
    children: [
      { path: '/welcome', component: Welcome, name: '欢迎页' }
    ]
  }, {
    path: '/',
    component: Home,
    name: '会员',
    iconCls: 'fa fa-user',
    children: [
      { path: '/member', component: Member, name: '会员管理' }
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
    name: '订单',
    iconCls: 'fa fa-file-text-o',
    children: [
      { path: '/order', component: Order, name: '订单管理' },
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
})
