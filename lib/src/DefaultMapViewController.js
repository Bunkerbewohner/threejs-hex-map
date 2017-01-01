define(["require", "exports", "./coords", "three"], function (require, exports, coords_1, three_1) {
    "use strict";
    var Controller = (function () {
        function Controller() {
            var _this = this;
            this.lastDrag = new three_1.Vector3(0, 0, 0);
            this.debugText = document.getElementById("debug");
            this.selectedQR = { q: 0, r: 0 };
            this.onKeyDown = function (e) {
                if (e.keyCode == 32) {
                    console.log("center view on QR(" + _this.selectedQR.q + "," + _this.selectedQR.r + ")");
                    _this.controls.focus(_this.selectedQR.q, _this.selectedQR.r);
                }
            };
            this.onMouseDown = function (e) {
                _this.pickingCamera = _this.controls.getCamera().clone();
                _this.mouseDownPos = coords_1.screenToWorld(e.clientX, e.clientY, _this.pickingCamera);
                _this.dragStartCameraPos = _this.controls.getCamera().position.clone();
            };
            this.onMouseEnter = function (e) {
                if (e.buttons === 1) {
                    _this.onMouseDown(e);
                }
            };
            this.onMouseMove = function (e) {
                // scrolling via mouse drag
                if (_this.mouseDownPos) {
                    var mousePos = coords_1.screenToWorld(e.clientX, e.clientY, _this.pickingCamera);
                    var dv = _this.lastDrag = mousePos.sub(_this.mouseDownPos).multiplyScalar(-1);
                    var newCameraPos = dv.clone().add(_this.dragStartCameraPos);
                    _this.controls.getCamera().position.copy(newCameraPos);
                }
                // scrolling via screen edge only in fullscreen mode
                if (window.innerHeight == screen.height && !_this.mouseDownPos) {
                    var scrollZoneSize = 20;
                    var mousePos2D = new three_1.Vector2(e.clientX, e.clientY);
                    var screenCenter2D = new three_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
                    var diff = mousePos2D.clone().sub(screenCenter2D);
                    if (Math.abs(diff.x) > screenCenter2D.x - scrollZoneSize || Math.abs(diff.y) > screenCenter2D.y - scrollZoneSize) {
                        _this.controls.setScrollDir(diff.x, -diff.y);
                    }
                    else {
                        _this.controls.setScrollDir(0, 0);
                    }
                }
            };
            this.onMouseUp = function (e) {
                if (!_this.lastDrag) {
                    var mousePos = coords_1.screenToWorld(e.clientX, e.clientY, _this.controls.getCamera());
                    var tile = _this.controls.pickTile(mousePos);
                    if (tile) {
                        _this.controls.selectTile(tile);
                        _this.selectedQR = tile;
                        _this.showDebugInfo();
                    }
                }
                _this.mouseDownPos = null; // end drag
                _this.lastDrag = null;
            };
            this.onMouseOut = function (e) {
                _this.mouseDownPos = null; // end drag
                _this.controls.setScrollDir(0, 0);
            };
        }
        Controller.prototype.init = function (controls, canvas) {
            var _this = this;
            this.controls = controls;
            document.addEventListener("keydown", this.onKeyDown, false);
            canvas.addEventListener("mousedown", this.onMouseDown, false);
            canvas.addEventListener("mousemove", this.onMouseMove, false);
            canvas.addEventListener("mouseup", this.onMouseUp, false);
            canvas.addEventListener("mouseout", this.onMouseOut, false);
            canvas.addEventListener("mouseenter", this.onMouseEnter, false);
            canvas.addEventListener("touchstart", function (e) {
                _this.onMouseDown(e.touches[0]);
                e.preventDefault();
            }, false);
            canvas.addEventListener("touchmove", function (e) {
                _this.onMouseMove(e.touches[0]);
                e.preventDefault();
            }, false);
            canvas.addEventListener("touchend", function (e) { return _this.onMouseUp(e.touches[0] || e.changedTouches[0]); }, false);
            setInterval(function () { return _this.showDebugInfo(); }, 100);
        };
        Controller.prototype.showDebugInfo = function () {
            var tileQR = this.selectedQR;
            var tileXYZ = coords_1.qrToWorld(tileQR.q, tileQR.r); // world space
            var camPos = this.controls.getViewCenter(); //  this.controls.getCamera().position        
            this.debugText.innerHTML = "Selected Tile: QR(" + tileQR.q + ", " + tileQR.r + "), XY(" + tileXYZ.x.toFixed(2) + ", " + tileXYZ.y.toFixed(2) + ")\n            &nbsp; &bull; &nbsp; Camera Looks At (Center): XYZ(" + camPos.x.toFixed(2) + ", " + camPos.y.toFixed(2) + ", " + camPos.z.toFixed(2) + ")";
        };
        return Controller;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Controller;
});
//# sourceMappingURL=DefaultMapViewController.js.map