import { createStore } from "react-use-sub";

export type Assets = {
  // TODO use better types here
  mapOffsets?: any;
  mapHeaders?: any;
  mapData?: any;

  gameData?: any;
  gameDataHeaders?: any;
};

export type TileSelection = { tileNum: number };
export type EditorState = {
  map?: any; //TODO better type here
  tileSelected?: TileSelection;
};

type State = { assets: Assets; editorState: EditorState };
const initialState: State = { assets: {}, editorState: {} };

export const [useSub, Store] = createStore(initialState);
