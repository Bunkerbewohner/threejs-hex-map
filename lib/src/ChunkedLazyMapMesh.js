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
define(["require", "exports", "three", "./QuadTree", "./coords", "./MapMesh", "./BoundingBox", "./util"], function (require, exports, three_1, QuadTree_1, coords_1, MapMesh_1, BoundingBox_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChunkedLazyMapMesh = /** @class */ (function (_super) {
        __extends(ChunkedLazyMapMesh, _super);
        function ChunkedLazyMapMesh(tileGrid, options) {
            var _this = _super.call(this) || this;
            _this.tileGrid = tileGrid;
            _this.options = options;
            _this.thunks = [];
            // we're gonna handle frustrum culling ourselves
            _this.frustumCulled = false;
            // calculate size of map chunks so that there are at least 4 or each chunk contains 32^2 tiles
            var chunkSize = Math.min((tileGrid.width * tileGrid.height) / 4, Math.pow(32, 2));
            var chunkWidth = Math.ceil(Math.sqrt(chunkSize));
            var numChunksX = Math.ceil(tileGrid.width / chunkWidth);
            var numChunksY = Math.ceil(tileGrid.height / chunkWidth);
            var chunks = util_1.range(numChunksX).map(function (x) { return util_1.range(numChunksY).map(function (_) { return []; }); });
            // assign tiles to cells in the coarser chunk grid
            tileGrid.forEachIJ(function (i, j, q, r, tile) {
                var bx = Math.floor((i / tileGrid.width) * numChunksX);
                var by = Math.floor((j / tileGrid.height) * numChunksY);
                chunks[bx][by].push(tile);
            });
            var promises = [];
            // create a thunk for each chunk
            chunks.forEach(function (row, x) {
                row.forEach(function (tiles, y) {
                    var thunk = new MapThunk(tiles, tileGrid, options);
                    _this.thunks.push(thunk);
                    promises.push(thunk.loaded);
                    thunk.load(); // preload
                    _this.add(thunk);
                });
            });
            _this.loaded = Promise.all(promises).then(function () { return null; });
            _this.quadtree = new QuadTree_1.default(_this.thunks, 1, function (thunk) { return thunk.computeCenter(); });
            return _this;
        }
        Object.defineProperty(ChunkedLazyMapMesh.prototype, "numChunks", {
            get: function () {
                return this.thunks.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adjusts visibility of chunks so that only map parts that can actually be seen by the camera are rendered.
         * @param camera the camera to use for visibility checks
         */
        ChunkedLazyMapMesh.prototype.updateVisibility = function (camera) {
            var min = coords_1.screenToWorld(0, 0, camera);
            var max = coords_1.screenToWorld(window.innerWidth, window.innerHeight, camera);
            var center = new three_1.Vector3().addVectors(min, max).multiplyScalar(0.5);
            var size = Math.max(max.x - min.x, max.y - min.y);
            var boundingBox = new BoundingBox_1.BoundingBox(new three_1.Vector2(center.x, center.y), size * 2);
            this.thunks.forEach(function (thunk) { return thunk.updateVisibility(false); });
            this.quadtree.queryRange(boundingBox).forEach(function (thunk) { return thunk.updateVisibility(true); });
        };
        ChunkedLazyMapMesh.prototype.updateTiles = function (tiles) {
            this.thunks.forEach(function (thunk) { return thunk.updateTiles(tiles); });
        };
        ChunkedLazyMapMesh.prototype.getTile = function (q, r) {
            var xy = coords_1.qrToWorld(q, r);
            var queryBounds = new BoundingBox_1.BoundingBox(xy, 1);
            var thunks = this.quadtree.queryRange(queryBounds);
            for (var _i = 0, thunks_1 = thunks; _i < thunks_1.length; _i++) {
                var thunk = thunks_1[_i];
                var tile = thunk.getTile(q, r);
                if (tile) {
                    return tile;
                }
            }
            return null;
        };
        return ChunkedLazyMapMesh;
    }(three_1.Object3D));
    exports.default = ChunkedLazyMapMesh;
    var MapThunk = /** @class */ (function (_super) {
        __extends(MapThunk, _super);
        function MapThunk(tiles, grid, options) {
            var _this = _super.call(this) || this;
            _this.tiles = tiles;
            _this.grid = grid;
            _this.options = options;
            _this._loaded = false;
            _this.loaded = new Promise(function (resolve, reject) {
                _this.resolve = resolve;
            });
            _this.frustumCulled = false;
            return _this;
        }
        MapThunk.prototype.getTiles = function () {
            return this.tiles;
        };
        MapThunk.prototype.getTile = function (q, r) {
            return this.mesh.getTile(q, r);
        };
        MapThunk.prototype.computeCenter = function () {
            var sphere = new three_1.Sphere();
            sphere.setFromPoints(this.tiles.map(function (tile) { return new three_1.Vector3(coords_1.qrToWorldX(tile.q, tile.r), coords_1.qrToWorldY(tile.q, tile.r)); }));
            return new three_1.Vector2(sphere.center.x, sphere.center.y);
        };
        MapThunk.prototype.updateTiles = function (tiles) {
            if (!this.mesh) {
                this.load();
            }
            this.mesh.updateTiles(tiles);
        };
        MapThunk.prototype.load = function () {
            if (!this._loaded) {
                this._loaded = true;
                var mesh = this.mesh = new MapMesh_1.default(this.tiles, this.options, this.grid);
                mesh.frustumCulled = false;
                this.add(mesh);
                this.resolve();
            }
        };
        MapThunk.prototype.updateVisibility = function (value) {
            if (value && !this._loaded) {
                this.load();
            }
            this.visible = value;
        };
        return MapThunk;
    }(three_1.Object3D));
});
//# sourceMappingURL=ChunkedLazyMapMesh.js.map