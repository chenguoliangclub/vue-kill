// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import Axios from "axios"
import 'element-ui/lib/theme-chalk/index.css'

Axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.prototype.$message = ElementUi.Message;
Vue.prototype.$confirm = ElementUi.MessageBox.confirm;
Vue.prototype.$http = Axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
