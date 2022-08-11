import { createStore } from "react-use-sub";

export type Assets = {
  // TODO use better types here
  mapOffsets?: any;
  mapHeaders?: any;
  mapData?: any;

  gameData?: Uint8Array;
  gameDataHeaders?: any;
};

export type TileSelection = { tileNum: number };

type State = {
  assets: Assets;
  //editor state
  map?: any; //TODO better type here => how to get better types in wasm?
  tileSelected?: TileSelection;
};
const initialState: State = {
  assets: {},
  map: undefined,
  tileSelected: undefined,
};

export const [useSub, Store] = createStore(initialState);
