import * as assert from 'assert';
import { MemoBase } from '@/ts/memo';
import { E_MemoType, DBName } from '@/ts/const';
import DB from './ts/db';

// テストに通らなかった場合、VSCodeではデバッグコンソールに Assertion Error が出力されます。

// 1. restore class from object
{
  const chi = MemoBase.create(E_MemoType.Text);
  chi.value = '1';
  const par = MemoBase.create(E_MemoType.Text);
  par.children.push(chi);

  const restored = MemoBase.create(par.type, par);
  restored.children[0].value = '2';

  assert.notEqual(restored.children[0].createdTime, undefined, 'test1-1');
  assert.equal(chi.value, '1', 'test1-2');
}

// 2. db
{
  const chi = MemoBase.create(E_MemoType.Text);
  chi.value = '1';
  const par = MemoBase.create(E_MemoType.Text);
  par.children.push(chi);

  DB.save(par).then((insertedKey) => {
    return DB.load(insertedKey);
  }).then((response) => {
    assert.notEqual(response, undefined, 'test2-1');
    if (response) {
      const restored = MemoBase.create(response.type, response);
      assert.notEqual(restored.children[0].createdTime, undefined, 'test2-2');
      if (response.id !== undefined) { DB.delete(response.id); }
    }
  });
}
