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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "./interfaces", "./hexagon", "three", "./coords", "./Grid", "./shaders/land.fragment", "./shaders/land.vertex", "./shaders/mountains.fragment", "./shaders/mountains.vertex", "./Forests"], function (require, exports, interfaces_1, hexagon_1, three_1, coords_1, Grid_1, land_fragment_1, land_vertex_1, mountains_fragment_1, mountains_vertex_1, Forests_1) {
    "use strict";
    var MapMesh = (function (_super) {
        __extends(MapMesh, _super);
        /**
         * @param tiles the tiles to actually render in this mesh
         * @param globalGrid the grid with all tiles, including the ones that are not rendered in this mesh
         * @param options map mesh configuration options
         */
        function MapMesh(tiles, options, globalGrid) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this._showGrid = true;
            // use default shaders if none are provided
            if (!options.landFragmentShader) {
                options.landFragmentShader = land_fragment_1.LAND_FRAGMENT_SHADER;
            }
            if (!options.landVertexShader) {
                options.landVertexShader = land_vertex_1.LAND_VERTEX_SHADER;
            }
            if (!options.mountainsFragmentShader) {
                options.mountainsFragmentShader = mountains_fragment_1.MOUNTAINS_FRAGMENT_SHADER;
            }
            if (!options.mountainsVertexShader) {
                options.mountainsVertexShader = mountains_vertex_1.MOUNTAINS_VERTEX_SHADER;
            }
            // local, extended copy of tile data
            _this.tiles = tiles.map(function (t) { return (__assign({ bufferIndex: -1, isMountain: interfaces_1.isMountain(t.height) }, t)); });
            _this.localGrid = new Grid_1.default(0, 0).init(_this.tiles);
            _this.globalGrid = globalGrid || _this.localGrid;
            options.hillsNormalTexture.wrapS = options.hillsNormalTexture.wrapT = three_1.RepeatWrapping;
            options.terrainAtlasTexture.wrapS = options.terrainAtlasTexture.wrapT = three_1.RepeatWrapping;
            options.undiscoveredTexture.wrapS = options.undiscoveredTexture.wrapT = three_1.RepeatWrapping;
            //options.transitionTexture.flipY = true
            _this.loaded = Promise.all([
                _this.createLandMesh(_this.tiles.filter(function (t) { return !t.isMountain; })),
                _this.createMountainMesh(_this.tiles.filter(function (t) { return t.isMountain; })),
                _this.createTrees()
            ]).catch(function (err) {
                console.error("Could not create MapMesh", err);
            });
            return _this;
        }
        Object.defineProperty(MapMesh.prototype, "showGrid", {
            get: function () {
                return this._showGrid;
            },
            set: function (value) {
                this._showGrid = value;
                var landMaterial = this.land.material;
                landMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0;
                var mountainMaterial = this.mountains.material;
                mountainMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * "Hot-swaps" the given textures.
         * @param textures
         */
        MapMesh.prototype.replaceTextures = function (textures) {
            for (var name_1 in textures) {
                var replacement = textures[name_1];
                if (replacement) {
                    var old = this.options[name_1];
                    var wrapT = old.wrapT, wrapS = old.wrapS;
                    old.copy(replacement);
                    old.wrapT = wrapT;
                    old.wrapS = wrapS;
                    old.needsUpdate = true;
                }
            }
        };
        MapMesh.prototype.updateTiles = function (tiles) {
            this.updateFogAndClouds(tiles);
            this.trees.updateTiles(tiles);
        };
        MapMesh.prototype.getTile = function (q, r) {
            return this.localGrid.get(q, r);
        };
        /**
         * Updates only fog and clouds visualization of existing tiles.
         * @param tiles changed tiles
         */
        MapMesh.prototype.updateFogAndClouds = function (tiles) {
            var _this = this;
            var landGeometry = this.land.geometry;
            var landStyleAttr = landGeometry.getAttribute("style");
            var mountainsGeometry = this.mountains.geometry;
            var mountainsStyleAttr = mountainsGeometry.getAttribute("style");
            tiles.forEach(function (updated) {
                var old = _this.localGrid.get(updated.q, updated.r);
                if (!old)
                    return;
                if (updated.fog != old.fog || updated.clouds != old.clouds) {
                    old.fog = updated.fog;
                    old.clouds = updated.clouds;
                    var attribute = old.isMountain ? mountainsStyleAttr : landStyleAttr;
                    _this.updateFogStyle(attribute, old.bufferIndex, updated.fog, updated.clouds);
                }
            });
            landStyleAttr.needsUpdate = true;
            mountainsStyleAttr.needsUpdate = true;
        };
        MapMesh.prototype.updateFogStyle = function (attr, index, fog, clouds) {
            var style = attr.getY(index);
            var fogMask = 1;
            var newStyle = fog ? (style | fogMask) : (style & ~fogMask);
            var withClouds = !clouds ? newStyle % 100 : 100 + newStyle;
            attr.setY(index, withClouds);
        };
        MapMesh.prototype.createTrees = function () {
            return __awaiter(this, void 0, void 0, function () {
                var trees;
                return __generator(this, function (_a) {
                    trees = this.trees = new Forests_1.default(this.tiles, this.globalGrid, {
                        treeSize: this.options.treeSize || 1.44,
                        spritesheet: this.options.treeSpritesheet,
                        spritesheetSubdivisions: this.options.treeSpritesheetSubdivisions,
                        treesPerForest: this.options.treesPerForest || 50,
                        mapScale: this.options.scale || 1.0,
                        alphaTest: this.options.treeAlphaTest || 0.2
                    });
                    this.add(trees);
                    return [2 /*return*/];
                });
            });
        };
        MapMesh.prototype.createLandMesh = function (tiles) {
            return __awaiter(this, void 0, void 0, function () {
                var atlas, geometry, material;
                return __generator(this, function (_a) {
                    atlas = this.options.terrainAtlas;
                    geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 0, this.options);
                    material = new three_1.RawShaderMaterial({
                        uniforms: {
                            sineTime: { value: 0.0 },
                            showGrid: { value: this._showGrid ? 1.0 : 0.0 },
                            camera: { type: "v3", value: new three_1.Vector3(0, 0, 0) },
                            texture: { type: "t", value: this.options.terrainAtlasTexture },
                            textureAtlasMeta: {
                                type: "4f",
                                value: new three_1.Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                            },
                            hillsNormal: {
                                type: "t",
                                value: this.options.hillsNormalTexture
                            },
                            coastAtlas: {
                                type: "t",
                                value: this.options.coastAtlasTexture
                            },
                            riverAtlas: {
                                type: "t",
                                value: this.options.riverAtlasTexture
                            },
                            mapTexture: {
                                type: "t",
                                value: this.options.undiscoveredTexture
                            },
                            transitionTexture: {
                                type: "t",
                                value: this.options.transitionTexture
                            },
                            lightDir: {
                                type: "v3",
                                value: new three_1.Vector3(0.5, 0.6, -0.5).normalize()
                            },
                            gridColor: {
                                type: "c",
                                value: typeof this.options.gridColor != "undefined" ? this.options.gridColor : new three_1.Color(0xffffff)
                            },
                            gridWidth: {
                                type: "f",
                                value: typeof this.options.gridWidth != "undefined" ? this.options.gridWidth : 0.02
                            },
                            gridOpacity: {
                                type: "f",
                                value: typeof this.options.gridOpacity != "undefined" ? this.options.gridOpacity : 0.33
                            }
                        },
                        vertexShader: this.options.landVertexShader,
                        fragmentShader: this.options.landFragmentShader,
                        side: three_1.FrontSide,
                        wireframe: false,
                        transparent: false
                    });
                    this.land = new three_1.Mesh(geometry, material);
                    this.land.frustumCulled = false;
                    this.add(this.land);
                    return [2 /*return*/];
                });
            });
        };
        MapMesh.prototype.createMountainMesh = function (tiles) {
            return __awaiter(this, void 0, void 0, function () {
                var atlas, geometry, material;
                return __generator(this, function (_a) {
                    atlas = this.options.terrainAtlas;
                    geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 1, this.options);
                    material = new three_1.RawShaderMaterial({
                        uniforms: {
                            sineTime: { value: 0.0 },
                            showGrid: { value: this._showGrid ? 1.0 : 0.0 },
                            camera: { type: "v3", value: new three_1.Vector3(0, 0, 0) },
                            texture: { type: "t", value: this.options.terrainAtlasTexture },
                            textureAtlasMeta: {
                                type: "4f",
                                value: new three_1.Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                            },
                            hillsNormal: {
                                type: "t",
                                value: this.options.hillsNormalTexture
                            },
                            mapTexture: {
                                type: "t",
                                value: this.options.undiscoveredTexture
                            },
                            lightDir: {
                                type: "v3",
                                value: new three_1.Vector3(0.5, 0.6, -0.5).normalize()
                            },
                            gridColor: {
                                type: "c",
                                value: typeof this.options.gridColor != "undefined" ? this.options.gridColor : new three_1.Color(0xffffff)
                            },
                            gridWidth: {
                                type: "f",
                                value: typeof this.options.gridWidth != "undefined" ? this.options.gridWidth : 0.02
                            },
                            gridOpacity: {
                                type: "f",
                                value: typeof this.options.gridOpacity != "undefined" ? this.options.gridOpacity : 0.33
                            }
                        },
                        vertexShader: this.options.mountainsVertexShader,
                        fragmentShader: this.options.mountainsFragmentShader,
                        side: three_1.FrontSide,
                        wireframe: false,
                        transparent: false
                    });
                    this.mountains = new three_1.Mesh(geometry, material);
                    this.mountains.frustumCulled = false;
                    this.add(this.mountains);
                    return [2 /*return*/];
                });
            });
        };
        return MapMesh;
    }(three_1.Group));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapMesh;
    function createHexagonTilesGeometry(tiles, grid, numSubdivisions, options) {
        var scale = options.scale || 1.0;
        var hexagon = hexagon_1.createHexagon(scale, numSubdivisions);
        var geometry = new three_1.InstancedBufferGeometry();
        var textureAtlas = options.terrainAtlas;
        geometry.maxInstancedCount = tiles.length;
        geometry.addAttribute("position", hexagon.attributes.position);
        geometry.addAttribute("uv", hexagon.attributes.uv);
        geometry.addAttribute("border", hexagon.attributes.border);
        // positions for each hexagon tile
        var tilePositions = tiles.map(function (tile) { return coords_1.qrToWorld(tile.q, tile.r, scale); });
        var posAttr = new three_1.InstancedBufferAttribute(new Float32Array(tilePositions.length * 2), 2, 1);
        posAttr.copyVector2sArray(tilePositions);
        geometry.addAttribute("offset", posAttr);
        //----------------
        var cellSize = textureAtlas.cellSize;
        var cellSpacing = textureAtlas.cellSpacing;
        var numColumns = textureAtlas.width / cellSize;
        function terrainCellIndex(terrain) {
            var cell = textureAtlas.textures[terrain];
            return cell.cellY * numColumns + cell.cellX;
        }
        var styles = tiles.map(function (tile, index) {
            var cell = textureAtlas.textures[tile.terrain];
            if (!cell) {
                throw new Error("Terrain '" + tile.terrain + "' not in texture atlas\r\n" + JSON.stringify(textureAtlas));
            }
            var cellIndex = terrainCellIndex(tile.terrain);
            var shadow = tile.fog ? 1 : 0;
            var clouds = tile.clouds ? 1 : 0;
            var hills = interfaces_1.isHill(tile.height) ? 1 : 0;
            var style = shadow * 1 + hills * 10 + clouds * 100;
            // Coast and River texture index
            var coastIdx = computeCoastTextureIndex(grid, tile);
            var riverIdx = computeRiverTextureIndex(grid, tile);
            tile.bufferIndex = index;
            return new three_1.Vector4(cellIndex, style, coastIdx, riverIdx);
        });
        var styleAttr = new three_1.InstancedBufferAttribute(new Float32Array(tilePositions.length * 4), 4, 1);
        styleAttr.copyVector4sArray(styles);
        geometry.addAttribute("style", styleAttr);
        // surrounding tile terrain represented as two consecutive Vector3s
        // 1. [tileIndex + 0] = NE, [tileIndex + 1] = E, [tileIndex + 2] = SE
        // 2. [tileIndex + 0] = SW, [tileIndex + 1] = W, [tileIndex + 2] = NW
        var neighborsEast = new three_1.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, 1);
        var neighborsWest = new three_1.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, 1);
        for (var i = 0; i < tiles.length; i++) {
            var neighbors = grid.surrounding(tiles[i].q, tiles[i].r);
            for (var j = 0; j < neighbors.length; j++) {
                var neighbor = neighbors[j];
                var attr = j > 2 ? neighborsWest : neighborsEast;
                var array = attr.array;
                // terrain cell index indicates the type of terrain for lookup in the shader
                array[3 * i + j % 3] = neighbor ? terrainCellIndex(neighbor.terrain) : -1;
            }
        }
        geometry.addAttribute("neighborsEast", neighborsEast);
        geometry.addAttribute("neighborsWest", neighborsWest);
        return geometry;
    }
    function computeCoastTextureIndex(grid, tile) {
        function isWaterTile(q, r) {
            var t = grid.get(q, r);
            if (!t)
                return false;
            return interfaces_1.isWater(t.height);
        }
        function bit(x) {
            return x ? "1" : "0";
        }
        if (isWaterTile(tile.q, tile.r)) {
            // only land tiles have a coast
            return 0;
        }
        var NE = bit(isWaterTile(tile.q + 1, tile.r - 1));
        var E = bit(isWaterTile(tile.q + 1, tile.r));
        var SE = bit(isWaterTile(tile.q, tile.r + 1));
        var SW = bit(isWaterTile(tile.q - 1, tile.r + 1));
        var W = bit(isWaterTile(tile.q - 1, tile.r));
        var NW = bit(isWaterTile(tile.q, tile.r - 1));
        return parseInt(NE + E + SE + SW + W + NW, 2);
    }
    function isNextOrPrevRiverTile(grid, tile, q, r) {
        var neighbor = grid.get(q, r);
        if (neighbor && neighbor.river && tile && tile.river) {
            return tile.river.riverIndex == neighbor.river.riverIndex && Math.abs(tile.river.riverTileIndex - neighbor.river.riverTileIndex) == 1;
        }
        else {
            return false;
        }
    }
    function computeRiverTextureIndex(grid, tile) {
        if (!tile.river)
            return 0;
        var NE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r - 1));
        var E = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r));
        var SE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r + 1));
        var SW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r + 1));
        var W = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r));
        var NW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r - 1));
        var combination = NE + E + SE + SW + W + NW;
        return parseInt(combination, 2);
    }
    function bitStr(x) {
        return x ? "1" : "0";
    }
});
//# sourceMappingURL=MapMesh.js.map