"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RGBAMix = {
    mix: function (rawImg, chanData) {
        var rgbaChannels = rawImg.channelsInfo.map(function (ch) {
            return ch.id;
        }).filter(function (ch) {
            return ch >= -1;
        });
        var idxR = rgbaChannels.indexOf(0);
        var idxG = rgbaChannels.indexOf(1);
        var idxB = rgbaChannels.indexOf(2);
        var idxA = rgbaChannels.indexOf(-1);
        var numPixel = rawImg.numPixels;
        var rtn = new Uint8ClampedArray(4 * numPixel);
        for (var i = 0; i < numPixel; i++) {
            var offset = i * 4;
            rtn[offset] = chanData[idxR][i];
            rtn[offset + 1] = chanData[idxG][i];
            rtn[offset + 2] = chanData[idxB][i];
            if (idxA > -1) {
                rtn[offset + 3] = chanData[idxA][i];
            }
            else {
                rtn[offset + 3] = 255;
            }
        }
        return rtn;
    },
};
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-fileadapter-psd/src/mixer.js.map