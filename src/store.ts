import Vue from 'vue';
import Vuex from 'vuex';
import DB from './ts/db';
import { DBName } from './ts/const';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: new DB(DBName),
    pageSize: 10,
    fontSize: 14,
  },
  mutations: {
    CHANGE_PAGE_SIZE(store, size: number) { store.pageSize = size; },
    CHANGE_FONT_SIZE(store, size: number) { store.fontSize = size; },
  },
  actions: {

  },
});
