define(["require", "exports", "es6-promise", "three"], function (require, exports, es6_promise_1, three_1) {
    "use strict";
    var fileLoader = new three_1.XHRLoader();
    function loadFile(path) {
        var url = path + "?cachebuster=" + Math.random() * 9999999;
        return new es6_promise_1.Promise(function (resolve, reject) {
            fileLoader.load(url, function (result) {
                resolve(result);
            }, undefined, function (error) {
                reject(error);
            });
        });
    }
    exports.loadFile = loadFile;
    function qrRange(qrRadius) {
        var _this = this;
        var coords = [];
        forEachRange(-qrRadius, qrRadius + 1, function (dx) {
            forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, function (dy) {
                var dz = -dx - dy;
                coords.push({ q: _this.x + dx, r: _this.z + dz });
            });
        });
        return coords;
    }
    exports.qrRange = qrRange;
    function forEachRange(min, max, f) {
        if (!max) {
            return this.range(0, min);
        }
        else {
            for (var i = min; i < max; i++) {
                f(i);
            }
        }
    }
    exports.forEachRange = forEachRange;
});
