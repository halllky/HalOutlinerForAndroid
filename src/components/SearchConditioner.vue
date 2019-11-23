<template>
  <div class="searcher">
    <input type="text"
      v-model="term"
      class="searcher__text"
      spellcheck="false"
      onfocus="select();"
      placeholder="検索"
      @keyup="onKeyup">
    <input type="button" value="詳細" @click="showOption = !showOption">
    <input type="button" value="検索" @click="launch">
    <input type="button" value="クリア" @click="clear">
    <div class="searcher__option" v-if="showOption">
      <label class="searcher__label">
        <input type="checkbox" v-model="onlyTodo">
        todoのみ
      </label>
      <label for="date-from">
        <DateInput id="date-from" v-model="dateFrom" :showYesterdayTommorow="false" />
        〜
        <DateInput v-model="dateTo" :showYesterdayTommorow="false" />
      </label>
    </div>
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
    this.$emit('launch', {
      terms: this.terms,
      onlyTodo: this.onlyTodo,
      from: this.dateFrom,
      to: this.dateTo,
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
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 2px;
  background: $c_accent;
  &__option {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    background: $c_accent;
    & > * {
      padding: 6px;
    }
    & > :not(:first-child) {
      border-top: 1px solid $c_font;
    }
  }
  &__text {
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
  &__label {
    font-size: 12px;
    white-space: nowrap;
    color: $c_base;
  }
}
</style>
