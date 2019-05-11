const DBName = 'HalOutliner';
const DBNameForTest = 'HalOutlinerTest';

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
  DBNameForTest,
  E_MemoType,
  E_MemoState,
};
