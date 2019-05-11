<template>
  <li class="memo">
    <StretchableTextarea
      ref="textarea"
      v-model="model.value"
      class="memo__value"
      @blur="deleteIfEmpty"
    ></StretchableTextarea>
    <a @click="addChild">+</a>
    <ul class="memo__children">
      <MemoNode
        ref="child"
        v-for="(memo, index) in model.children" :key="index"
        :model="memo"
        @deleted="removeChild(memo)"
      ></MemoNode>
    </ul>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import StretchableTextarea from './StretchableTextarea.vue';
import { MemoBase } from '@/ts/memo';
import { E_MemoType } from '@/ts/const';
import DB from '@/ts/db';

@Component({
  components: {
    StretchableTextarea,
  },
})
export default class MemoNode extends Vue {
  @Prop() public model!: MemoBase;

  public deleteIfEmpty() {
    if (this.model.value === '' && this.model.children.length === 0) {
      this.$emit('deleted', this.model);
    }
  }
  public addChild() {
    this.model.addChild(MemoBase.create(E_MemoType.Text));
    this.$nextTick(() => {
      // focus to last child (= added child)
      ((this.$refs.child as Vue[])[this.model.children.length - 1] as MemoNode).focus();
    });
  }
  public removeChild(item: MemoBase) { this.model.removeChild(item); }
  public focus() { (this.$refs.textarea as StretchableTextarea).focus(); }

  private save() { (this.$store.state.db as DB).save(this.model).then((id) => this.model.id = id); }
  @Watch('model.value') private onValueChanged() { this.save(); }
  @Watch('model.children.length') private onChildChanged() { this.save(); }
}
</script>
