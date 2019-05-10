const DBName = 'HalOutliner';

enum E_MemoType {
  Text,
  Url,
  Image,
}

enum E_MemoState {
  None,
  Todo,
  Cancel,
}

export {
  DBName,
  E_MemoType,
  E_MemoState,
};
