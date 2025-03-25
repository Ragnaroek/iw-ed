import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import TextureIcon from "@mui/icons-material/Texture";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import { EditorDetailView } from "./EditorDetailView";
import { useSub, Store, TileSelection } from "./state";
import { Stage, Layer, Line, Rect, Text } from "react-konva";

const drawerWidth = 240;

function App(props: any) {
  //TODO Move to Editor component
  const { tileSelected, map, mapSelected, episodeSelected } = useSub(({ tileSelected, map, mapSelected, episodeSelected }) => ({
    tileSelected,
    map,
    mapSelected,
    episodeSelected,
  }));

  let iw = props.iw;

  function onFileChange(e: any) {
    let files = e.target.files;
    let headerFile: any;
    let mapFile: any;
    let gameDataFile: any;

    for (let i = 0; i < e.target.files.length; i++) {
      if (files[i].name === "GAMEMAPS.WL6") {
        mapFile = files[i];
      } else if (files[i].name === "MAPHEAD.WL6") {
        headerFile = files[i];
      } else if (files[i].name === "VSWAP.WL6") {
        gameDataFile = files[i];
      }
    }

    let headerReader = new FileReader();
    headerReader.onloadend = () => {
      let headerData = new Uint8Array(headerReader.result as ArrayBuffer);
      let offsets = iw.load_map_offsets(headerData);

      let mapReader = new FileReader();
      mapReader.onloadend = () => {
        let mapData = new Uint8Array(mapReader.result as ArrayBuffer);
        let headers = iw.load_map_headers(mapData, offsets);
        let map_loaded = iw.load_map(mapData, headers, offsets, mapSelected + episodeSelected * 10);

        Store.set(({ assets }) => {
          assets.mapOffsets = offsets;
          assets.mapHeaders = headers;
          assets.mapData = mapData;
        });

        Store.set(({ map }) => ({
          map: map_loaded,
        }));
      };
      mapReader.readAsArrayBuffer(mapFile);
    };
    headerReader.readAsArrayBuffer(headerFile);

    let gameDataReader = new FileReader();
    gameDataReader.onloadend = () => {
      let gameData = new Uint8Array(gameDataReader.result as ArrayBuffer);
      let headers = iw.load_gamedata_headers(gameData);
      Store.set(({ assets }) => {
        assets.gameData = gameData;
        assets.gameDataHeaders = headers;
      });
    };
    gameDataReader.readAsArrayBuffer(gameDataFile);
  }

  const dim = Math.min(window.innerWidth, window.innerHeight);
  const gridWidth = dim / 64;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            IW-ED
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem key={"editor"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary={"Editor"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"graphics"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ImageIcon />
                </ListItemIcon>
                <ListItemText primary={"Graphics"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"texsprites"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TextureIcon />
                </ListItemIcon>
                <ListItemText primary={"Textures/Sprites"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* TODO find a better way than marginTop to position the main elements under the nav bar*/}

      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          p: 3,
          marginTop: "60px",
        }}
      >
        <Select value={episodeSelected} onChange={selectEpisode}>
          <MenuItem value={0}>Episode 1</MenuItem>
          <MenuItem value={1}>Episode 2</MenuItem>
          <MenuItem value={2}>Episode 3</MenuItem>
          <MenuItem value={3}>Episode 4</MenuItem>
          <MenuItem value={4}>Episode 5</MenuItem>
          <MenuItem value={5}>Episode 6</MenuItem>
        </Select>
        <Select value={mapSelected} onChange={selectMap}>
          <MenuItem value={0}>M1</MenuItem>
          <MenuItem value={1}>M2</MenuItem>
          <MenuItem value={2}>M3</MenuItem>
          <MenuItem value={3}>M4</MenuItem>
          <MenuItem value={4}>M5</MenuItem>
          <MenuItem value={5}>M6</MenuItem>
          <MenuItem value={6}>M7</MenuItem>
          <MenuItem value={7}>M8</MenuItem>
          <MenuItem value={8}>M9</MenuItem>
          <MenuItem value={9}>M10</MenuItem>
        </Select>

        <Stage width={dim} height={dim}>
          <Layer>{buildGrid(gridWidth, dim)}</Layer>
          <Layer>{buildWallPlane(gridWidth, map)}</Layer>
          <Layer>{buildInfoPlane(gridWidth, map, tileSelected)}</Layer>
        </Stage>

        <div>
          <input type="file" onChange={onFileChange} multiple />
        </div>
      </Box>
      <Box sx={{ minWidth: "30%", marginTop: "80px" }}>
        <EditorDetailView iw={iw} />
      </Box>
    </Box>
  );
}

