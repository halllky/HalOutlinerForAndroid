import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

// recursive component
Vue.component('MemoNode', import('@/components/MemoList/MemoNode.vue'));

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
