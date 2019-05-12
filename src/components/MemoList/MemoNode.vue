<template>
  <li class="memo" :class="{'memo_root': model.getRoot() === model}">
    <div class="memo__body" :class="{'memo__body_root': model.getRoot() === model}">
      <input type="button"
        class="memo__body__expand"
        :value="showChildren || model.children.length === 0 ? '-' : model.children.length"
        @click="collapse">
      <StretchableTextarea
        ref="textarea"
        v-model="model.value"
        class="memo__body__text"
        :style="{'font-size': $store.state.fontSize + 'px'}"
        @blur="deleteIfEmpty"
      ></StretchableTextarea>
      <input type="button" value="+" @click="addChild" class="memo__body__add">
    </div>
    <ul class="memo__children" v-if="showChildren">
      <MemoNode
        ref="child"
        v-for="(memo, index) in model.children" :key="index"
        :model="memo"
        @deleted="removeChild(memo)"
      ></MemoNode>
    </ul>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import StretchableTextarea from './StretchableTextarea.vue';
import { MemoBase } from '@/ts/memo';
import { E_MemoType } from '@/ts/const';
import DB from '@/ts/db';

@Component({
  name: 'MemoNode',
  components: {
    StretchableTextarea,
  },
})
export default class MemoNode extends Vue {
  @Prop() public model!: MemoBase;
  private showChildren = true;

  public deleteIfEmpty() {
    if (this.model.value === '' && this.model.children.length === 0) {
      this.$emit('deleted', this.model);
    }
  }
  public addChild() {
    this.model.addChild(MemoBase.create(E_MemoType.Text));
    this.$nextTick(() => {
      // focus to last child (= added child)
      ((this.$refs.child as Vue[])[this.model.children.length - 1] as MemoNode).focus();
    });
  }
  public removeChild(item: MemoBase) { this.model.removeChild(item); }
  public focus() { (this.$refs.textarea as StretchableTextarea).focus(); }
  public setCollapse(collapse: boolean) {
    this.showChildren = !collapse;
    if (this.$refs.child === undefined) { return; }
    (this.$refs.child as Vue[]).forEach((c) => (c as MemoNode).setCollapse(collapse));
  }

  private save() { (this.$store.state.db as DB).save(this.model).then((id) => this.model.id = id); }
  @Watch('model.value') private onValueChanged() { this.save(); }
  @Watch('model.children.length') private onChildChanged() { this.save(); }
  private collapse() {
    this.showChildren = !this.showChildren;
  }
}
</script>

<style lang="scss">
.memo{
  &__body{
    display: flex;
    background-color: $c_base;
    border-radius: 2px;
    margin: 1px;
    &_root{
      position: sticky;
      top: 0;
      filter: drop-shadow(1px 1px 1px $c_main);
    }
    &__text{
      outline: none;
      border: none;
      flex: 1;
      background-color: $c_base;
    }
    &__expand{
      @include btn-base($bg-color: transparent, $font-color: $c_accent);
    }
    &__add{
      @include btn-base();
    }
  }
  &__children{
    padding-left: 1em;
  }
}
</style>
