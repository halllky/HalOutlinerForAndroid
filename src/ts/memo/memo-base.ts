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
  public children: MemoBase[] = [];

  public get createdTime(): Date { return new Date(this.createdTimeTick); }

  constructor(init?: Partial<MemoBase>) {
    if (init === undefined) { return; }
    Object.assign(this, init);
    // initialize nested property
    if (init.children !== undefined) {
      this.children = [];
      init.children.forEach((c) => this.children.push(MemoBase.create(c.type, c)));
    }
  }
}
