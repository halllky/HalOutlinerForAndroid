<template>
  <textarea
    v-model="_value"
    spellcheck="false"
    class="str-text"
    @blur="blur"
  ></textarea>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class StretchableTextarea extends Vue {
  @Prop() public value!: string;
  public get _value(): string { return this.value; }
  public set _value(newVal) { this.$emit('input', newVal); }

  @Emit() public blur() { /**/ }

  public mounted() { this.resize(); }
  public updated() { this.resize(); }

  public focus() { (this.$el as HTMLElement).focus(); }
  private resize() {
    const textarea = this.$el as HTMLElement;
    textarea.style.height = '0';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
</script>

<style lang="scss" scoped>
.str-text{
  resize: none;
  overflow: hidden;
}
</style>
