<template>
  <div class="searcher">
    <div class="searcher__condition">
      <input type="text"
        v-model="term"
        class="searcher__text"
        spellcheck="false"
        onfocus="select();">
      <label>
        <input type="checkbox" v-model="onlyTodo">
        todoのみ
      </label>
    </div>
    <div class="searcher__footer">
      <input type="button" value="OK" @click="launch">
      <input type="button" value="キャンセル" @click="cancel">
    </div>
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
}
</script>

<style lang="scss">
.searcher {
  &__condition {
    display: flex;
    flex-direction: column;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }
  &__text {
    font-size: 20px;
  }
}
</style>
