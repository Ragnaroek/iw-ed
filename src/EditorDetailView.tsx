import { useSub } from "./state";

export const EditorDetailView = () => {
  const { editorState } = useSub(({ editorState }) => ({ editorState }));
  if (!editorState.tileSelected) {
    return <div>Nothing selected</div>;
  }
  return <div>Tile: {editorState.tileSelected.tileNum}</div>;
};
