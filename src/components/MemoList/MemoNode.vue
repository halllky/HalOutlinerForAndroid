<template>
  <li class="memo" :class="{'memo_root': model.getRoot() === model}">
    <div class="memo__body" :class="{
      'memo__body_root': model.getRoot() === model,
      'memo__body_todo': isTodo}">
        <input type="button"
          class="memo__body__expand"
          :value="showChildren || model.children.length === 0 ? '-' : model.children.length"
          @click="collapse">
        <StretchableTextarea
          ref="textarea"
          v-model="model.value"
          class="memo__body__text"
          :class="{'memo__body__text_todo': isTodo, 'memo__body__text_cancel': isCanceled}"
          :style="{'font-size': $store.state.fontSize + 'px'}"
          @blur="deleteIfEmpty"
        ></StretchableTextarea>
        <div class="memo__body__right">
          <input type="button" value="+" @click="addChild" class="btn">
          <input type="button" value="s" @click="changeState" class="btn">
        </div>
    </div>
    <ul class="memo__children" v-if="showChildren">
      <MemoNode
        ref="child"
        v-for="(memo, index) in model.children" :key="index"
        :model="memo"
        @deleted="removeChild(memo)"
      ></MemoNode>
    </ul>
    <span class="memo__icon-todo" v-if="isTodo || !showChildren && hasTodoInChildren"></span>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import StretchableTextarea from './StretchableTextarea.vue';
import { MemoBase } from '@/ts/memo';
import { E_MemoType, E_MemoState } from '@/ts/const';
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

  private get isTodo() { return this.model.state === E_MemoState.Todo; }
  private get isCanceled() { return this.model.state === E_MemoState.Cancel; }
  private get hasTodoInChildren() {
    const hasTodo = (m: MemoBase): boolean => {
      return m.state === E_MemoState.Todo || m.children.some((c) => hasTodo(c));
    };
    return hasTodo(this.model);
  }

  public deleteIfEmpty() {
    if (this.model.value === '' && this.model.children.length === 0) {
      this.$emit('deleted', this.model);
    }
  }
  public addChild() {
    this.model.addChild(MemoBase.create(E_MemoType.Text));
    this.showChildren = true;
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
  public changeState() {
    switch (this.model.state) {
      case E_MemoState.Todo: this.model.state = E_MemoState.Cancel; break;
      case E_MemoState.None: this.model.state = E_MemoState.Todo; break;
      default: this.model.state = E_MemoState.None; break;
    }
  }

  private save() {
    (this.$store.state.db as DB).save(this.model).then((id) => {
      this.model.id = this.model === this.model.getRoot() ? id : undefined;
    });
  }
  @Watch('model.value') private onValueChanged() { this.save(); }
  @Watch('model.state') private onStateChanged() { this.save(); }
  @Watch('model.children.length') private onChildChanged() { this.save(); }
  private collapse() {
    this.showChildren = !this.showChildren;
  }
}
</script>

<style lang="scss">
.memo{
  position: relative;
  &__body{
    display: flex;
    background-color: $c_main;
    border-radius: 2px;
    margin: 1px;
    &_root{
      position: sticky;
      top: 0;
      filter: drop-shadow(1px 1px 1px $c_base);
    }
    &_todo{
      background-color: $c_main_todo;
    }
    &__text{
      outline: none;
      border: none;
      flex: 1;
      background-color: transparent;
      &_todo{
        color: $c_font_todo;
      }
      &_cancel{
        color: $c_font_weak;
        text-decoration: line-through;
      }
    }
    &__expand{
      @include btn-base($bg-color: transparent, $font-color: $c_accent);
    }
    &__right{
      display: flex;
      & :not(:first-child){
        margin-left: 1px;
      }
    }
  }
  &__children{
    padding-left: 1em;
  }
  &__icon-todo{
    pointer-events: none;
    position: absolute;
    top: -4px;
    left: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    transform: rotate(-10deg);
    background-color: $c_font_todo;
    color: $c_main;
    &::before{
      content: '!';
      font-size: 11px;
    }
  }
}
</style>
