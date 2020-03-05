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
      name: 'Policy',
      component: Policy
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    }
  ]
})
