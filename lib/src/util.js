var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    var fileLoader = new three_1.XHRLoader();
    var textureLoader = new three_1.TextureLoader();
    function loadTexture(url, onProgress) {
        return new Promise(function (resolve, reject) {
            var onLoad = function (texture) {
                resolve(texture);
            };
            var onProgressWrapper = function (progress) {
                if (onProgress) {
                    onProgress(100 * (progress.loaded / progress.total), progress.total, progress.loaded);
                }
            };
            var onError = function (error) {
                reject(error);
            };
            textureLoader.load(url, onLoad, onProgressWrapper, onError);
        });
    }
    exports.loadTexture = loadTexture;
    function loadFile(path) {
        // TODO: Remove cache buster
        var url = path; // + "?cachebuster=" + Math.random() * 9999999
        return new Promise(function (resolve, reject) {
            fileLoader.load(url, function (result) {
                resolve(result);
            }, undefined, function (error) {
                reject(error);
            });
        });
    }
    exports.loadFile = loadFile;
    function loadJSON(path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, loadFile(path).then(function (str) { return JSON.parse(str); })];
            });
        });
    }
    exports.loadJSON = loadJSON;
    function qrRange(qrRadius) {
        var coords = [];
        forEachRange(-qrRadius, qrRadius + 1, function (dx) {
            forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, function (dy) {
                var dz = -dx - dy;
                coords.push({ q: dx, r: dz });
            });
        });
        return coords;
    }
    exports.qrRange = qrRange;
    function forEachRange(min, max, f) {
        if (!max) {
            return range(0, min);
        }
        else {
            for (var i = min; i < max; i++) {
                f(i);
            }
        }
    }
    exports.forEachRange = forEachRange;
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    exports.shuffle = shuffle;
    function range(minOrMax, max) {
        if (!max) {
            return this.range(0, minOrMax);
        }
        else {
            var values = [];
            for (var i = minOrMax; i < max; i++) {
                values.push(i);
            }
            return values;
        }
    }
    exports.range = range;
    function flatMap(items, map) {
        return [].concat.apply([], items.map(map));
    }
    exports.flatMap = flatMap;
    function sum(numbers) {
        return numbers.reduce(function (sum, item) { return sum + item; }, 0);
    }
    exports.sum = sum;
    function qrEquals(a, b) {
        return a.q == b.q && a.r == b.r;
    }
    exports.qrEquals = qrEquals;
    function minBy(items, by) {
        if (items.length == 0) {
            return null;
        }
        else if (items.length == 1) {
            return items[0];
        }
        else {
            return items.reduce(function (min, cur) { return by(cur) < by(min) ? cur : min; }, items[0]);
        }
    }
    exports.minBy = minBy;
    function isInteger(value) {
        return Math.floor(value) == value;
    }
    exports.isInteger = isInteger;
    function flatten(items) {
        return [].concat.apply([], items);
    }
    exports.flatten = flatten;
});
//# sourceMappingURL=util.js.map