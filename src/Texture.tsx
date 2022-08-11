import { useEffect, useRef } from "react";

export type TextureProps = { wasm: any; textureData: any };

const TEXTURE_WIDTH = 64;
const TEXTURE_HEIGHT = 64;

export const Texture = (props: TextureProps) => {
  const wasm = props.wasm;

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = (canvas as HTMLCanvasElement).getContext("2d");
      if (context) {
        let texture = props.textureData;
        let imageData = context.getImageData(
          0,
          0,
          TEXTURE_WIDTH,
          TEXTURE_HEIGHT
        );
        let pixel = imageData.data;
        for (let x = 0; x < TEXTURE_WIDTH; x++) {
          for (let y = 0; y < TEXTURE_HEIGHT; y++) {
            const ix = 64 * y + x;
            const color = wasm.gamepal_color(texture.bytes[ix]);
            pixel[ix * 4 + 0] = color.r;
            pixel[ix * 4 + 1] = color.g;
            pixel[ix * 4 + 2] = color.b;
            pixel[ix * 4 + 3] = 255;
          }
        }

        context.putImageData(imageData, 0, 0);
      }
    }
  }, [wasm, props.textureData]);

  return (
    <canvas
      ref={canvasRef}
      width={TEXTURE_WIDTH}
      height={TEXTURE_HEIGHT}
    ></canvas>
  );
};
