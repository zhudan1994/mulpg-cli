import Vue from 'vue'
import 'lib-flexible'
import Page from '@/components/app.vue'

const gvm = new Vue({
  el: '#app',
  components: {
    Page
  },
  template: '<Page />'
})
