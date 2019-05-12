<template>
  <div id="app" class="app">
    <div class="app__body">
      <MyPager
        v-model="pageIndex"
        :pageSize="$store.state.pageSize"
        :allDataCount="allDataCount"
      ></MyPager>
      <MemoList
        :model="shownMemos"
      ></MemoList>
      <MyPager
        v-model="pageIndex"
        :pageSize="$store.state.pageSize"
        :allDataCount="allDataCount"
      ></MyPager>
    </div>
    <div class="app__footer">
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

@Component({
  components: {
    MemoList,
    MyPager,
  },
})
export default class App extends Vue {
  public shownMemos: MemoBase[] = [];
  public pageIndex = 0;
  public get pageSize() { return (this.$store.state.pageSize as number); }
  public get allDataCount() { return (this.$store.state.db as DB).dataCount; }

  @Watch('pageIndex')
  private onPageChanged() {
    (this.$store.state.db as DB).load({
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize,
    }).then((data) => {
      this.shownMemos = data;
    });
  }

  private mounted() {
    import('@/test');
    this.onPageChanged();
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
    padding-right: 1em;
  }
}
</style>
