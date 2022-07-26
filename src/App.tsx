import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { Stage, Layer, Line, Rect, Text } from "react-konva";

const drawerWidth = 240;

function App(props: any) {
  const [map, setMap] = useState();

  let wasm = props.wasm;

  function onFileChange(e: any) {
    let files = e.target.files;
    let headerFile;
    let mapFile: any;

    for (let i = 0; i < e.target.files.length; i++) {
      if (files[i].name === "GAMEMAPS.WL6") {
        mapFile = files[i];
      } else if (files[i].name === "MAPHEAD.WL6") {
        headerFile = files[i];
      }
    }

    let headerReader = new FileReader();
    headerReader.onloadend = () => {
      let headerData = new Uint8Array(headerReader.result as ArrayBuffer);
      let offsets = wasm.load_map_offsets(headerData);

      let mapReader = new FileReader();
      mapReader.onloadend = () => {
        let mapData = new Uint8Array(mapReader.result as ArrayBuffer);
        let headers = wasm.load_map_headers(mapData, offsets);
        let map0 = wasm.load_map(mapData, headers, offsets, 0);
        setMap(map0);
      };
      mapReader.readAsArrayBuffer(mapFile);
    };

    headerReader.readAsArrayBuffer(headerFile);
  }

  const dim = Math.min(window.innerWidth, window.innerHeight);
  const gridWidth = dim / 64;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
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
          </List>
        </Box>
      </Drawer>

      <div>
        <Stage width={dim} height={dim}>
          <Layer>{buildGrid(gridWidth, dim)}</Layer>
          <Layer>{buildWallPlane(gridWidth, map)}</Layer>
          <Layer>{buildInfoPlane(gridWidth, map)}</Layer>
        </Stage>

        <div>
          <input type="file" onChange={onFileChange} multiple />
        </div>
      </div>
    </Box>
  );
}

function buildGrid(gridWidth: number, dim: number) {
  let result = [];
  for (let x = 0; x <= 64; x++) {
    result.push(
      <Line
        key={"x" + x}
        points={[x * gridWidth, 0, x * gridWidth, dim]}
        strokeWidth={1}
        stroke="#f2f2f2"
      />
    );
  }
  for (let y = 0; y <= 64; y++) {
    result.push(
      <Line
        key={"y" + y}
        points={[0, y * gridWidth, dim, y * gridWidth]}
        strokeWidth={1}
        stroke="#f2f2f2"
      />
    );
  }
  return result;
}

function buildInfoPlane(gridWidth: number, map: any) {
  if (!map) {
    return;
  }

  let result = [];
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      let ptr = y * 64 + x;
      let tile = map.segs[1][ptr];

      if (tile === 19 || tile === 20 || tile === 21 || tile === 22) {
        //solid wall tile
        result.push(
          <Text
            key={x + "|" + y}
            text="👨‍🦱"
            x={x * gridWidth}
            y={y * gridWidth}
            width={gridWidth}
            height={gridWidth}
            verticalAlign="middle"
            align="center"
          />
        );
      }
    }
  }
  return result;
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
      if (tile < 107) {
        //solid wall tile
        result.push(
          <Rect
            key={x + "|" + y}
            fill="gray"
            x={x * gridWidth}
            y={y * gridWidth}
            width={gridWidth}
            height={gridWidth}
          />
        );
      }
    }
  }
  return result;
}

export default App;
