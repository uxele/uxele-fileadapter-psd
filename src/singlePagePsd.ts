import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { canvasToImg, canvasToImgUrl } from "psdetch-utils/build/canvas";
import { IPage, ILayer, layer } from "psdetch-core";
import { psdRawLayerConvert } from "./psdLayerConvert";

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
  let imgUrl="";
  return  async (zoom:number)=>{
    if (imgUrl.length>0){
      imgUrl=await canvasToImgUrl(bgCanvas);
    }
    const img=new Image(bgCanvas.width*zoom,bgCanvas.height*zoom);
    img.src=imgUrl;
    return img;
  }
}