import * as assert from 'assert';
import { MemoBase } from '@/ts/memo';
import { E_MemoType } from '@/ts/enums';

// テストに通らなかった場合、VSCodeではデバッグコンソールに Assertion Error が出力されます。

// restore class from object
{
  const chi = MemoBase.create(E_MemoType.Text);
  chi.value = '1';
  const par = MemoBase.create(E_MemoType.Text);
  par.children.push(chi);

  const restored = MemoBase.create(par.type, par);
  restored.children[0].value = '2';

  assert.notEqual(restored.children[0].createdTime, undefined);
  assert.equal(chi.value, '1');
}
