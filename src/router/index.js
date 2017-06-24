import Vue from 'vue'
import Router from 'vue-router'
//components
import hello from '@/components/Hello'
import home from '@/components/Home'
import device from '@/components/device'
import login from '@/components/login'
import user from '@/components/user'
import map from '@/components/map'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  routes: [{path: '/', name: 'map', component: map },
           {path: '/home', component: home },
    {
      path: '/device',
      component: device
    },
    {
      path: '/user',
      component: user
    },
    {
      path: '/map',
      component: map
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to);
  next();
  //TODO 对用户登录状态进行判断，如果未登录直接跳转到login
})
export default router