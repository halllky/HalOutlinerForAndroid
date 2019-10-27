<template>
  <div class="searcher">
    <input type="text"
      v-model="term"
      class="searcher__text"
      spellcheck="false"
      onfocus="select();"
      placeholder="検索"
      @keyup="onKeyup">
    <label class="searcher__check">
      <input type="checkbox" v-model="onlyTodo">
      todoのみ
    </label>
    <input type="button" value="検索" @click="launch">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';

@Component({})
export default class SearchConditioner extends Vue {
  private term = '';
  private onlyTodo = false;

  private get terms() { return this.term.split(/[\x20\u3000]/).filter((t) => t.length > 0); }

  public launch() {
    this.$emit('launch', {
      terms: this.terms,
      onlyTodo: this.onlyTodo,
    });
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
  padding: 2px;
  background: $c_accent;
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
  &__check {
    font-size: 12px;
    white-space: nowrap;
    color: $c_base;
  }
}
</style>
