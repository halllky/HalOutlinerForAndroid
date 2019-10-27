<template>
  <ul class="memo-list">
    <MemoNode
      ref="memo"
      v-for="(memo, index) in model" :key="memo.id || 'new' + index"
      :model="memo"
      @deleted="removeMemo(memo)"
    ></MemoNode>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import MemoNode from './MemoList/MemoNode.vue';
import { MemoBase } from '@/ts/memo';
import { E_MemoType } from '@/ts/const';
import DB from '../ts/db';

@Component({
  components: {
    MemoNode,
  },
})
export default class MemoList extends Vue {
  @Prop() public model!: MemoBase[];

  public focusToLatest() {
    if (this.model.length === 0) { return; }
    ((this.$refs.memo as Vue[])[this.model.length - 1] as MemoNode).focus();
  }
  public removeMemo(item: MemoBase) {
    if (item.id !== undefined) { (this.$store.state.db as DB).delete(item.id); }
    this.model.splice(this.model.indexOf(item), 1);
  }
}
</script>

<style lang="scss">
.memo-list{
  padding: 1px;
  overflow-x: hidden;  // スワイプ対応
}
</style>
