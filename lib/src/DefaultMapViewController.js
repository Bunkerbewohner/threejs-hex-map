define(["require", "exports", "./coords", "three"], function (require, exports, coords_1, three_1) {
    "use strict";
    var Animation = (function () {
        /**
         * Simple animation helper
         * @param durationMs duration of the animation in milliseconds
         * @param update animation function which will receive values between 0.0 and 1.0 over the duration of the animation
         * @param easingFunction function that determines the progression of the animation over time
         */
        function Animation(durationMs, update, easingFunction) {
            if (easingFunction === void 0) { easingFunction = Animation.easeInOutQuad; }
            this.durationMs = durationMs;
            this.update = update;
            this.easingFunction = easingFunction;
            /**
             * Progress of the animation between 0.0 (start) and 1.0 (end).
             */
            this.progress = 0.0;
        }
        /**
         * Advances the animation by the given amount of time in seconds.
         * Returns true if the animation is finished.
         */
        Animation.prototype.animate = function (dtS) {
            this.progress = this.progress + dtS * 1000 / this.durationMs;
            this.update(this.easingFunction(this.progress));
            return this.progress >= 1.0;
        };
        return Animation;
    }());
    Animation.easeInOutQuad = function (t) {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t;
        return -0.5 * ((--t) * (t - 2) - 1);
    };
    Animation.easeLinear = function (t) { return t; };
    var Controller = (function () {
        function Controller() {
            var _this = this;
            this.lastDrag = null;
            this.debugText = null;
            this.selectedQR = { q: 0, r: 0 };
            this.animations = [];
            this.onAnimate = function (dtS) {
                var animations = _this.animations;
                for (var i = 0; i < animations.length; i++) {
                    // advance the animation
                    var animation = animations[i];
                    var finished = animation.animate(dtS);
                    // if the animation is finished (returned true) remove it
                    if (finished) {
                        // remove the animation
                        animations[i] = animations[animations.length - 1];
                        animations[animations.length - 1] = animation;
                        animations.pop();
                    }
                }
            };
            this.onKeyDown = function (e) {
                if (e.keyCode == 32) {
                    console.log("center view on QR(" + _this.selectedQR.q + "," + _this.selectedQR.r + ")");
                    //this.controls.focus(this.selectedQR.q, this.selectedQR.r)
                    _this.panCameraTo(_this.selectedQR, 600 /*ms*/);
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
                if (!_this.lastDrag || _this.lastDrag.length() < 0.1) {
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
        Object.defineProperty(Controller.prototype, "debugOutput", {
            set: function (elem) {
                this.debugText = elem;
            },
            enumerable: true,
            configurable: true
        });
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
            setInterval(function () { return _this.showDebugInfo(); }, 200);
            this.controls.setOnAnimateCallback(this.onAnimate);
        };
        Controller.prototype.addAnimation = function (animation) {
            this.animations.push(animation);
        };
        Controller.prototype.showDebugInfo = function () {
            if (this.debugText == null) {
                return;
            }
            var tileQR = this.selectedQR;
            var tileXYZ = coords_1.qrToWorld(tileQR.q, tileQR.r); // world space
            var camPos = this.controls.getViewCenter(); //  this.controls.getCamera().position        
            var tile = this.controls.pickTile(tileXYZ);
            this.debugText.innerHTML = "Selected Tile: QR(" + tileQR.q + ", " + tileQR.r + "), \n            XY(" + tileXYZ.x.toFixed(2) + ", " + tileXYZ.y.toFixed(2) + ")\n            &nbsp; &bull; &nbsp; Camera Looks At (Center): XYZ(" + camPos.x.toFixed(2) + ", " + camPos.y.toFixed(2) + ", " + camPos.z.toFixed(2) + ")";
        };
        Controller.prototype.panCameraTo = function (qr, durationMs) {
            var _this = this;
            var from = this.controls.getCamera().position.clone();
            var to = this.controls.getCameraFocusPosition(qr);
            this.addAnimation(new Animation(durationMs, function (a) {
                _this.controls.getCamera().position.copy(from.clone().lerp(to, a));
            }));
        };
        return Controller;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Controller;
});
//# sourceMappingURL=DefaultMapViewController.js.map