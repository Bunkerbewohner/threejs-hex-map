define(["require", "exports", "three", "./MapMesh", "./Grid", "./DefaultTileSelector", "./DefaultMapViewController", "./coords", "./ChunkedLazyMapMesh"], function (require, exports, three_1, MapMesh_1, Grid_1, DefaultTileSelector_1, DefaultMapViewController_1, coords_1, ChunkedLazyMapMesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = /** @class */ (function () {
        function MapView(canvasElementQuery) {
            if (canvasElementQuery === void 0) { canvasElementQuery = "canvas"; }
            var _this = this;
            this._scrollDir = new three_1.Vector3(0, 0, 0);
            this._lastTimestamp = Date.now();
            this._zoom = 25;
            this._tileGrid = new Grid_1.default(0, 0);
            this._tileSelector = DefaultTileSelector_1.default;
            this._controller = new DefaultMapViewController_1.default();
            this._onAnimate = function (dtS) { };
            this.scrollSpeed = 10;
            this.animate = function (timestamp) {
                var dtS = (timestamp - _this._lastTimestamp) / 1000.0;
                var camera = _this._camera;
                var zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM;
                var scroll = _this._scrollDir.clone().normalize().multiplyScalar(_this.scrollSpeed * zoomRelative * dtS);
                camera.position.add(scroll);
                if (_this._chunkedMesh) {
                    _this._chunkedMesh.updateVisibility(camera);
                }
                _this._onAnimate(dtS);
                _this._renderer.render(_this._scene, camera);
                requestAnimationFrame(_this.animate);
                _this._lastTimestamp = timestamp;
            };
            var canvas = this._canvas = document.querySelector(canvasElementQuery);
            var camera = this._camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
            var scene = this._scene = new three_1.Scene();
            var renderer = this._renderer = new three_1.WebGLRenderer({
                canvas: canvas,
                devicePixelRatio: window.devicePixelRatio
            });
            if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
                throw new Error("Your browser is not supported (missing extension ANGLE_instanced_arrays)");
            }
            renderer.setClearColor(0x6495ED);
            renderer.setSize(window.innerWidth, window.innerHeight);
            window.addEventListener('resize', function (e) { return _this.onWindowResize(e); }, false);
            // setup camera
            camera.rotation.x = Math.PI / 4.5;
            this.setZoom(MapView.DEFAULT_ZOOM);
            this.focus(0, 0);
            // tile selector
            this._tileSelector.position.setZ(0.1);
            this._scene.add(this._tileSelector);
            this._tileSelector.visible = true;
            // start rendering loop
            this.animate(0);
            this._controller.init(this, canvas);
        }
        Object.defineProperty(MapView.prototype, "controller", {
            get: function () {
                return this._controller;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "zoom", {
            get: function () {
                return this._zoom;
            },
            set: function (value) {
                this.setZoom(value);
            },
            enumerable: true,
            configurable: true
        });
        MapView.prototype.getZoom = function () {
            return this._zoom;
        };
        Object.defineProperty(MapView.prototype, "selectedTile", {
            get: function () {
                return this._selectedTile;
            },
            enumerable: true,
            configurable: true
        });
        MapView.prototype.getTileGrid = function () {
            return this._tileGrid;
        };
        Object.defineProperty(MapView.prototype, "mapMesh", {
            get: function () {
                return this._mapMesh;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
         */
        MapView.prototype.setZoom = function (z) {
            this._camera.updateMatrixWorld(false);
            // position the camera is currently centered at
            var lookAt = this.getViewCenter();
            // move camera along the Z axis to adjust the view distance
            this._zoom = z;
            this._camera.position.z = z;
            this._camera.updateMatrixWorld(true);
            if (lookAt != null) {
                // reposition camera so that the view center stays the same
                this._camera.position.copy(this.getCameraFocusPositionWorld(lookAt));
            }
            return this;
        };
        Object.defineProperty(MapView.prototype, "scrollDir", {
            get: function () {
                return this._scrollDir;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "onTileSelected", {
            set: function (callback) {
                this._onTileSelected = callback;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "onLoaded", {
            set: function (callback) {
                this._onLoaded = callback;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapView.prototype, "onAnimate", {
            set: function (callback) {
                if (!callback) {
                    throw new Error("Invalid onAnimate callback");
                }
                this._onAnimate = callback;
            },
            enumerable: true,
            configurable: true
        });
        MapView.prototype.setOnAnimateCallback = function (callback) {
            this.onAnimate = callback;
        };
        MapView.prototype.load = function (tiles, options) {
            var _this = this;
            this._tileGrid = tiles;
            this._selectedTile = this._tileGrid.get(0, 0);
            if ((tiles.width * tiles.height) < Math.pow(512, 2)) {
                var mesh = this._mapMesh = new MapMesh_1.default(tiles.toArray(), options); //, tiles)
                this._scene.add(this._mapMesh);
                mesh.loaded.then(function () {
                    if (_this._onLoaded)
                        _this._onLoaded();
                });
                console.info("using single MapMesh for " + (tiles.width * tiles.height) + " tiles");
            }
            else {
                var mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh_1.default(tiles, options);
                this._scene.add(this._mapMesh);
                mesh.loaded.then(function () {
                    if (_this._onLoaded)
                        _this._onLoaded();
                });
                console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles");
            }
        };
        MapView.prototype.updateTiles = function (tiles) {
            this._mapMesh.updateTiles(tiles);
        };
        MapView.prototype.getTile = function (q, r) {
            return this._mapMesh.getTile(q, r);
        };
        MapView.prototype.onWindowResize = function (event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        };
        //----- MapViewControls -----
        MapView.prototype.setScrollDir = function (x, y) {
            this._scrollDir.setX(x);
            this._scrollDir.setY(y);
            this._scrollDir.normalize();
        };
        MapView.prototype.getCamera = function () {
            return this._camera;
        };
        /**
         * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
         */
        MapView.prototype.getViewCenter = function () {
            return coords_1.mouseToWorld({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera);
        };
        MapView.prototype.getCameraFocusPosition = function (pos) {
            return this.getCameraFocusPositionWorld(coords_1.qrToWorld(pos.q, pos.r));
        };
        MapView.prototype.getCameraFocusPositionWorld = function (pos) {
            var currentPos = this._camera.position.clone();
            var viewCenter = this.getViewCenter();
            var viewOffset = currentPos.sub(viewCenter);
            return pos.add(viewOffset);
        };
        MapView.prototype.focus = function (q, r) {
            this._camera.position.copy(this.getCameraFocusPosition({ q: q, r: r }));
        };
        MapView.prototype.focusWorldPos = function (v) {
            this._camera.position.copy(this.getCameraFocusPositionWorld(v));
        };
        MapView.prototype.selectTile = function (tile) {
            var worldPos = coords_1.qrToWorld(tile.q, tile.r);
            this._tileSelector.position.set(worldPos.x, worldPos.y, 0.1);
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        };
        MapView.prototype.pickTile = function (worldPos) {
            var x = worldPos.x;
            var y = worldPos.y;
            // convert from world coordinates into fractal axial coordinates
            var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y);
            var r = 2.0 / 3 * y;
            // now need to round the fractal axial coords into integer axial coords for the grid lookup
            var cubePos = coords_1.axialToCube(q, r);
            var roundedCubePos = coords_1.roundToHex(cubePos);
            var roundedAxialPos = coords_1.cubeToAxial(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z);
            // just look up the coords in our grid
            return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r);
        };
        MapView.DEFAULT_ZOOM = 25;
        return MapView;
    }());
    exports.default = MapView;
});
//# sourceMappingURL=MapView.js.map