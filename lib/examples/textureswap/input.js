define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    function initInput(mapView) {
        var keyActions = (_a = {},
            _a[util_1.KEY_CODES.LEFT_ARROW] = {
                down: function () { return mapView.scrollDir.x = -1; },
                up: function () { return mapView.scrollDir.x = 0; }
            },
            _a[util_1.KEY_CODES.RIGHT_ARROW] = {
                down: function () { return mapView.scrollDir.x = 1; },
                up: function () { return mapView.scrollDir.x = 0; }
            },
            _a[util_1.KEY_CODES.UP_ARROW] = {
                down: function () { return mapView.scrollDir.y = 1; },
                up: function () { return mapView.scrollDir.y = 0; }
            },
            _a[util_1.KEY_CODES.DOWN_ARROW] = {
                down: function () { return mapView.scrollDir.y = -1; },
                up: function () { return mapView.scrollDir.y = 0; }
            },
            _a[util_1.KEY_CODES.E] = {
                down: function () { return mapView.setZoom(mapView.getZoom() * 0.9); }
            },
            _a[util_1.KEY_CODES.Q] = {
                down: function () { return mapView.setZoom(mapView.getZoom() * 1.1); }
            },
            _a[util_1.KEY_CODES.G] = {
                down: function () { return mapView.mapMesh.showGrid = !mapView.mapMesh.showGrid; }
            },
            _a);
        window.addEventListener("keydown", function (event) {
            var actions = keyActions[event.keyCode];
            if (actions && "down" in actions) {
                actions["down"]();
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            var actions = keyActions[event.keyCode];
            if (actions && "up" in actions) {
                actions["up"]();
            }
        }, false);
        window.addEventListener("mousewheel", onMouseWheelHandler(mapView), false);
        window.addEventListener("DOMMouseScroll", onMouseWheelHandler(mapView), false);
        var _a;
    }
    exports.initInput = initInput;
    function onMouseWheelHandler(mapView) {
        return function (e) {
            var delta = Math.max(-1, Math.min(1, (e.wheelDeltaY || e.detail)));
            if (delta == 0)
                return;
            var zoom = Math.max(8.0, Math.min(500.0, mapView.getZoom() * (1.0 - delta * 0.025)));
            mapView.setZoom(zoom);
        };
    }
});
//# sourceMappingURL=input.js.map