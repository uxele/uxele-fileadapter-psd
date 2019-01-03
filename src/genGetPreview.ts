import { canvasToImg, scaleCanvas } from "uxele-utils/build";

// export function genGetPreview(bgCanvas: HTMLCanvasElement) {
//   const cache: { [key: number]: HTMLImageElement } = {};
//   return async (zoom: number) => {
//     if (cache[zoom]) {
//       return cache[zoom];
//     } else {
//       cache[zoom] = await canvasToImg(scaleCanvas(bgCanvas, zoom));
//       return cache[zoom];
//     }
//   }
// }

export function genGetPreview(bgCanvas: HTMLCanvasElement) {
  const cache: { [key: number]: HTMLImageElement } = {};
  return async () => {
    const zoom = 1;
    if (cache[zoom]) {
      return cache[zoom];
    } else {
      cache[zoom] = await canvasToImg(scaleCanvas(bgCanvas, zoom));
      return cache[zoom];
    }
  }
}