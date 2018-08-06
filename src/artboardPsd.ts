import { IPage, Rect, ILayer } from "psdetch-core";
import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvas } from "psdetch-utils";
import { cachePromise } from "psdetch-utils/build/cachePromise";
import { psdRawLayerConvert } from "./psdLayerConvert";

export function artboardPsd(p: any): IPage[] {
  const tree = p.tree();
  const children = tree.children();
  const bgImg = psdImgObjToCanvas(p.image.obj);
  const rtn: IPage[] = [];
  for (const c of children) {
    let rect: Rect;
    if (c.layer.artboard) {
      rect = Rect.fromJson(c.layer.artboard().export().coords);
    } else {
      rect = Rect.fromJson(c);
    }
    const bgPage = canvas.cropCanvas(bgImg, rect);
    const preview = canvas.canvasToImg(bgPage);
    const page: IPage = {
      name: c.name,
      offsetX: rect.left,
      offsetY: rect.top,
      width: rect.width,
      height: rect.height,
      getPreview: (zoom: number) => {
        return Promise.resolve(preview);
      },
      getLayers: (): Promise<ILayer[]> => {
        return cachePromise(psdRawLayerConvert, c, rect);
      },
    };
    // page.layers =
    //   pageLayerMap[page.id] = c.children();
    rtn.push(page);
  }
  return rtn;
}
