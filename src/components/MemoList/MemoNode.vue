<template>
  <li class="memo" :class="{'memo_root': isRoot }">
    <div class="memo__body" ref="bodyMain" :class="{ 'memo__body_root': isRoot, 'memo__body_todo': isTodo}"
      @touchstart="onDragStart" @touchmove="onDrag" @touchend="onDragEnd" @touchcancel="onDragEnd"
    >
        <span class="memo__icon-todo" v-if="isTodo || !showChildren && hasTodoInChildren"></span>
        <!-- 子要素展開ボタン -->
        <input type="button"
          class="memo__body__expand"
          :value="showChildren || model.children.length === 0 ? '-' : model.children.length"
          @click="collapse">
        <label class="memo__body-main">
          <!-- メモ本体 -->
          <StretchableTextarea
            ref="textarea"
            v-model="model.value"
            class="memo__body__text"
            :class="{
              'memo__body__text_todo': isTodo,
              'memo__body__text_cancel': isCanceled,
              'memo__body__text--child': !isRoot
            }"
            :style="{'font-size': $store.state.fontSize + 'px'}"
            @blur="onBlurTextarea"
          ></StretchableTextarea>
          <!-- 作成時刻表示とアイテムd追加ボタン -->
          <div class="memo__body-footer">
            <span class="memo__time" v-if="isRoot" v-text="model.createdTime.toLocaleString()"></span>
            <input type="button" class="memo__add-btn" value="+" @click="onAddChildClicked">
          </div>
        </label>
    </div>
    <!-- 子 -->
    <ul class="memo__children" v-if="showChildren">
      <MemoNode
        ref="child"
        v-for="(memo, index) in model.children" :key="index"
        :model="memo"
        @deleted="onEmittedDelete(memo)"
      ></MemoNode>
    </ul>
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
  private showChildren = false;

  // テンプレート用
  private get isRoot() { return this.model === this.model.getRoot(); }
  private get isTodo() { return this.model.state === E_MemoState.Todo; }
  private get isCanceled() { return this.model.state === E_MemoState.Cancel; }
  private get hasTodoInChildren() {
    const hasTodo = (m: MemoBase): boolean => {
      return m.state === E_MemoState.Todo || m.children.some((c) => hasTodo(c));
    };
    return hasTodo(this.model);
  }

  public onBlurTextarea() {
    // 何も書かれていないメモなら削除
    if (this.model.value === '' && this.model.children.length === 0) {
      this.$emit('deleted', this.model);
    }
  }
  public onAddChildClicked() {
    this.model.addChild(MemoBase.create(E_MemoType.Text));
    this.showChildren = true;
    this.$nextTick(() => {
      // focus to last child (= added child)
      ((this.$refs.child as Vue[])[this.model.children.length - 1] as MemoNode).focus();
    });
  }
  public onEmittedDelete(item: MemoBase) { this.model.removeChild(item); }
  public focus() { (this.$refs.textarea as StretchableTextarea).focus(); }

  private save() {
    (this.$store.state.db as DB).save(this.model).then((id) => {
      this.model.id = this.isRoot ? id : undefined;
    });
  }
  @Watch('model.value') private onValueChanged() { this.save(); }
  @Watch('model.state') private onStateChanged() { this.save(); }
  @Watch('model.children.length') private onChildChanged() { this.save(); }
  private collapse() {
    this.showChildren = !this.showChildren;
  }

  private onSwipe() {
    // todoの状態を変える
    if (this.model.state === E_MemoState.None) {
      this.model.state = E_MemoState.Todo;
    } else if (this.model.state === E_MemoState.Todo) {
      this.model.state = E_MemoState.Cancel;
    } else {
      this.model.state = E_MemoState.None;
    }
  }

  /** 横スワイプ制御(onSwipeイベント起動のため) */
  private dragStartX = 0;
  private isSwipeEventOccured = false;
  private onDragStart(e: TouchEvent) {
    this.dragStartX = e.touches[0].clientX;
    this.isSwipeEventOccured = false;
  }
  private onDrag(e: TouchEvent) {
    // タッチ開始地点からの横方向移動距離
    const distance = e.touches[0].clientX - this.dragStartX;
    // 要素を横にずらす。画面スクロールで動かないように、距離が小さければ動かさない
    const bodyMain = this.$refs.bodyMain as HTMLElement;
    bodyMain.style.transform = Math.abs(distance) < 40 ? '' : `translateX(${distance}px)`;
    // 一定以上横方向に移動したらonSwipeイベント発火
    const triggerLine = (this.$el as HTMLElement).clientWidth / 2;
    if (!this.isSwipeEventOccured && Math.abs(distance) > triggerLine) {
      this.onSwipe();
      // 1度のスワイプで1回だけ発火するようにする
      this.isSwipeEventOccured = true;
    }
  }
  private onDragEnd(e: TouchEvent) {
    const bodyMain = this.$refs.bodyMain as HTMLElement;
    bodyMain.style.transform = '';
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
    padding: 4px;
    z-index: 1;
    &_todo{
      background-color: $c_main_todo;
    }
    &__text{
      outline: none;
      border: none;
      background-color: transparent;
      &--child{
        padding-right: 28px; // 追加ボタンで文字が隠れるのを防ぐ
      }
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
  &__body-main{
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
  }
  &__body-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  &__time{
    font-size: 10px;
    color: $c_font_weak;
    user-select: none;
    margin-right: 4em;
  }
  &__add-btn {
    @extend .btn;
    position: absolute;
    bottom: -6px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    z-index: 1;
  }
  &__children{
    padding-left: 1em;
  }
  &__icon-todo{
    pointer-events: none;
    position: absolute;
    top: -4px;
    left: -4px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: $c_font_todo;
    color: $c_main;
    &::before{
      content: '!';
      font-size: 11px;
    }
  }
}
</style>
