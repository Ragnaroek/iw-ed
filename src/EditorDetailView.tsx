import { Grid, Paper } from "@mui/material";
import { useSub } from "./state";
import { Texture } from "./Texture";

export const EditorDetailView = (props: any) => {
  const iw = props.iw;
  const { tileSelected, assets, map } = useSub(({ tileSelected, assets, map }) => ({
    tileSelected,
    assets,
    map,
  }));

  if (!tileSelected || !assets.gameDataHeaders || !assets.gameData || !map) {
    return <div>Nothing selected</div>;
  }

  let tileOffset = tileSelected.y * 64 + tileSelected.x;
  let wallTile = map.segs[0][tileOffset];
  let infoTile = map.segs[1][tileOffset];

  const headerVertical =
    assets.gameDataHeaders.headers[(wallTile - 1) * 2 + 1];
  let textureDataVertical = iw.load_texture(assets.gameData, headerVertical);

  const headerHorizontal =
    assets.gameDataHeaders.headers[(wallTile - 1) * 2];
  let textureDataHorizontal = iw.load_texture(
    assets.gameData,
    headerHorizontal
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        x: {tileSelected.x}, y: {tileSelected.y}
      </Grid>
      <Grid item xs={12}>
        Wall Tile: {wallTile}
      </Grid>
      <Grid item xs={12}>
        Info Tile: {infoTile}
      </Grid>

      <Grid container>
        <Grid container xs={2} alignItems="center">
          Vertical:
        </Grid>
        <Grid item xs={9}>
          <Texture iw={iw} textureData={textureDataVertical} />
        </Grid>
      </Grid>

      <Grid container>
        <Grid container xs={2} alignItems="center">
          Horizontal:
        </Grid>
        <Grid item xs={9}>
          <Texture iw={iw} textureData={textureDataHorizontal} />
        </Grid>
      </Grid>
    </Grid>
  );
};
