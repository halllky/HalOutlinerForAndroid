<template>
  <div id="app" class="app">
    <div class="app__body">
      <MemoList
        ref="memoList"
        :model="shownMemos"
      ></MemoList>
    </div>
    <div class="app__footer">
      <input type="button" value="new memo" @click="addRootMemo" class="app__footer__btn">
      <input type="button" value="filter" @click="openSearcher" class="app__footer__btn">
      <input type="button" value="collapse" @click="collapse" class="app__footer__btn">
      <input type="button" value="download" @click="download" class="app__footer__btn">
    </div>
    <div v-if="dialogOpened" class="app__shade">
      <SearchConditioner
        class="app__dialog"
        @launch="onSearchConditionChanged"
        @cancel="dialogOpened = false"
      ></SearchConditioner>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import MemoList from '@/components/MemoList.vue';
import SearchConditioner from '@/components/SearchConditioner.vue';
import { TextMemo, MemoBase } from './ts/memo';
import { E_MemoType } from './ts/const';
import DB from './ts/db';
import MemoNode from './components/MemoList/MemoNode.vue';
import * as cordovaUtil from '@/cordova-util';

@Component({
  components: {
    InfiniteLoading,
    MemoList,
    SearchConditioner,
  },
})
export default class App extends Vue {
  public shownMemos: MemoBase[] = [];
  private isCollapsed = true;
  private dialogOpened = false;
  private searchTerms: string[] = [];
  private showOnlyTodo = false;

  // todo: refactor
  private addRootMemo() {
  }
  private collapse() {
    (this.$refs.memoList as MemoList).setCollapse(this.isCollapsed);
    this.isCollapsed = !this.isCollapsed;
  }
  private async download() {
      if (!confirm('download?')) { return; }
      const all = await (this.$store.state.db as DB).load({limit: 99999, offset: 0});
      const json = JSON.stringify(all, (key, val) => key === 'parent' ? undefined : val);
      const blob = new Blob([json], {type: 'application/json'});
      const fileName = 'HalOutliner';
      if (cordovaUtil.isAndroid()) {
        prompt('copy here', json);
      } else {
        const btn = document.createElement('a');
        btn.href = URL.createObjectURL(blob);
        btn.download = fileName;
        btn.click();
      }
  }
  private openSearcher() {
    this.dialogOpened = !this.dialogOpened;
  }
  private onSearchConditionChanged(condition: { terms: string[], onlyTodo: boolean }) {
    this.searchTerms = condition.terms;
    this.showOnlyTodo = condition.onlyTodo;
    this.dialogOpened = false;
  }

  private mounted() {
    import('@/test');
  }
}
</script>

<style lang="scss">
.app{
  display: flex;
  flex-direction: column;
  width: 100%;
  &__body{
    flex: 1;
    overflow-y: scroll;
  }
  &__footer{
    display: flex;
    justify-content: space-around;
    & :not(:first-child){
      margin-left: 4px;
    }
    &__btn{
      @include btn-base();
      flex: 1;
      height: 24px;
    }
  }
  &__shade{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(black, 0.3);
  }
  &__dialog{
    padding: 1em;
    background-color: $c_base;
    border-radius: 4px;
  }
}
</style>
