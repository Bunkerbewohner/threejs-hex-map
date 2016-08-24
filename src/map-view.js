define(["require", "exports", "./camera-utils"], function (require, exports, camera_utils_1) {
    "use strict";
    var MapView = (function () {
        function MapView(map) {
            this._zoom = 1;
            this._map = map;
        }
        MapView.prototype.render = function (camera) {
            var frustrumMin = camera_utils_1.screenToWorld(0, 0, camera);
            var frustrumMax = camera_utils_1.screenToWorld(window.innerWidth, window.innerHeight, camera);
        };
        return MapView;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapView;
});
