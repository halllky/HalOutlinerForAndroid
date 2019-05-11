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
  const m1 = MemoBase.create(E_MemoType.Text);
  m1.value = 'aaa';
  const m1child = MemoBase.create(E_MemoType.Text);
  m1child.value = 'aaa_child';
  m1.addChild(m1child);
  const m2 = MemoBase.create(E_MemoType.Text);
  m2.value = 'bbb';
  const m3 = MemoBase.create(E_MemoType.Text);
  m3.value = 'ccc';
  DB.clear().then(() => {
    return DB.save(m1);
  }).then((insertedKey) => {
    return DB.loadById(insertedKey);
  }).then((response) => {
    assert.notEqual(response, undefined, 'test2-1');
    if (response) {
      const restored = MemoBase.create(response.type, response);
      assert.notEqual(restored.children[0].createdTime, undefined, 'test2-2');
    }
  }).then(() => {
    return DB.save(m2);
  }).then(() => {
    return DB.save(m3);
  }).then(() => {
    return DB.load({offset: 1});
  }).then((result) => {
    assert.equal(result.length, 1, 'test2-3');
    assert.equal(result[0].value, 'bbb', 'test2-4');
  }).then(() => {
    DB.clear();
  });
}
