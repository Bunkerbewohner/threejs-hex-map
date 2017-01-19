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
        var _a;
    }
    exports.initInput = initInput;
});
//# sourceMappingURL=input.js.map