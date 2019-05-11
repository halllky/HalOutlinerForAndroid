<template>
  <div>
    <ul class="memo-list">
      <MemoNode
        ref="memo"
        v-for="(memo, index) in model" :key="index"
        :model="memo"
        @deleted="removeMemo(memo)"
      ></MemoNode>
    </ul>
    <div>
      <input type="button" @click="addMemo" value="new" class="btn">
    </div>
  </div>
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

  public addMemo() {
    this.model.push(MemoBase.create(E_MemoType.Text));
    this.$nextTick(() => {
      ((this.$refs.memo as Vue[])[this.model.length - 1] as MemoNode).focus();
    });
  }
  public removeMemo(item: MemoBase) {
    if (item.id !== undefined) { (this.$store.state.db as DB).delete(item.id); }
    this.model.splice(this.model.indexOf(item), 1);
  }
}
</script>

<style lang="scss">
.memo-list{
  & > li:not(:first-child){
    margin-top: 1px;
  }
}
</style>
