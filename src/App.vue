<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TextMemo, MemoBase } from './ts/memo';
import { E_MemoType } from './ts/const';

@Component({
  components: {
  },
})
export default class App extends Vue {
  public mounted() {
    import('@/test');
  }
}
</script>

<style lang="scss">
</style>
