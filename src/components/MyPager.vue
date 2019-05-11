<template>
  <div>
    <div>
      <span @click="pageIndex--">prev</span>
      ＜＜　＞＞
      <span @click="pageIndex++">next</span>
    </div>
    {{ (firstDataIndex + 1) + ' 〜 ' + (lastDataIndex + 1) + ' / ' + allDataCount }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

@Component({})
export default class MyPager extends Vue {
  @Prop() public value!: number;
  @Prop() public pageSize!: number;
  @Prop() public allDataCount!: number;

  public get pageIndex() { return this.value; }
  public set pageIndex(val) { this.$emit('input', Math.max(0, Math.min(this.maxPageIndex - 1, val))); }
  private get maxPageIndex() {
    return this.allDataCount === 0 ? 0 : Math.ceil(this.allDataCount / this.pageSize);
  }
  private get firstDataIndex() {
    return this.allDataCount === 0 ? -1 : this.pageIndex * this.pageSize;
  }
  private get lastDataIndex() {
    return Math.min(this.allDataCount - 1, (this.pageIndex + 1) * this.pageSize - 1);
  }
}
</script>