function selectEpisode(e: any, newValue: any) {
  Store.set(({ episodeSelected }) => ({
    episodeSelected: e.target.value,
  }));
}

function selectMap(e: any, newValue: any) {
  Store.set(({ mapSelected }) => ({
    mapSelected: e.target.value,
  }));
}

function buildGrid(gridWidth: number, dim: number) {
  let result = [];
  for (let x = 0; x <= 64; x++) {
    result.push(<Line key={"x" + x} points={[x * gridWidth, 0, x * gridWidth, dim]} strokeWidth={1} stroke="#f2f2f2" />);
  }
  for (let y = 0; y <= 64; y++) {
    result.push(<Line key={"y" + y} points={[0, y * gridWidth, dim, y * gridWidth]} strokeWidth={1} stroke="#f2f2f2" />);
  }
  return result;
}

function buildInfoPlane(gridWidth: number, map: any, tileSelected?: TileSelection) {
  if (!map) {
    return;
  }

  let result: any[] = [];
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      let ptr = y * 64 + x;
      let tile = map.segs[1][ptr];

      if (tileSelected && tileSelected.x === x && tileSelected.y === y) {
        result.push(<Rect x={x * gridWidth} y={y * gridWidth} width={gridWidth} height={gridWidth} fill={"yellow"} />);
      }

      // TODO use colour code for difficulty?
      if (tile === 0) {
        // ignore not set tile
      } else if (tile === 19 || tile === 20 || tile === 21 || tile === 22) {
        // player start position
        addIcon(result, "\uf007", gridWidth, x, y, tile, -(tile - 19) * 90);
      } else if (tile >= 23 && tile <= 74) {
        addIcon(result, "\uf0d8", gridWidth, x, y, tile, -(tile - 23) * 90);
      } else if (tile >= 90 && tile <= 97) {
        // direction tiles, East
        addIcon(result, "\uf061", gridWidth, x, y, tile, -(tile - 90) * 45);
      } else if (tile >= 134 && tile <= 137) {
        // dog, stand, normal
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 134) * 90);
      } else if (tile >= 138 && tile <= 141) {
        // dog, patrol, normal
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 138) * 90);
      } else if (tile >= 170 && tile <= 173) {
        // dog, stand, medium
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 170) * 90);
      } else if (tile >= 174 && tile <= 177) {
        // dog, patrol, medium
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 174) * 90);
      } else if (tile >= 206 && tile <= 209) {
        // dog, stand, hard
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 206) * 90);
      } else if (tile >= 210 && tile <= 213) {
        // dog, patrol, hard
        addIcon(result, "\uf6d3", gridWidth, x, y, tile, -(tile - 210) * 90);
      } else if (tile >= 216 && tile <= 219) {
        // mutant
        addIcon(result, "\uf780", gridWidth, x, y, tile, -(tile - 216) * 90);
      } else if (
        (tile >= 108 && tile <= 141) ||
        (tile >= 144 && tile <= 161) ||
        (tile >= 162 && tile <= 177) ||
        (tile >= 180 && tile <= 195) ||
        (tile >= 198 && tile <= 213)
      ) {
        addIcon(result, "\uf05b", gridWidth, x, y, tile);
      } else {
        console.log("!! non mapped icon: " + tile);
      }
    }
  }
  return result;
}

function addIcon(result: any[], icon: string, gridWidth: number, x: number, y: number, tile: number, rotation?: number) {
  result.push(
    <Text
      rotation={rotation}
      fontFamily="FontAwesome"
      key={x + "|" + y}
      text={icon}
      offsetX={gridWidth / 2}
      offsetY={gridWidth / 2}
      x={x * gridWidth + gridWidth / 2}
      y={y * gridWidth + gridWidth / 2}
      width={gridWidth}
      height={gridWidth}
      verticalAlign="middle"
      align="center"
      onClick={() => {
        selectTile(tile, x, y);
      }}
    />,
  );
}

function buildWallPlane(gridWidth: number, map: any) {
  if (!map) {
    return;
  }

  let result = [];
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      let ptr = y * 64 + x;
      let tile = map.segs[0][ptr];
      let fill;
      if (tile < 107) {
        //solid wall tile
        fill = "gray";
      } else {
        fill = "white";
      }

      result.push(
        <Rect
          key={x + "|" + y}
          fill={fill}
          x={x * gridWidth}
          y={y * gridWidth}
          width={gridWidth}
          height={gridWidth}
          onClick={() => selectTile(tile, x, y)}
        />,
      );
    }
  }
  return result;
}

function selectTile(tileNum: any, x: number, y: number) {
  Store.set(({ tileSelected }) => ({
    tileSelected: {
      tileNum: tileNum,
      x: x,
      y: y,
    },
  }));
}

export default App;
