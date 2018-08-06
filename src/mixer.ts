export interface IMixer {
  mix(rawImg: any, chanData: Uint8Array[]): Uint8ClampedArray;
}

export const RGBAMix: IMixer = {
  mix(rawImg: any, chanData: Uint8Array[]): Uint8ClampedArray {
    const rgbaChannels = rawImg.channelsInfo.map((ch: any) => {
      return ch.id;
    }).filter((ch: any) => {
      return ch >= -1;
    });
    const idxR = rgbaChannels.indexOf(0);
    const idxG = rgbaChannels.indexOf(1);
    const idxB = rgbaChannels.indexOf(2);
    const idxA = rgbaChannels.indexOf(-1);
    const numPixel = rawImg.numPixels;
    const rtn = new Uint8ClampedArray(4 * numPixel);
    for (let i = 0; i < numPixel; i++) {
      const offset = i * 4;
      rtn[offset] = chanData[idxR][i];
      rtn[offset + 1] = chanData[idxG][i];
      rtn[offset + 2] = chanData[idxB][i];
      if (idxA > -1) {
        rtn[offset + 3] = chanData[idxA][i];
      } else {
        rtn[offset + 3] = 255;
      }
    }
    return rtn;
  },
};
