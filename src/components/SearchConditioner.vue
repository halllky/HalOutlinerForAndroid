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
</style>
