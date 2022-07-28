import { useSub } from "./state";

export const EditorDetailView = () => {
  const { tileSelected } = useSub(({ tileSelected }) => ({ tileSelected }));
  if (!tileSelected) {
    return <div>Nothing selected</div>;
  }
  return <div>Tile: {tileSelected.tileNum}</div>;
};
