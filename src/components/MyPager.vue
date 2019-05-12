<template>
  <div class="pager">
    <div class="pager__buttons">
      <input type="button" @click="pageIndex--" value="prev" class="pager__buttons__btn">
      <input type="button" @click="pageIndex++" value="next" class="pager__buttons__btn">
    </div>
    <div class="pager__count">
      {{ (firstDataIndex + 1) + ' 〜 ' + (lastDataIndex + 1) + ' / ' + allDataCount }}
    </div>
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

<style lang="scss">
.pager{
  &__buttons{
    display: flex;
    justify-content: space-around;
    &__btn{
      @include btn-base();
      flex: 1;
      &:not(:first-child){
        margin-left: 1em;
      }
    }
  }
  &__count{
    font-size: 11px;
    text-align: center;
  }
}
</style>
