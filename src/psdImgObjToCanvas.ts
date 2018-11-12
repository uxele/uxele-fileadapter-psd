import * as depresser from "./depresser";
import { IMixer, RGBAMix } from "./mixer";
export function psdImgObjToCanvas(rawImg: any): HTMLCanvasElement {
  const rtn = document.createElement("canvas");
  rtn.width = rawImg.width();
  rtn.height = rawImg.height();
  const imgData = parseImg(rawImg);
  const ctx = rtn.getContext("2d");
  if (ctx && imgData.length>0) {
      ctx.putImageData(new ImageData(imgData, rtn.width, rtn.height), 0, 0);
   
  }

  return rtn;
}

function parseImg(rawImg: any): Uint8ClampedArray {
  let chanData: Uint8Array[];
  if (!rawImg.layer) { // preview img
    chanData = parsePreviewImg(rawImg);
  } else { // layer img
    chanData = parseLayerImg(rawImg);
  }
  const mixer = getMixer(rawImg);
  const imgData = mixer ? mixer.mix(rawImg, chanData) : new Uint8ClampedArray(0);
  return imgData;
}
function getMixer(rawImg: any): IMixer | undefined {
  switch (rawImg.mode()) {
    case 3:
      return RGBAMix;
  }
  // for any unknown mode, just return rgbamixer
  console.warn("Cannot determine Mixer.");
  return RGBAMix;
}

function parsePreviewImg(rawImg: any): Uint8Array[] {
  const startPos = rawImg.startPos;
  rawImg.file.seek(startPos);
  const compression = rawImg.file.readShort();
  const dep = getDepresser(rawImg, compression);
  return dep ? dep.depress(rawImg) : [];
}

function parseLayerImg(rawImg: any): Uint8Array[] {
  const startPos = rawImg.startPos;
  rawImg.file.seek(startPos);
  const chans: any[] = rawImg.channelsInfo;
  const chanData: Uint8Array[] = [];
  for (let i = 0; i < chans.length; i++) {
    const chan = chans[i];
    if (chan.length <= 0) {
      rawImg.file.readShort();
      continue;
    }
    if (chan.id < -1) {
      // TODO may cause problem in case channel not in proper order.
      // e.g. mask channel is above rgba channels.
      continue;
    }
    const start = rawImg.file.tell();
    const compression = rawImg.file.readShort();
    const dep = getDepresser(rawImg, compression);
    if (compression === 0) {
      rawImg.chan = chan;
    }
    chanData.push(dep.depress(rawImg)[0]);
    const finish = rawImg.file.tell();
    if (finish !== start + chan.length) {
      rawImg.file.seek(start + chan.length);
    }
  }

  return chanData;
}

function getDepresser(rawImg: any, compression: number): depresser.IDepresser {
  // TODO add zip support.
  switch (compression) {
    case 1:
      if (!rawImg.layer) {
        return new depresser.RLEDepresser();
      } else {
        return new depresser.RLELayerDepresser();
      }
    case 0:
      if (!rawImg.layer) {
        return new depresser.RAWDepresser();
      } else {
        return new depresser.RAWLayerDepresser();
      }
  }
  // for any unknown type just return rle depresser
  console.warn("Cannot determine depresser.");
  return new depresser.RLEDepresser();
}
