import MemoBase from './memo-base';
import { E_MemoType } from '../const';

export default class UrlMemo extends MemoBase {
  public type: E_MemoType = E_MemoType.Url;
  public pageTitle: string = '';
}
