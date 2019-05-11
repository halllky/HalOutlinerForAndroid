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
  public static recreate(): void {
    this.db.delete();
    this.db = new DBInstance();
  }
  public static async save(memo: MemoBase): Promise<number> {
    return this.db.Memos.put(memo, memo.id);
  }
  public static async load(id: number): Promise<MemoBase | undefined> {
    return this.db.Memos.get(id);
  }
  private static db: DBInstance = new DBInstance();
}
