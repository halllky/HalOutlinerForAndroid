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
  private static db: DBInstance = new DBInstance();
  public static get instance(): DBInstance { return this.db; }
}
