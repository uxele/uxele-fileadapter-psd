import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvasToImg, canvasToImgUrl, zoomImg, scaleCanvas } from "uxele-utils/build/canvas";
import { IPage, ILayer } from "uxele-core";
import { psdRawLayerConvert } from "./psdLayerConvert";
import { genGetPreview } from "./genGetPreview";

export function singlePagePsd(p: any, defaultPageName: string): IPage[] {
  const tree = p.tree();
  // const children = tree.children();
  const name = tree.name || p.name || defaultPageName;
  const bgImg = psdImgObjToCanvas(p.image.obj);
  let layers: ILayer[] | undefined = undefined;
  const page: IPage = {
    id:name,
    name,
    width: bgImg.width,
    height: bgImg.height,
    getPreview: genGetPreview(bgImg),
    getLayers: async (): Promise<ILayer[]> => {
      if (!layers) {
        layers = await psdRawLayerConvert(tree,page);
      }
      return layers;
    },
  };
  return [page];
}
