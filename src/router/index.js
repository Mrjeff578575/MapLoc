import Vue from 'vue'
import Router from 'vue-router'
//components
//import device from '@/components/device'
import login from '@/components/login'
import user from '@/components/user'
import map from '@/components/map'
import register from '@/components/register'

Vue.use(Router)

let router =  new Router({
  routes: [
    {path: '/user',component: user},
    {path: '/map',component: map},
    {path: '/', component: map}
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to);
  next();
  //TODO 对用户登录状态进行判断，如果未登录直接跳转到login
})

function checkUserLogin() {

}
export default router