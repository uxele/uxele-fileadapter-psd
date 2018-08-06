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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var PSDAdapter_1 = require("./PSDAdapter");
var loadRemoteFile_1 = require("psdetch-utils/build/loadRemoteFile");
describe("PSDAdapter", function () {
    var adapter = new PSDAdapter_1.PSDAdapter();
    it("should match with psd file", function () {
        expect(adapter.checkFileMeta({
            name: "file.psd",
            mime: "",
        })).toBe(true);
    });
    describe("\"PSD File: \"base/testAssets/concept.psd\"", function () {
        function decodeProject() {
            return __awaiter(this, void 0, void 0, function () {
                var f, project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadRemoteFile_1.loadRemoteFile({ url: "base/testAssets/concept.psd" }).toPromise()];
                        case 1:
                            f = _a.sent();
                            if (!f) return [3 /*break*/, 3];
                            return [4 /*yield*/, adapter.decodeProject(f)];
                        case 2:
                            project = _a.sent();
                            return [2 /*return*/, project];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        function getPages() {
            return __awaiter(this, void 0, void 0, function () {
                var project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, decodeProject()];
                        case 1:
                            project = _a.sent();
                            if (project) {
                                return [2 /*return*/, project.getPages()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        function getLayers() {
            return __awaiter(this, void 0, void 0, function () {
                var pages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getPages()];
                        case 1:
                            pages = _a.sent();
                            if (pages) {
                                return [2 /*return*/, pages[0].getLayers()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        it("should decode a psd file", function () { return __awaiter(_this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, decodeProject()];
                    case 1:
                        project = _a.sent();
                        if (project) {
                            expect(project.name).toEqual("concept.psd");
                        }
                        else {
                            fail("Project is undefiend");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it("should get pages from a project", function () { return __awaiter(_this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (page) {
                            expect(page.length).toEqual(1);
                            expect(page[0].name).toBe("concept.psd");
                            expect(page[0].width).toBe(1024);
                            expect(page[0].height).toBe(768);
                        }
                        else {
                            fail("Page returned as undefined");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it("should get preview", function () { return __awaiter(_this, void 0, void 0, function () {
            var page, img;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (!page) return [3 /*break*/, 3];
                        return [4 /*yield*/, page[0].getPreview(1)];
                    case 2:
                        img = _a.sent();
                        expect(img).toBeDefined();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("should get layers", function () { return __awaiter(_this, void 0, void 0, function () {
            var page, layers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (!page) return [3 /*break*/, 3];
                        return [4 /*yield*/, page[0].getLayers()];
                    case 2:
                        layers = _a.sent();
                        expect(layers.length).toBe(9);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("should get img from pixel layers", function () { return __awaiter(_this, void 0, void 0, function () {
            var layers, pixelLayer, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getLayers()];
                    case 1:
                        layers = _b.sent();
                        if (!layers) return [3 /*break*/, 3];
                        pixelLayer = layers[7];
                        _a = expect;
                        return [4 /*yield*/, pixelLayer.getPixelImg()];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).toBeDefined();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("should get svgString from vector layers", function () { return __awaiter(_this, void 0, void 0, function () {
            var layers, vectorLayer, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, getLayers()];
                    case 1:
                        layers = _b.sent();
                        if (!layers) return [3 /*break*/, 4];
                        return [4 /*yield*/, layers[5].children()];
                    case 2:
                        vectorLayer = (_b.sent())[0];
                        _a = expect;
                        return [4 /*yield*/, vectorLayer.getSvgString()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]).toBeDefined();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    describe("\"PSD File: \"base/testAssets/login.psd\"", function () {
        function decodeProject() {
            return __awaiter(this, void 0, void 0, function () {
                var f, project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadRemoteFile_1.loadRemoteFile({ url: "base/testAssets/login.psd" }).toPromise()];
                        case 1:
                            f = _a.sent();
                            if (!f) return [3 /*break*/, 3];
                            return [4 /*yield*/, adapter.decodeProject(f)];
                        case 2:
                            project = _a.sent();
                            return [2 /*return*/, project];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        function getPages() {
            return __awaiter(this, void 0, void 0, function () {
                var project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, decodeProject()];
                        case 1:
                            project = _a.sent();
                            if (project) {
                                return [2 /*return*/, project.getPages()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        function getLayers() {
            return __awaiter(this, void 0, void 0, function () {
                var pages;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getPages()];
                        case 1:
                            pages = _a.sent();
                            if (pages) {
                                return [2 /*return*/, pages[0].getLayers()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        it("should decode a psd file", function () { return __awaiter(_this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, decodeProject()];
                    case 1:
                        project = _a.sent();
                        if (project) {
                            expect(project.name).toEqual("login.psd");
                        }
                        else {
                            fail("Project is undefiend");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it("should get pages from a project", function () { return __awaiter(_this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (page) {
                            expect(page.length).toEqual(2);
                            expect(page[0].name).toBe("Input");
                            expect(page[0].width).toBe(1440);
                            expect(page[0].height).toBe(2560);
                        }
                        else {
                            fail("Page returned as undefined");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        it("should get preview", function () { return __awaiter(_this, void 0, void 0, function () {
            var page, img;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (!page) return [3 /*break*/, 3];
                        return [4 /*yield*/, page[0].getPreview(1)];
                    case 2:
                        img = _a.sent();
                        expect(img).toBeDefined();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it("should get layers", function () { return __awaiter(_this, void 0, void 0, function () {
            var page, layers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPages()];
                    case 1:
                        page = _a.sent();
                        if (!page) return [3 /*break*/, 3];
                        return [4 /*yield*/, page[0].getLayers()];
                    case 2:
                        layers = _a.sent();
                        expect(layers.length).toBe(10);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/psdetch-fileadapter-psd/src/PSDAdapter.spec.js.map