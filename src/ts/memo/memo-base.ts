import { E_MemoType, E_MemoState } from '../const';
import { TextMemo, UrlMemo } from '.';

export default abstract class MemoBase {
  public static create(type: E_MemoType, init?: MemoBase): MemoBase {
    switch (type) {
      case E_MemoType.Url: return new UrlMemo(init);
      default: return new TextMemo(init);
    }
  }

  public id?: number;
  public value: string = '';
  public type: E_MemoType = E_MemoType.Text;
  public state: E_MemoState = E_MemoState.None;
  public createdTimeTick: number = Date.now();
  public parent: MemoBase | null = null;
  public children: MemoBase[] = [];

  public get createdTime(): Date { return new Date(this.createdTimeTick); }

  constructor(init?: Partial<MemoBase>) {
    if (init === undefined) { return; }
    Object.assign(this, init);
    // initialize nested property
    if (init.children !== undefined) {
      this.children = [];
      init.children.forEach((c) => {
        const restored = MemoBase.create(c.type, c);
        restored.parent = this;
        this.children.push(restored);
      });
    }
  }

  public getRoot(): MemoBase {
    let m: MemoBase = this;
    while (m.parent !== null) { m = m.parent; }
    return m;
  }
  public addChild(child: MemoBase) {
    child.parent = this;
    this.children.push(child);
  }
  public removeChild(child: MemoBase) {
    child.parent = null;
    this.children = this.children.filter((c) => c !== child);
  }
  public find(search: (memo: MemoBase) => boolean): boolean {
    return search(this) || this.children.some((c) => c.find(search));
  }
  public toJson(): string {
    return JSON.stringify(this, (key, val) => {
      return key === 'parent' ? undefined : val;
    });
  }
}
