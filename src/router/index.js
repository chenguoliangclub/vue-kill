import Vue from 'vue'
import Router from 'vue-router'
import Policy from '@/components/Policy'
import Pay from "../components/Pay";
import Index from "../components/Index";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay
    }
  ]
})
