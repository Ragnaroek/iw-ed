import { Grid, Paper } from "@mui/material";
import { useSub } from "./state";
import { Texture } from "./Texture";

export const EditorDetailView = (props: any) => {
  const wasm = props.wasm;
  const { tileSelected, assets } = useSub(({ tileSelected, assets }) => ({
    tileSelected,
    assets,
  }));

  if (!tileSelected || !assets.gameDataHeaders || !assets.gameData) {
    return <div>Nothing selected</div>;
  }

  const headerVertical =
    assets.gameDataHeaders.headers[(tileSelected.tileNum - 1) * 2 + 1];
  let textureDataVertical = wasm.load_texture(assets.gameData, headerVertical);

  const headerHorizontal =
    assets.gameDataHeaders.headers[(tileSelected.tileNum - 1) * 2];
  let textureDataHorizontal = wasm.load_texture(
    assets.gameData,
    headerHorizontal
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        Tile: {tileSelected.tileNum}
      </Grid>

      <Grid container>
        <Grid container xs={2} alignItems="center">
          Vertical:
        </Grid>
        <Grid item xs={9}>
          <Texture wasm={wasm} textureData={textureDataVertical} />
        </Grid>
      </Grid>

      <Grid container>
        <Grid container xs={2} alignItems="center">
          Horizontal:
        </Grid>
        <Grid item xs={9}>
          <Texture wasm={wasm} textureData={textureDataHorizontal} />
        </Grid>
      </Grid>
    </Grid>
  );
};
