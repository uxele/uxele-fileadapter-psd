"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var psdetch_core_1 = require("psdetch-core");
var psdImgObjToCanvas_1 = require("./psdImgObjToCanvas");
var psdetch_utils_1 = require("psdetch-utils");
var cachePromise_1 = require("psdetch-utils/build/cachePromise");
var psdLayerConvert_1 = require("./psdLayerConvert");
function artboardPsd(p) {
    var tree = p.tree();
    var children = tree.children();
    var bgImg = psdImgObjToCanvas_1.psdImgObjToCanvas(p.image.obj);
    var rtn = [];
    var _loop_1 = function (c) {
        var rect;
        if (c.layer.artboard) {
            rect = psdetch_core_1.Rect.fromJson(c.layer.artboard().export().coords);
        }
        else {
            rect = psdetch_core_1.Rect.fromJson(c);
        }
        var bgPage = psdetch_utils_1.canvas.cropCanvas(bgImg, rect);
        var preview = psdetch_utils_1.canvas.canvasToImg(bgPage);
        var page = {
            name: c.name,
            offsetX: rect.left,
            offsetY: rect.top,
            width: rect.width,
            height: rect.height,
            getPreview: function (zoom) {
                return Promise.resolve(preview);
            },
            getLayers: function () {
                return cachePromise_1.cachePromise(psdLayerConvert_1.psdRawLayerConvert, c, rect);
            },
        };
        // page.layers =
        //   pageLayerMap[page.id] = c.children();
        rtn.push(page);
    };
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var c = children_1[_i];
        _loop_1(c);
    }
    return rtn;
}
exports.artboardPsd = artboardPsd;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/psdetch-fileadapter-psd/src/artboardPsd.js.map