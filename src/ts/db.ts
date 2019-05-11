import Dexie from 'dexie';
import { MemoBase } from './memo';
import { DBName } from './const';

class DBInstance extends Dexie {
  // Dexie.Table<オブジェクトの型, キーの型>
  public Memos!: Dexie.Table<MemoBase, number>;

  public constructor() {
    // データベース名を知らせる
    super(DBName);
    // スキーマ定義
    this.version(1).stores({
      Memos: '++id',
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
export default class DB {
  public static async save(memo: MemoBase): Promise<number> {
    return this.db.Memos.put(memo.getRoot(), memo.getRoot().id);
  }
  public static async load({limit = 1, offset = 0}): Promise<MemoBase[]> {
    return this.db.Memos.offset(offset).limit(limit).toArray();
  }
  public static async loadById(id: number): Promise<MemoBase | undefined> {
    return this.db.Memos.get(id);
  }
  public static async delete(id: number): Promise<void> {
    return this.db.Memos.delete(id);
  }
  public static async clear() {
    return this.db.Memos.clear();
  }
  private static db: DBInstance = new DBInstance();
}
