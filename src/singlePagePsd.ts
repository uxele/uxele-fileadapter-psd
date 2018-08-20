import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvasToImg, canvasToImgUrl } from "psdetch-utils/build/canvas";
import { IPage, ILayer, layer } from "psdetch-core";
import { psdRawLayerConvert } from "./psdLayerConvert";
import { zoomImg } from "psdetch-utils/build/canvas";

export function singlePagePsd(p: any, defaultPageName: string): IPage[] {
  const tree = p.tree();
  // const children = tree.children();
  const name = tree.name || p.name || defaultPageName;
  const bgImg = psdImgObjToCanvas(p.image.obj);
  let layers:ILayer[] | undefined=undefined;
  const page: IPage = {
    name,
    width: bgImg.width,
    height: bgImg.height,
    getPreview:genGetPreview(bgImg),
    getLayers: async (): Promise<ILayer[]> => {
      if (!layers){
        layers=await psdRawLayerConvert(tree);
      }
      return layers;
    },
  };
  return [page];
}
function genGetPreview(bgCanvas:HTMLCanvasElement){
  let previewImg:HTMLImageElement | undefined=undefined;
  return  async (zoom:number)=>{
    if (!previewImg){
      previewImg=await canvasToImg(bgCanvas);
    }
    if (zoom === 1){
      return previewImg;
    }else{
      return zoomImg(previewImg,zoom);
    }
  }
}