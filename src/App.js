import React, { useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

function App(props) {

  const [map, setMap] = useState();

  let wasm = props.wasm;

  function onFileChange(e) {

    let files = e.target.files;
    let headerFile;
    let mapFile;

    for(let i=0;i<e.target.files.length; i++) {
      if(files[i].name === "GAMEMAPS.WL6") {
        mapFile = files[i];
      } else if(files[i].name === "MAPHEAD.WL6") {
        headerFile = files[i];
      }
    }

    let headerReader = new FileReader();    
    headerReader.onloadend = () => {      
      let headerData = new Uint8Array(headerReader.result);
      let offsets = wasm.load_map_offsets(headerData);

      let mapReader = new FileReader();
      mapReader.onloadend = () => {
        let mapData = new Uint8Array(mapReader.result);
        let headers = wasm.load_map_headers(mapData, offsets);
        let map0 = wasm.load_map(mapData, headers, offsets, 0);
        setMap(map0);
      }
      mapReader.readAsArrayBuffer(mapFile);
    };

    headerReader.readAsArrayBuffer(headerFile);  
  }

  const dim = Math.min(window.innerWidth, window.innerHeight);
  const gridWidth = dim / 64;

  console.log("rendering");

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <div>
      <Stage width={dim} height={dim}>
        <Layer>
          {buildGrid(gridWidth, dim)}
        </Layer>
        <Layer>
          {buildWallPlane(gridWidth, map)}
        </Layer>
      </Stage>
      
      <div>
        <input type="file" onChange={onFileChange} multiple />
      </div>
    </div>
  );
}

function buildGrid(gridWidth, dim) {
  let result = [];
  for(let x=0;x<=64;x++) {
    result.push(<Line key={"x"+x} points={[x*gridWidth, 0, x*gridWidth, dim]} strokeWidth={1} stroke="#f2f2f2" />);
  }
  for(let y=0;y<=64;y++) {
    result.push(<Line key={"y"+y} points={[0, y*gridWidth, dim, y*gridWidth]} strokeWidth={1} stroke="#f2f2f2" />);
  }
  return result;
}

function buildWallPlane(gridWidth, map) {
  
  if(!map) {
    return;
  }

  console.log(map.segs[0].length);

  let result = [];
  for(let y=0;y<64;y++) {
    for(let x=0;x<64;x++) {
      let ptr = y*64+x;
      let tile = map.segs[0][ptr];
      if(tile < 107) { //solid wall tile
        result.push(<Rect key={x+"|"+y} fill="gray" x={x*gridWidth} y={y*gridWidth} width={gridWidth} height={gridWidth} />);
      }
    }
  }
  console.log(result.length);
  return result;
}

export default App;
