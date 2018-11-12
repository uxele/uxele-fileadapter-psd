"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var uxele_core_1 = require("uxele-core");
var psdImgObjToCanvas_1 = require("./psdImgObjToCanvas");
var uxele_utils_1 = require("uxele-utils");
var layer_1 = require("uxele-core/build/layer");
function psdRawLayerConvert(parent, pageRect) {
    return __awaiter(this, void 0, void 0, function () {
        var psdRawLayers, rtn, _i, psdRawLayers_1, rawNode, layerMeta;
        return __generator(this, function (_a) {
            psdRawLayers = parent.children();
            rtn = [];
            for (_i = 0, psdRawLayers_1 = psdRawLayers; _i < psdRawLayers_1.length; _i++) {
                rawNode = psdRawLayers_1[_i];
                layerMeta = {
                    name: rawNode.name,
                    rect: getRect(rawNode, pageRect),
                    visible: rawNode.visible(),
                    layerType: getLayerType(rawNode),
                };
                switch (layerMeta.layerType) {
                    case uxele_core_1.LayerType.folder:
                        buildFolderLayer(layerMeta, rawNode, pageRect);
                        break;
                    case uxele_core_1.LayerType.pixel:
                        buildPixelLayer(layerMeta, rawNode);
                        break;
                    case uxele_core_1.LayerType.text:
                        buildTextLayer(layerMeta, rawNode);
                        break;
                    case uxele_core_1.LayerType.vector:
                        buildVectorLayer(layerMeta, rawNode);
                        break;
                }
                trimLayerRect(layerMeta, rawNode);
                rtn.push(layerMeta);
            }
            return [2 /*return*/, rtn];
        });
    });
}
exports.psdRawLayerConvert = psdRawLayerConvert;
function trimLayerRect(layer, rawNode) {
    return __awaiter(this, void 0, void 0, function () {
        var preview, imgObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!layer_1.isPixelLayer(layer)) return [3 /*break*/, 2];
                    return [4 /*yield*/, layer.getPixelImg()];
                case 1:
                    preview = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!!layer_1.isFolderLayer(layer)) return [3 /*break*/, 4];
                    imgObj = rawNode.layer.image.obj;
                    return [4 /*yield*/, psdImgObjToCanvas_1.psdImgObjToCanvas(imgObj)];
                case 3:
                    preview = _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/];
                case 5:
                    layer.rect = uxele_utils_1.adjustPixelRect(layer.rect, preview);
                    return [2 /*return*/];
            }
        });
    });
}
function buildFolderLayer(layer, rawNode, pageRect) {
    var _this = this;
    var l = layer;
    var children = undefined;
    l.children = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!children) return [3 /*break*/, 2];
                    return [4 /*yield*/, psdRawLayerConvert(rawNode, pageRect)];
                case 1:
                    children = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, children];
            }
        });
    }); };
    l.childrenLength = rawNode.children().length;
}
function buildPixelLayer(layer, rawNode) {
    return __awaiter(this, void 0, void 0, function () {
        var l, imgObj, img;
        var _this = this;
        return __generator(this, function (_a) {
            l = layer;
            imgObj = rawNode.layer.image.obj;
            img = undefined;
            l.getPixelImg = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!img) return [3 /*break*/, 2];
                            return [4 /*yield*/, psdImgObjToCanvas_1.psdImgObjToCanvas(imgObj)];
                        case 1:
                            img = _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, img];
                    }
                });
            }); };
            return [2 /*return*/];
        });
    });
}
function buildTextLayer(layer, rawNode) {
    var l = layer;
    var txt = "";
    l.getText = function () {
        if (!txt) {
            txt = rawNode.layer.typeTool().textValue;
        }
        return Promise.resolve(txt);
    };
}
function buildVectorLayer(layer, rawNode) {
    var _this = this;
    var l = layer;
    var svgString = "";
    l.getSvgString = function () { return __awaiter(_this, void 0, void 0, function () {
        var rl, vm, Context, ctx, drawer, draftSvg;
        return __generator(this, function (_a) {
            if (!svgString) {
                rl = rawNode.layer;
                vm = rl.vectorMask();
                if (!vm.loaded) {
                    vm.load();
                }
                vm = vm.export();
                if (vm.disable) {
                    // TODO what to do?
                }
                Context = require("./psdSvg/canvas2svg");
                ctx = new Context(l.rect.width, l.rect.height);
                drawer = require("./psdSvg/drawPath");
                drawer(ctx, rl);
                draftSvg = ctx.getSerializedSvg();
                svgString = uxele_utils_1.centerSvgStringViewBox(draftSvg);
            }
            return [2 /*return*/, svgString];
        });
    }); };
}
function getRect(rawNode, pageRect) {
    var data = rawNode;
    if (rawNode.layer.mask && rawNode.layer.mask.disabled === false) {
        data = rawNode.layer.mask;
    }
    var rtn = new uxele_core_1.Rect(data.left, data.top, data.right, data.bottom);
    if (rawNode.clippedBy()) {
        var clippedRect = getRect(rawNode.clippedBy(), pageRect);
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
function getLayerType(rawNode) {
    if (rawNode.isRoot()) {
        return uxele_core_1.LayerType.folder;
    }
    else if (rawNode.isGroup()) {
        return uxele_core_1.LayerType.folder;
        // } else if (rawNode.isFolderEnd()) {
        //   return LayerType.folder_end;
    }
    else if (typeof rawNode.layer.vectorMask !== "undefined") {
        return uxele_core_1.LayerType.vector;
    }
    else if (typeof rawNode.layer.typeTool !== "undefined") {
        return uxele_core_1.LayerType.text;
    }
    else {
        return uxele_core_1.LayerType.pixel;
    }
}
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-fileadapter-psd/src/psdLayerConvert.js.map