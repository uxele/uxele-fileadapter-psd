"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var psdImgObjToCanvas_1 = require("./psdImgObjToCanvas");
var canvas_1 = require("psdetch-utils/build/canvas");
var psdLayerConvert_1 = require("./psdLayerConvert");
var cachePromise_1 = require("psdetch-utils/build/cachePromise");
function singlePagePsd(p, defaultPageName) {
    var tree = p.tree();
    // const children = tree.children();
    var name = tree.name || p.name || defaultPageName;
    var bgImg = psdImgObjToCanvas_1.psdImgObjToCanvas(p.image.obj);
    var page = {
        name: name,
        width: bgImg.width,
        height: bgImg.height,
        getPreview: function (zoom) {
            return cachePromise_1.cachePromise(function () {
                return canvas_1.canvasToImg(bgImg);
            });
        },
        getLayers: function () {
            return cachePromise_1.cachePromise(psdLayerConvert_1.psdRawLayerConvert, tree);
        },
    };
    // pageLayerMap[page.id] = children;
    return [page];
}
exports.singlePagePsd = singlePagePsd;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/psdetch-fileadapter-psd/src/singlePagePsd.js.map