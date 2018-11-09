import { Rect, LayerType, ILayer, IFolderLayer, IPixelLayer, ITextLayer, IVectorLayer } from "psdetch-core";
import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import {adjustPixelRect} from "psdetch-utils";
import { isPixelLayer, isFolderLayer } from "psdetch-core/build/layer";
export async function psdRawLayerConvert(parent: any, pageRect?: Rect): Promise<ILayer[]> {
  const psdRawLayers = parent.children();
  const rtn: ILayer[] = [];
  for (const rawNode of psdRawLayers) {
    const layerMeta: ILayer = {
      name: rawNode.name,
      rect: getRect(rawNode, pageRect),
      visible: rawNode.visible(),
      layerType: getLayerType(rawNode),
    };
    switch (layerMeta.layerType) {
      case LayerType.folder:
        buildFolderLayer(layerMeta, rawNode, pageRect);
        break;

      case LayerType.pixel:
        buildPixelLayer(layerMeta, rawNode);
        break;
      case LayerType.text:
        buildTextLayer(layerMeta, rawNode);
        break;
      case LayerType.vector:
        buildVectorLayer(layerMeta, rawNode);
        break;
    }
    trimLayerRect(layerMeta,rawNode);
    rtn.push(layerMeta);
  }
  return rtn;
}
async function trimLayerRect(layer:ILayer,rawNode:any){
  let preview:HTMLCanvasElement;
  if (isPixelLayer(layer)){
    preview= await layer.getPixelImg();
  }else if (!isFolderLayer(layer)){
    const imgObj = rawNode.layer.image.obj;
    preview=await psdImgObjToCanvas(imgObj);
  }else{
    return ;
  }
  layer.rect=adjustPixelRect(layer.rect,preview);
}
function buildFolderLayer(layer: ILayer, rawNode: any, pageRect?: Rect): void {
  const l = layer as IFolderLayer;
  let children: ILayer[] | undefined = undefined;
  l.children = async () => {
    if (!children) {
      children = await psdRawLayerConvert(rawNode, pageRect);
    }
    return children;
  };
  l.childrenLength = rawNode.children().length;
}
async function buildPixelLayer(layer: ILayer, rawNode: any) {
  const l = layer as IPixelLayer;
  const imgObj = rawNode.layer.image.obj;
  let img: HTMLCanvasElement | undefined = undefined;
  l.getPixelImg = async () => {
    if (!img) {
      img = await psdImgObjToCanvas(imgObj);
    }
    return img;
  };
}
function buildTextLayer(layer: ILayer, rawNode: any): void {
  const l = layer as ITextLayer;
  let txt:string ="";
  l.getText = () => {
    if (!txt){
      txt=rawNode.layer.typeTool().textValue
    }
    return Promise.resolve(txt);
  };
}
function buildVectorLayer(layer: ILayer, rawNode: any): void {
  const l = layer as IVectorLayer;
  let svgString:string="";

  l.getSvgString = async () => {
    if (!svgString){
      const rl = rawNode.layer;
      let vm = rl.vectorMask();
      if (!vm.loaded) {
        vm.load();
      }
      vm = vm.export();
      if (vm.disable) {
        // TODO what to do?
      }
      const Context = require("./psdSvg/canvas2svg");
      const ctx = new Context(rl.width, rl.height);
      const drawer = require("./psdSvg/drawPath");
      drawer(ctx, rl);
      svgString=ctx.getSerializedSvg();
    }
    return svgString;
  };
}
function getRect(rawNode: any, pageRect?: Rect): Rect {
  let data = rawNode;
  if (rawNode.layer.mask && rawNode.layer.mask.disabled === false) {
    data = rawNode.layer.mask;
  }
  let rtn = new Rect(
    data.left,
    data.top,
    data.right,
    data.bottom,
  );
  if (rawNode.clippedBy()) {
    const clippedRect = getRect(rawNode.clippedBy(), pageRect);
    rtn = rtn.clampBy(clippedRect);
  }
  if (pageRect && typeof pageRect.left !== "undefined" && typeof pageRect.top !== "undefined") {
    rtn = rtn.pan(-pageRect.left, -pageRect.top);
    if (rtn.left < 0) {
      rtn.left = 0;
    }
    if (rtn.top < 0) {
      rtn.top = 0;
    }
  }
  return rtn;
}
function getLayerType(rawNode: any): LayerType {
  if (rawNode.isRoot()) {
    return LayerType.folder;
  } else if (rawNode.isGroup()) {
    return LayerType.folder;
    // } else if (rawNode.isFolderEnd()) {
    //   return LayerType.folder_end;
  } else if (typeof rawNode.layer.vectorMask !== "undefined") {
    return LayerType.vector;
  } else if (typeof rawNode.layer.typeTool !== "undefined") {
    return LayerType.text;
  } else {
    return LayerType.pixel;
  }
}
