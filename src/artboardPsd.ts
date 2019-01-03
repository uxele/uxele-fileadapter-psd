import { IPage, Rect, ILayer } from "uxele-core";
import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvas, canvasToImg, zoomImg } from "uxele-utils";
import { psdRawLayerConvert } from "./psdLayerConvert";
import { genGetPreview } from "./genGetPreview";

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
    let layers: ILayer[] | undefined = undefined;
    const page: IPage = {
      id:c.name,
      name: c.name,
      offsetX: rect.left,
      offsetY: rect.top,
      width: rect.width,
      height: rect.height,
      getPreview: genGetPreview(bgPage),
      getLayers: async (): Promise<ILayer[]> => {
        if (!layers) {
          layers = await psdRawLayerConvert(c, page);
        }
        return layers;
      },
    };
    // page.layers =
    //   pageLayerMap[page.id] = c.children();
    rtn.push(page);
  }
  return rtn;
}
