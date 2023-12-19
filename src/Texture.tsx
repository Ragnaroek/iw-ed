import { useEffect, useRef } from "react";
import { iw_start_web } from "./pkg/iw_bg.wasm";

export type TextureProps = { iw: any; textureData: any };

const TEXTURE_WIDTH = 64;
const TEXTURE_HEIGHT = 64;

export const Texture = (props: TextureProps) => {
  const iw = props.iw;

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
            const byte = texture.bytes[ix] ?? 0;
            const color = iw.gamepal_color(byte);
            pixel[ix * 4 + 0] = color.r;
            pixel[ix * 4 + 1] = color.g;
            pixel[ix * 4 + 2] = color.b;
            pixel[ix * 4 + 3] = 255;
          }
        }

        context.putImageData(imageData, 0, 0);
      }
    }
  }, [iw, props.textureData]);

  return (
    <canvas
      ref={canvasRef}
      width={TEXTURE_WIDTH}
      height={TEXTURE_HEIGHT}
    ></canvas>
  );
};
