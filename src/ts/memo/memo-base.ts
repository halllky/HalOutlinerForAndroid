import { E_MemoType, E_MemoState } from '../enums';

export default abstract class MemoBase {
  public value: string = '';
  public type: E_MemoType = E_MemoType.Text;
  public state: E_MemoState = E_MemoState.None;
  public createdTimeTick: number = Date.now();
  public children: MemoBase[] = [];

  public get createdTime(): Date { return new Date(this.createdTimeTick); }
}
