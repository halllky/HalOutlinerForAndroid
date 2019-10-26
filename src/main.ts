import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

// モバイル端末でドラッグドロップを有効にする
import { polyfill } from 'mobile-drag-drop';
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import 'mobile-drag-drop/default.css';
polyfill({ dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride });

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
