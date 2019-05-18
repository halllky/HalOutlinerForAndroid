<template>
  <div id="app" class="app">
    <div class="app__body">
      <MyPager
        v-model="pageIndex"
        :pageSize="$store.state.pageSize"
        :allDataCount="allDataCount"
      ></MyPager>
      <MemoList
        ref="memoList"
        :model="shownMemos"
      ></MemoList>
      <MyPager
        v-model="pageIndex"
        :pageSize="$store.state.pageSize"
        :allDataCount="allDataCount"
        style="margin-bottom: 50vh;"
      ></MyPager>
    </div>
    <div class="app__footer">
      <input type="button" value="new memo" @click="addRootMemo" class="app__footer__btn">
      <input type="button" value="collapse" @click="collapse" class="app__footer__btn">
      <input type="button" value="download" @click="download" class="app__footer__btn">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import MemoList from '@/components/MemoList.vue';
import MyPager from '@/components/MyPager.vue';
import { TextMemo, MemoBase } from './ts/memo';
import { E_MemoType } from './ts/const';
import DB from './ts/db';
import MemoNode from './components/MemoList/MemoNode.vue';
import * as cordovaUtil from '@/cordova-util';

@Component({
  components: {
    MemoList,
    MyPager,
  },
})
export default class App extends Vue {
  public shownMemos: MemoBase[] = [];
  public pageIndex = 0;
  private isCollapsed = true;
  private addItemInPageIndexWatcher = false;
  public get pageSize() { return (this.$store.state.pageSize as number); }
  public get allDataCount() { return (this.$store.state.db as DB).dataCount; }

  // todo: refactor
  private addRootMemo() {
    this.addItemInPageIndexWatcher = true;
    const maxPageIndex = this.allDataCount === 0 ? 0 : Math.ceil(this.allDataCount / this.pageSize) - 1;
    if (this.pageIndex === maxPageIndex) {
      this.onPageChanged(maxPageIndex);
    } else {
      this.pageIndex = maxPageIndex;
    }
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

  @Watch('pageIndex')
  private onPageChanged(newVal = 0) {
    (this.$store.state.db as DB).load({
      limit: this.pageSize,
      offset: newVal * this.pageSize,
    }).then((data) => {
      this.shownMemos = data;
      if (this.addItemInPageIndexWatcher) {
        this.addItemInPageIndexWatcher = false;
        this.shownMemos.push(MemoBase.create(E_MemoType.Text));
        this.$nextTick(() => {
          (((this.$refs.memoList as MemoList).$refs.memo as Vue[])[this.shownMemos.length - 1] as MemoNode).focus();
        });
      }
    });
  }

  private mounted() {
    import('@/test');
    this.onPageChanged(0);
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
}
</style>
