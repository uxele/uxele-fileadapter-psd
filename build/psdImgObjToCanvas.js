"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var depresser = __importStar(require("./depresser"));
var mixer_1 = require("./mixer");
function psdImgObjToCanvas(rawImg) {
    var rtn = document.createElement("canvas");
    rtn.width = rawImg.width();
    rtn.height = rawImg.height();
    var imgData = parseImg(rawImg);
    var ctx = rtn.getContext("2d");
    if (ctx && imgData.length > 0) {
        ctx.putImageData(new ImageData(imgData, rtn.width, rtn.height), 0, 0);
    }
    return rtn;
}
exports.psdImgObjToCanvas = psdImgObjToCanvas;
function parseImg(rawImg) {
    var chanData;
    if (!rawImg.layer) { // preview img
        chanData = parsePreviewImg(rawImg);
    }
    else { // layer img
        chanData = parseLayerImg(rawImg);
    }
    var mixer = getMixer(rawImg);
    var imgData = mixer ? mixer.mix(rawImg, chanData) : new Uint8ClampedArray(0);
    return imgData;
}
function getMixer(rawImg) {
    switch (rawImg.mode()) {
        case 3:
            return mixer_1.RGBAMix;
    }
    // for any unknown mode, just return rgbamixer
    console.warn("Cannot determine Mixer.");
    return mixer_1.RGBAMix;
}
function parsePreviewImg(rawImg) {
    var startPos = rawImg.startPos;
    rawImg.file.seek(startPos);
    var compression = rawImg.file.readShort();
    var dep = getDepresser(rawImg, compression);
    return dep ? dep.depress(rawImg) : [];
}
function parseLayerImg(rawImg) {
    var startPos = rawImg.startPos;
    rawImg.file.seek(startPos);
    var chans = rawImg.channelsInfo;
    var chanData = [];
    for (var i = 0; i < chans.length; i++) {
        var chan = chans[i];
        if (chan.length <= 0) {
            rawImg.file.readShort();
            continue;
        }
        if (chan.id < -1) {
            // TODO may cause problem in case channel not in proper order.
            // e.g. mask channel is above rgba channels.
            continue;
        }
        var start = rawImg.file.tell();
        var compression = rawImg.file.readShort();
        var dep = getDepresser(rawImg, compression);
        if (compression === 0) {
            rawImg.chan = chan;
        }
        chanData.push(dep.depress(rawImg)[0]);
        var finish = rawImg.file.tell();
        if (finish !== start + chan.length) {
            rawImg.file.seek(start + chan.length);
        }
    }
    return chanData;
}
function getDepresser(rawImg, compression) {
    // TODO add zip support.
    switch (compression) {
        case 1:
            if (!rawImg.layer) {
                return new depresser.RLEDepresser();
            }
            else {
                return new depresser.RLELayerDepresser();
            }
        case 0:
            if (!rawImg.layer) {
                return new depresser.RAWDepresser();
            }
            else {
                return new depresser.RAWLayerDepresser();
            }
    }
    // for any unknown type just return rle depresser
    console.warn("Cannot determine depresser.");
    return new depresser.RLEDepresser();
}
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-fileadapter-psd/src/psdImgObjToCanvas.js.map