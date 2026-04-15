import Vue from 'vue'
import App from './App.vue'
import router from './router' // Import the router file

Vue.config.productionTip = false

new Vue({
  router, // Attach router to Vue
  render: h => h(App)
}).$mount('#app')