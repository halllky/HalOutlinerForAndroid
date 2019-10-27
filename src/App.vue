<template>
  <div id="app" class="app">
    <div class="app__header">
      <SearchConditioner
        @launch="search"
      ></SearchConditioner>
    </div>
    <div class="app__body">
      <MemoList
        ref="memoList"
        :model="shownMemos"
      ></MemoList>
      <InfiniteLoading
        ref="infBottom"
        v-if="isInitialized"
        direction="bottom"
        distance="250"
        @infinite="loadMore"
      >
        <template v-slot:no-results>*</template>
        <template v-slot:no-more>*</template>
      </InfiniteLoading>
    </div>
    <input type="button" value="+" @click="addRootMemo" class="app__float-btn--left">
    <input type="button" value="…" @click="download" class="app__float-btn--right">
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
  private dialogOpened = false
  private isInitialized = false;
  private searchTerms: string[] = [];
  private showOnlyTodo = false;
  private offset: number = 0;
  private chunk = 50;

  public search(condition: {
    terms: string[],
    onlyTodo: boolean,
  }) {
    this.searchTerms = condition.terms;
    this.showOnlyTodo = condition.onlyTodo;
    this.reset();
    this.dialogOpened = false;
  }

  private async reset() {
    return (this.$store.state.db as DB).load({
      limit: this.chunk,
      offset: 0,
      filter: {
        terms: this.searchTerms,
        onlyTodo: this.showOnlyTodo,
      },
    }).then((memos) => {
      this.shownMemos = memos;
      this.isInitialized = true;
      if (memos.length) { this.offset = memos.length; }
      (this.$refs.infBottom as InfiniteLoading).stateChanger.reset();
    });
  }
  private async loadMore($state: any) {
    return (this.$store.state.db as DB).load({
      limit: this.chunk,
      offset: this.offset,
      filter: {
        terms: this.searchTerms,
        onlyTodo: this.showOnlyTodo,
      },
    }).then(async (memos) => {
      if (memos.length) {
        this.shownMemos.push(...memos);
        this.offset += memos.length;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        $state.loaded();
      } else {
        $state.complete();
      }
    });
  }
  private addRootMemo() {
    this.shownMemos.unshift(MemoBase.create(E_MemoType.Text));
    this.$nextTick(() => {
      (this.$refs.memoList as MemoList).focusToLatest();
    });
  }
  private async download() {
      if (!confirm('download?')) { return; }
      const all = await (this.$store.state.db as DB).load({limit: 99999, offset: 0});
      const json = JSON.stringify(all, (key, val) => key === 'parent' ? undefined : val);
      const blob = new Blob([json], {type: 'application/json'});
      cordovaUtil.download('HalOutliner.json', blob);
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
    this.reset();
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
  &__float-btn{
    @include btn-base();
    position: absolute;
    bottom: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 28px;
    &--left {
      @extend .app__float-btn;
      left: 12px;
    }
    &--right {
      @extend .app__float-btn;
      right: 12px;
    }
  }
}
</style>
