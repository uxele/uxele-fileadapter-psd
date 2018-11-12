"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RAWDepresser = /** @class */ (function () {
    function RAWDepresser() {
    }
    RAWDepresser.prototype.depress = function (rawImg) {
        var channelNum = rawImg.channels();
        var rtn = [];
        for (var i = 0; i < channelNum; i++) {
            var chanData = new Uint8Array(rawImg.channelLength);
            for (var j = 0; j < rawImg.channelLength; j++) {
                chanData[j] = rawImg.file.data[rawImg.file.pos++];
            }
            rtn.push(chanData);
        }
        return rtn;
    };
    return RAWDepresser;
}());
exports.RAWDepresser = RAWDepresser;
var RLEDepresser = /** @class */ (function () {
    function RLEDepresser() {
        this.byteCountes = [];
    }
    RLEDepresser.prototype.depress = function (rawImg) {
        var channelLength = rawImg.channels();
        var height = rawImg.height();
        var rtn = [];
        this.parseByteCounts(rawImg.file, height, channelLength);
        for (var i = 0; i < channelLength; i++) {
            rtn.push(this.parseChannelData(rawImg, i));
        }
        return rtn;
    };
    RLEDepresser.prototype.parseByteCounts = function (file, height, channelLength) {
        var totalRows = height * channelLength;
        this.byteCountes = [];
        for (var i = 0; i < totalRows; i++) {
            this.byteCountes[i] = file.readShort();
        }
    };
    RLEDepresser.prototype.parseChannelData = function (rawImg, chanIdx) {
        var height = rawImg.height();
        var offset = chanIdx * height;
        var file = rawImg.file;
        var buffer = new Uint8Array(rawImg.channelLength);
        var pos = 0;
        for (var i = 0; i < height; i++) {
            var byteCount = this.byteCountes[offset + i];
            var finish = file.tell() + byteCount;
            while (file.tell() < finish) {
                var len = file.data[file.pos++];
                if (len < 128) {
                    len += 1;
                    for (var j = 0; j < len; j++) {
                        buffer[pos++] = file.data[file.pos++];
                    }
                }
                else if (len > 128) {
                    len ^= 0xff;
                    len += 2;
                    var val = file.data[file.pos++];
                    for (var j = 0; j < len; j++) {
                        buffer[pos++] = val;
                    }
                }
            }
        }
        return buffer;
    };
    return RLEDepresser;
}());
exports.RLEDepresser = RLEDepresser;
var RLELayerDepresser = /** @class */ (function (_super) {
    __extends(RLELayerDepresser, _super);
    function RLELayerDepresser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RLELayerDepresser.prototype.depress = function (rawImg) {
        var channelLength = 1;
        var height = rawImg.height();
        var rtn = [];
        this.parseByteCounts(rawImg.file, height, channelLength);
        for (var i = 0; i < channelLength; i++) {
            rtn.push(this.parseChannelData(rawImg, i));
        }
        return rtn;
    };
    RLELayerDepresser.prototype.parseByteCounts = function (file, height, channelLength) {
        var totalRows = height * channelLength;
        this.byteCountes = [];
        for (var i = 0; i < totalRows; i++) {
            this.byteCountes[i] = file.readShort();
        }
    };
    return RLELayerDepresser;
}(RLEDepresser));
exports.RLELayerDepresser = RLELayerDepresser;
var RAWLayerDepresser = /** @class */ (function (_super) {
    __extends(RAWLayerDepresser, _super);
    function RAWLayerDepresser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RAWLayerDepresser.prototype.depress = function (rawImg) {
        var rtn = [];
        rawImg.chanPos = 0;
        rawImg.channelData = new Uint8Array(rawImg.chan.length - 2);
        // rawImg.channelData=[];
        rawImg.parseRaw();
        rtn.push(rawImg.channelData);
        rawImg.chanPos = 0;
        rawImg.channelData = null;
        // const channelNum = 1;
        // const rtn = []
        // for (let i = 0; i < channelNum; i++) {
        //   const chanData = new Uint8Array(rawImg.channelLength);
        //   for (let j = 0; j < rawImg.channelLength; j++) {
        //     chanData[j] = rawImg.file.data[rawImg.file.pos++];
        //   }
        //   rtn.push(chanData);
        // }
        return rtn;
    };
    return RAWLayerDepresser;
}(RAWDepresser));
exports.RAWLayerDepresser = RAWLayerDepresser;
//# sourceMappingURL=/Users/kxiang/work/projects/psdetch/v3-new/uxele-fileadapter-psd/src/depresser.js.map