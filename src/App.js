import { Stage, Layer, Line } from 'react-konva';

function App(props) {

  let wasm = props.wasm;

  function onFileChange(e) {
    let reader = new FileReader();
    reader.onloadend = () => {
      
      //let v = new Uint8Array(reader.result);

      let r = wasm.load_map_offsets(reader.result);
      console.log(r);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }

  const dim = Math.min(window.innerWidth, window.innerHeight);
  const gridWidth = dim / 64;

  function buildGrid() {
    let result = [];
    for(let x=0;x<=64;x++) {
      result.push(<Line points={[x*gridWidth, 0, x*gridWidth, dim]} strokeWidth={1} stroke="black" />);
    }
    for(let y=0;y<=64;y++) {
      result.push(<Line points={[0, y*gridWidth, dim, y*gridWidth]} strokeWidth={1} stroke="black" />);
    }
    return result;
  }

  return (
    // Stage - is a div wrapper
    // Layer - is an actual 2d canvas element, so you can have several layers inside the stage
    // Rect and Circle are not DOM elements. They are 2d shapes on canvas
    <div>
      <Stage width={dim} height={dim}>
        <Layer>
          {buildGrid()}
        </Layer>
      </Stage>
      
      <div>
        <input type="file" onChange={onFileChange} multiple />
      </div>
    </div>
  );
}  

export default App;
