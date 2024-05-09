import { createStore } from "react-use-sub";

export type Assets = {
  // TODO use better types here
  mapOffsets?: any;
  mapHeaders?: any;
  mapData?: any;

  gameData?: Uint8Array;
  gameDataHeaders?: any;
};

export type Map = {
  segs: Array<Uint16Array>, //first dimension are the planes(segs), second the map data for the plane (another Uint16Array)
}

export type TileSelection = { 
  x: number;
  y: number;
};

type State = {
  assets: Assets;
  //editor state
  mapSelected: number;
  map?: Map; 
  tileSelected?: TileSelection;
};
const initialState: State = {
  assets: {},
  mapSelected: 0,
  map: undefined,
  tileSelected: undefined,
};

export const [useSub, Store] = createStore(initialState);
