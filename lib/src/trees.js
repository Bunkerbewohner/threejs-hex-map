var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "./interfaces", "./hexagon", "./coords", "./Grid"], function (require, exports, interfaces_1, hexagon_1, coords_1, Grid_1) {
    "use strict";
    var TextureLoader = THREE.TextureLoader;
    var textureLoader = new TextureLoader();
    var Trees = (function (_super) {
        __extends(Trees, _super);
        /**
         *
         * @param tiles tiles with trees to be rendered
         * @param _grid grid of all tiles
         */
        function Trees(tiles, _grid, options) {
            var _this = _super.call(this) || this;
            _this._grid = _grid;
            _this.options = options;
            _this.treeSize = 1.2;
            _this.numTreesPerForest = 50;
            _this._scale = options.scale || 1.0;
            _this.texture = options.treeTexture;
            _this.tiles = tiles.filter(function (t) { return t.trees; }).map(function (t) { return (__assign({ bufferIndex: -1 }, t)); });
            _this.localGrid = new Grid_1.default(0, 0).init(_this.tiles);
            _this.material = _this.buildMaterial();
            _this.geometry = _this.buildGeometry();
            _this.pointCloud = new THREE.Points(_this.geometry, _this.material);
            _this.add(_this.pointCloud);
            return _this;
        }
        Trees.prototype.updateTiles = function (tiles) {
            var _this = this;
            var geometry = this.geometry;
            var positions = geometry.getAttribute("position");
            var numTrees = this.numTreesPerForest;
            tiles.forEach(function (tile) {
                var old = _this.localGrid.get(tile.q, tile.r);
                if (!old)
                    return;
                if (old.clouds != tile.clouds) {
                    old.clouds = tile.clouds;
                    var value = tile.clouds ? 9999 : 0.2;
                    for (var i = 0; i < numTrees; i++) {
                        positions.setZ(old.bufferIndex + i, value);
                    }
                }
            });
            positions.needsUpdate = true;
        };
        Trees.prototype.buildMaterial = function () {
            var texture = this.texture;
            texture.minFilter = THREE.LinearFilter;
            var material = new THREE.PointsMaterial({
                map: texture,
                transparent: true,
                vertexColors: THREE.VertexColors,
                opacity: 1,
                alphaTest: 0.20,
                size: this.treeSize * this._scale * (this.options.treeSize || 1.0)
            });
            return material;
        };
        Trees.prototype.buildGeometry = function () {
            var tiles = this.tiles;
            var numWoods = tiles.length;
            var treesPerWood = this.numTreesPerForest;
            var spread = 1.5;
            var halfSpread = spread / 2;
            var geometry = new THREE.BufferGeometry();
            var treePositions = new Float32Array(treesPerWood * numWoods * 3);
            var treeColors = new Float32Array(treesPerWood * numWoods * 3);
            var vertexIndex = 0;
            var numTreesLeft = function () { return treePositions.length - vertexIndex; };
            var actualNumTrees = 0;
            var bufferIndex = 0;
            // iterate from back to front to get automatic sorting by z-depth
            for (var i = tiles.length - 1; i >= 0; i--) {
                var tile = tiles[i];
                var x = coords_1.qrToWorldX(tile.q, tile.r, this._scale);
                var y = coords_1.qrToWorldY(tile.q, tile.r, this._scale);
                var z = tile.clouds ? 9999 : 0.1;
                var numTrees = treesPerWood;
                var baseColor = this.getTreeColor(tile);
                var positions = new Array(numTrees);
                var colors = new Array(numTrees);
                var waterAdjacency = this.waterAdjacency(this._grid, tile);
                tile.bufferIndex = bufferIndex;
                // generate random tree points on this tile
                for (var t = 0; t < numTrees; t++) {
                    var point = this.randomPointOnTile(waterAdjacency);
                    point.setZ(0.1);
                    positions[t] = point;
                    colors[t] = this.varyColor(baseColor);
                }
                // sort by Y,Z
                positions.sort(function (a, b) {
                    var diff = b.y - a.y;
                    if (Math.abs(diff) < 0.1)
                        return b.z - a.z;
                    else
                        return diff;
                });
                // add the vertices for this tile
                for (var t = 0; t < positions.length; t++) {
                    treePositions[vertexIndex + 0] = x + positions[t].x;
                    treePositions[vertexIndex + 1] = y + positions[t].y;
                    treePositions[vertexIndex + 2] = z + positions[t].z;
                    treeColors[vertexIndex + 0] = colors[t][0];
                    treeColors[vertexIndex + 1] = colors[t][1];
                    treeColors[vertexIndex + 2] = colors[t][2];
                    vertexIndex += 3;
                }
                bufferIndex += positions.length;
                actualNumTrees += positions.length;
            }
            geometry.addAttribute("position", new THREE.BufferAttribute(treePositions, 3));
            geometry.addAttribute("color", new THREE.BufferAttribute(treeColors, 3));
            return geometry;
        };
        Trees.prototype.randomPointOnTile = function (water) {
            return hexagon_1.randomPointInHexagonEx(this._scale, function (corner) {
                corner = (2 + (6 - corner)) % 6;
                if (corner == 0 && water.NE)
                    return 0.5;
                if (corner == 1 && water.E)
                    return 0.5;
                if (corner == 2 && water.SE)
                    return 0.5;
                if (corner == 3 && water.SW)
                    return 0.5;
                if (corner == 4 && water.W)
                    return 0.5;
                if (corner == 5 && water.NW)
                    return 0.5;
                return 1;
            });
        };
        // add slight variation to color
        Trees.prototype.varyColor = function (color) {
            var vary = Math.random() > 0.5;
            var variance = 0.5;
            return [
                vary ? (1 - variance / 2 + Math.random() * variance) * color[0] : color[0],
                vary ? (1 - variance / 2 + Math.random() * variance) * color[1] : color[1],
                vary ? (1 - variance / 2 + Math.random() * variance) * color[2] : color[2]
            ];
        };
        Trees.prototype.getTreeColor = function (tile) {
            // base color
            var color = [1, 1, 1]; // default forest color
            if (tile.terrain == "plains") {
                color = [1, 1, 0.2]; // yellowish for plains
            }
            else if (tile.terrain == "jungle") {
                color = [0.4, 0.7, 0.4]; // dark green for jungle
            }
            return color;
        };
        Trees.prototype.getNumTrees = function (tile) {
            return this.numTreesPerForest;
        };
        Trees.prototype.waterAdjacency = function (grid, tile) {
            function isWaterTile(q, r) {
                var t = grid.get(q, r);
                if (!t)
                    return false;
                return interfaces_1.isWater(t.height);
            }
            return {
                NE: isWaterTile(tile.q + 1, tile.r - 1),
                E: isWaterTile(tile.q + 1, tile.r),
                SE: isWaterTile(tile.q, tile.r + 1),
                SW: isWaterTile(tile.q - 1, tile.r + 1),
                W: isWaterTile(tile.q - 1, tile.r),
                NW: isWaterTile(tile.q, tile.r - 1)
            };
        };
        return Trees;
    }(THREE.Object3D));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Trees;
});
//# sourceMappingURL=trees.js.map