<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TextMemo, MemoBase } from './ts/memo';
import { E_MemoType } from './ts/enums';

@Component({
  components: {
  },
})
export default class App extends Vue {
  public mounted() {
    this.testOfRestoreObject();
  }

  public testOfRestoreObject() {
    const chi = new TextMemo({value: 'saa'});
    const par = new TextMemo({value: 'saa', children: [chi]});
    alert(par.children[0].createdTime);
  }
}
</script>

<style lang="scss">
</style>
