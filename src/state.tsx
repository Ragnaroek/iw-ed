import { createStore } from "react-use-sub";

export type TileSelection = { tileNum: number };

type State = { tileSelected?: TileSelection };
const initialState: State = { tileSelected: undefined };

export const [useSub, Store] = createStore(initialState);
