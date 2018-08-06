import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvasToImg } from "psdetch-utils/build/canvas";
import { IPage, ILayer } from "psdetch-core";
import { psdRawLayerConvert } from "./psdLayerConvert";
import { cachePromise } from "psdetch-utils/build/cachePromise";

export function singlePagePsd(p: any, defaultPageName: string): IPage[] {
  const tree = p.tree();
  // const children = tree.children();
  const name = tree.name || p.name || defaultPageName;
  const bgImg = psdImgObjToCanvas(p.image.obj);
  const page: IPage = {
    name,
    width: bgImg.width,
    height: bgImg.height,
    getPreview: (zoom: number) => {
      return cachePromise(() => {
        return canvasToImg(bgImg);
      });
    },
    getLayers: (): Promise<ILayer[]> => {
      return cachePromise(psdRawLayerConvert, tree);
    },
  };
  // pageLayerMap[page.id] = children;
  return [page];
}
