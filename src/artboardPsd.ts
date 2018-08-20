import { IPage, Rect, ILayer, layer } from "psdetch-core";
import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvas } from "psdetch-utils";
import { cachePromise } from "psdetch-utils/build/cachePromise";
import { psdRawLayerConvert } from "./psdLayerConvert";
import { canvasToImgUrl } from "psdetch-utils/build/canvas";

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
    let imgUrl:string="";
    let layers:ILayer[]|undefined=undefined;
    const page: IPage = {
      name: c.name,
      offsetX: rect.left,
      offsetY: rect.top,
      width: rect.width,
      height: rect.height,
      getPreview: async (zoom: number) => {
        if (!imgUrl){
          imgUrl=await canvasToImgUrl(bgImg);
        }
        const img=new Image(rect.width*zoom,rect.height*zoom);
        img.src=imgUrl;
        return img;
      },
      getLayers: async (): Promise<ILayer[]> => {
        if (!layers){
          layers=await psdRawLayerConvert(c,rect); 
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
