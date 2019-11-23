<template>
  <div class="date">
    <span class="date__yesterday" @click="addDate(-1)" v-if="showYesterdayTommorow"></span>
    <input type="date" ref="date" class="date__input" v-model="formatted">
    <span class="date__tomorrow" @click="addDate(1)" v-if="showYesterdayTommorow"></span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component({
  components: {
  },
})
export default class DateInput extends Vue {

  @Prop({ default: true }) showYesterdayTommorow!: boolean;
  // Moment型(v-model用)
  @Prop() value!: moment.Moment | null;
  private get _value() { return this.value; }
  private set _value(v) { this.$emit('input', v ? moment(v) : null); }
  // Moment型 <-> string
  private get formatted() {
    if (!this.value) return null;
    return this.value.format('YYYY-MM-DD');
  }
  private set formatted(v) { this._value = v ? moment(v) : null; }

  private addDate(days: number) {
    this._value = this._value ? this._value.add('day', days) : null;
  }
}
</script>

<style lang="scss" scoped>
.date {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  & > :not(:first-child) {
    margin-left: 12px;
  }
  &__input {
    position: relative;
    outline: none;
    width: 8.3em;
    padding: 3px 5px;
    border: none;
    border-radius: 18px;
    // filter: drop-shadow(0 0 0.3em rgb(74, 83, 122));
    /* サイドボタン消去 */
    &::-webkit-clear-button {
      appearance: none;
    }
    &::-webkit-inner-spin-button {
      appearance: none;
    }
    /* どこを押してもカレンダーが出るようにする */
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      margin-right: 1px; // Android for Chrome
    }
    /* 強制的に年だけが選択されるので見栄えを良くする */
    &::-webkit-datetime-edit-year-field:focus {
      background: none;
    }
  }
  &__yesterday {
    display: inline-block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 9.5px 11.4px 9.5px 0;
    border-color: transparent $c_font transparent transparent;
    &:active {
      transform: translateY(1px);
    }
  }
  &__tomorrow {
    @extend .date__yesterday;
    border-width: 9.5px 0 9.5px 11.4px;
    border-color: transparent transparent transparent $c_font;
  }
}
</style>
