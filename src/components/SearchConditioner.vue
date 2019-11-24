<template>
  <div class="searcher">
    <div class="searcher__main">
      <a class="searcher__tooltip" @click="showOption = !showOption">
        <span class="icon__three-lines" :class="{ 'icon__three-lines--rotate': showOption }"></span>
      </a>
      <input type="text"
        v-model="term"
        class="searcher__text"
        spellcheck="false"
        onfocus="select();"
        placeholder="検索"
        @keyup="onKeyup">
      <a class="searcher__tooltip" @click="launch" style="width: 44px;">
        <span class="icon__search"></span>
      </a>
      <a class="searcher__tooltip" @click="clear">
        <span class="icon__clear"></span>
      </a>
    </div>
    <transition name="searcher__option--trans">
      <div class="searcher__option" v-if="showOption">
        <label class="searcher__check">
          <input class="searcher__check-input" type="checkbox" v-model="onlyTodo">
          <span class="searcher__label">todoのみ</span>
        </label>
        <label for="date-from">
          <div class="searcher__label">作成日</div>
          <div class="searcher__date-from-to">
            <DateInput id="date-from" v-model="dateFrom" :showYesterdayTommorow="false" />
            <span class="searcher__label">〜</span>
            <DateInput v-model="dateTo" :showYesterdayTommorow="false" />
          </div>
        </label>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import moment from 'moment';
import DateInput from './DateInput.vue';

@Component({
  components: {
    DateInput,
  },
})
export default class SearchConditioner extends Vue {

  private showOption = false;

  private term = '';
  private onlyTodo = false;
  private dateFrom: moment.Moment | null = null;
  private dateTo: moment.Moment | null = null;

  private get terms() { return this.term.split(/[\x20\u3000]/).filter((t) => t.length > 0); }

  public launch() {
    this.showOption = false;
    let from: moment.Moment | null;
    let to: moment.Moment | null;
    if (this.dateFrom && this.dateTo) {
      from = moment.min(this.dateFrom, this.dateTo);
      to = moment.max(this.dateFrom, this.dateTo);
    } else {
      from = this.dateFrom;
      to = this.dateTo;
    }
    this.$emit('launch', {
      terms: this.terms,
      onlyTodo: this.onlyTodo,
      from: from,
      to: to,
    });
  }
  public clear() {
    this.term = '';
    this.onlyTodo = false;
    this.dateFrom = null;
    this.dateTo = null;
    this.launch();
  }
  @Emit() public cancel() { /* */ }

  // 検索窓内でEnter押したら検索実行
  private onKeyup(e: KeyboardEvent) {
    if (e.keyCode === 13) { this.launch(); }
  }
}
</script>

<style lang="scss">
.searcher {
  position: relative;
  &__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
    background: $c_accent;
    & > * {
      margin: 0 4px;
    }
  }
  &__option {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: -1;
    background: $c_accent;
    & > * {
      padding: 6px;
    }
    & > :not(:first-child) {
      border-top: 1px solid $c_font;
    }
    &--trans {
      &-enter-active, &-leave-active {
        transition: .2s;
        transform-origin: top;
      }
      &-enter, &-leave-to {
        transform: translateY(-100%);
      }
    }
  }
  &__text {
    flex: 1;
    font-size: 20px;
    padding: 7px;
    border: none;
    border-radius: 1em;
    width: 11em;
    outline: none;
    &::placeholder {
      color: rgba($c_font_weak, .5);
    }
  }
  &__tooltip {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    align-self: stretch;
  }
  &__label {
    color: $c_base;
    font-size: 12px;
    white-space: nowrap;
    margin: 0 6px;
  }
  &__check {
    display: flex;
    align-items: center;
  }
  &__check-input {
    margin: 0;
  }
  &__date-from-to {
    display: flex;
    align-items: center;
  }
}
// 横三本線アイコン
.icon__three-lines {
  display: inline-block;
  position: relative;
  width: 24px;
  height: 2px;
  margin: 11px 0;
  background-color: $c_base;
  transition: .3s;
  &--rotate {
    transform: scaleY(1.5);
  }
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: -8px;
    width: 24px;
    height: 2px;
    background-color: $c_base;
  }
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 8px;
    width: 24px;
    height: 2px;
    background-color: $c_base;
  }
}
// 虫眼鏡アイコン
.icon__search {
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
  border: 2px solid $c_base;
  border-radius: 50%;
  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 2px;
    bottom: -3px;
    right: -3px;
    transform: rotate(45deg);
    background-color: $c_base;
  }
  &:active {
    transform: translateY(1px);
  }
}
// ばってんアイコン
.icon__clear {
  display: inline-block;
  position: relative;
  width: 24px;
  height: 2px;
  transform: rotate(45deg);
  background-color: $c_base;
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 2px;
    transform: rotate(90deg);
    background-color: $c_base;
  }
  &:active {
    transform: rotate(45deg) translateX(1px) translateY(1px);
  }
}
</style>
