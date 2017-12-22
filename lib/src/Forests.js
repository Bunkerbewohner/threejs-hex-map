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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "three", "./Grid", "./util", "./coords", "./shaders/trees.vertex", "./shaders/trees.fragment", "./map-generator"], function (require, exports, three_1, Grid_1, util_1, coords_1, trees_vertex_1, trees_fragment_1, map_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Forests = /** @class */ (function (_super) {
        __extends(Forests, _super);
        function Forests(tiles, globalGrid, options) {
            var _this = _super.call(this) || this;
            _this._forestTiles = tiles.filter(function (t) { return typeof t.treeIndex != "undefined"; })
                .map(function (t) { return (__assign({ bufferIndex: -1 }, t)); });
            _this._globalGrid = globalGrid;
            _this._options = __assign({}, options);
            _this._trees = new Trees(globalGrid, _this._forestTiles, options);
            _this.add(_this._trees);
            return _this;
        }
        Forests.prototype.updateTiles = function (tiles) {
            this._trees.updateTiles(tiles.filter(function (t) { return typeof t.treeIndex != "undefined"; }));
        };
        return Forests;
    }(three_1.Object3D));
    exports.default = Forests;
    var Trees = /** @class */ (function (_super) {
        __extends(Trees, _super);
        function Trees(globalGrid, tiles, options) {
            var _this = _super.call(this) || this;
            _this._globalGrid = globalGrid;
            _this._grid = new Grid_1.default(0, 0).init(tiles);
            _this._texture = options.spritesheet;
            _this._tiles = tiles;
            _this._options = options;
            _this.create();
            return _this;
        }
        Trees.prototype.updateTiles = function (tiles) {
            var attr = this._alphaAttr;
            for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
                var updated = tiles_1[_i];
                var old = this._grid.get(updated.q, updated.r);
                var val = updated.clouds ? 0 : 1;
                if (updated.clouds == old.clouds)
                    continue;
                for (var i = 0; i < this._options.treesPerForest; i++) {
                    attr.setZ(old.bufferIndex + i, val);
                }
                old.clouds = updated.clouds;
            }
            attr.needsUpdate = true;
        };
        Trees.prototype.create = function () {
            this._points = new three_1.Points(this.createGeometry(), this.createMaterial());
            this.add(this._points);
        };
        Trees.prototype.treeSize = function (treeIndex) {
            if (this._options.treeOptions && typeof this._options.treeOptions[treeIndex] != "undefined") {
                return (this._options.treeOptions[treeIndex].scale || 1.0) * this._options.treeSize;
            }
            else {
                return this._options.treeSize;
            }
        };
        Trees.prototype.numTreesPerForest = function (treeIndex) {
            if (this._options.treeOptions && typeof this._options.treeOptions[treeIndex] != "undefined") {
                return this._options.treeOptions[treeIndex].treesPerForest;
            }
            else {
                return this._options.treesPerForest;
            }
        };
        Trees.prototype.createGeometry = function () {
            var _this = this;
            var geometry = new three_1.BufferGeometry();
            var _a = this._options, treeSize = _a.treeSize, mapScale = _a.mapScale;
            // tree positions
            var positions = util_1.flatMap(this._tiles, function (tile, j) {
                var treesPerForest = _this.numTreesPerForest(tile.treeIndex);
                tile.bufferIndex = j * treesPerForest;
                var vs = new Array(treesPerForest);
                for (var i = 0; i < treesPerForest; i++) {
                    var tilePos = coords_1.qrToWorld(tile.q, tile.r, mapScale);
                    var localPos = map_generator_1.randomPointOnCoastTile(map_generator_1.waterAdjacency(_this._globalGrid, tile), mapScale);
                    vs[i] = tilePos.add(localPos).setZ(0.12);
                }
                return vs;
            });
            var posAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(positions);
            geometry.addAttribute("position", posAttr);
            // tree parameters
            var cols = this._options.spritesheetSubdivisions;
            var params = util_1.flatMap(this._tiles, function (tile) {
                var spriteIndex = function () { return tile.treeIndex * cols + Math.floor(Math.random() * cols); };
                var treesPerForest = _this.numTreesPerForest(tile.treeIndex);
                var treeSize = _this.treeSize(tile.treeIndex);
                var ps = new Array(treesPerForest);
                for (var i = 0; i < treesPerForest; i++) {
                    ps[i] = new three_1.Vector3(spriteIndex(), treeSize, tile.clouds ? 0.0 : 1.0);
                }
                return ps;
            });
            this._alphaAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(params);
            geometry.addAttribute("params", this._alphaAttr);
            return geometry;
        };
        Trees.prototype.createMaterial = function () {
            var _a = this._options, treeSize = _a.treeSize, mapScale = _a.mapScale, spritesheetSubdivisions = _a.spritesheetSubdivisions;
            var parameters = {
                uniforms: {
                    texture: {
                        type: "t",
                        value: this._texture
                    },
                    spritesheetSubdivisions: { type: "f", value: spritesheetSubdivisions },
                    size: {
                        type: "f",
                        value: (this._options.mapScale || 1.0) * this._options.treeSize
                    },
                    scale: { type: 'f', value: window.innerHeight / 2 },
                    alphaTest: { type: 'f', value: this._options.alphaTest }
                },
                transparent: true,
                vertexShader: trees_vertex_1.TREES_VERTEX_SHADER,
                fragmentShader: trees_fragment_1.TREES_FRAGMENT_SHADER
            };
            return new three_1.RawShaderMaterial(parameters);
        };
        return Trees;
    }(three_1.Object3D));
});
//# sourceMappingURL=Forests.js.map