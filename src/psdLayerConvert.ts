import { Rect, LayerType, ILayer, IFolderLayer, IPixelLayer, ITextLayer, IVectorLayer } from "psdetch-core";
import { psdImgObjToCanvas } from "./psdImgObjToCanvas";
import { cachePromise } from "psdetch-utils/build/cachePromise";

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
    rtn.push(layerMeta);
  }
  return rtn;
}
function buildFolderLayer(layer: ILayer, rawNode: any, pageRect?: Rect): void {
  const l = layer as IFolderLayer;
  l.children = () => {
    return cachePromise(psdRawLayerConvert, rawNode, pageRect);
  };
}
function buildPixelLayer(layer: ILayer, rawNode: any): void {
  const l = layer as IPixelLayer;
  const imgObj = rawNode.layer.image.obj;
  l.getPixelImg = () => {
    return cachePromise(() => {
      return Promise.resolve(psdImgObjToCanvas(imgObj));
    });
  };
}
function buildTextLayer(layer: ILayer, rawNode: any): void {
  const l = layer as ITextLayer;
  l.getText = () => {
    return cachePromise(() => {
      return Promise.resolve(rawNode.layer.typeTool().textValue);
    });
  };
}
function buildVectorLayer(layer: ILayer, rawNode: any): void {
  const l = layer as IVectorLayer;
  l.getSvgString = () => {
    return cachePromise(() => {
      const rl = rawNode.layer;
      if (!rl.vectorMask) {
        Promise.reject("toSvg can only render vector layer.");
      }
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
      return Promise.resolve(ctx.getSerializedSvg());
    });
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
