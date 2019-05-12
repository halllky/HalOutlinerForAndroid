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

  public setCollapse(collapse: boolean) {
    (this.$refs.memo as Vue[]).forEach((m) => (m as MemoNode).setCollapse(collapse));
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
}
</style>
