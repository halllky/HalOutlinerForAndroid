import Dexie from 'dexie';
import { MemoBase } from './memo';

class DexieEx extends Dexie {
  // Dexie.Table<オブジェクトの型, キーの型>
  public Memos!: Dexie.Table<MemoBase, number>;

  public constructor(dbname: string) {
    // データベース名を知らせる
    super(dbname);
    // スキーマ定義
    this.version(1).stores({
      Memos: '++id',
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
export default class DB {
  public get dataCount(): number { return this.mDataCount; }
  private mDataCount = 0;
  private db!: DexieEx;

  constructor(dbname: string) {
    this.db = new DexieEx(dbname);
    this.updateDataCount();
  }

  public async save(memo: MemoBase): Promise<number> {
    return this.db.Memos.put(memo.getRoot()).then((id) => {
      this.updateDataCount();
      return id;
    });
  }
  public async load({limit = 1, offset = 0}): Promise<MemoBase[]> {
    return this.db.Memos.offset(offset).limit(limit).toArray().then((arr) => {
      return arr.map((m) => MemoBase.create(m.type, m));
    });
  }
  public async loadById(id: number): Promise<MemoBase | undefined> {
    return this.db.Memos.get(id);
  }
  public async delete(id: number): Promise<void> {
    return this.db.Memos.delete(id).then(() => {
      this.updateDataCount();
    });
  }
  public async clear() {
    return this.db.Memos.clear().then(() => {
      this.updateDataCount();
    });
  }
  public async exterminateDatabase() {
    return this.db.delete();
  }
  private updateDataCount() {
    this.db.Memos.toArray().then((all) => this.mDataCount = all.length);
  }
}
