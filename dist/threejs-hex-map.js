define("threejs-hex-map", ["three"], function(__WEBPACK_EXTERNAL_MODULE_4__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1), __webpack_require__(17), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, MapMesh_1, DefaultMapViewController_1, Grid_1) {
	    "use strict";
	    exports.MapMesh = MapMesh_1.default;
	    exports.DefaultMapViewController = DefaultMapViewController_1.default;
	    exports.Grid = Grid_1.default;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=index.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
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
	        step((generator = generator.apply(thisArg, _arguments)).next());
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
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5), __webpack_require__(6), __webpack_require__(4), __webpack_require__(7), __webpack_require__(2), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, interfaces_1, hexagon_1, three_1, coords_1, Grid_1, land_fragment_1, land_vertex_1, mountains_fragment_1, mountains_vertex_1, Forests_1) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=MapMesh.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, util_1) {
	    "use strict";
	    var Grid = (function () {
	        function Grid(_width, _height) {
	            this._width = _width;
	            this._height = _height;
	            this.data = [];
	            this.halfWidth = this._width / 2;
	            this.halfHeight = this._height / 2;
	            if (_width % 2 != 0 || _height % 2 != 0) {
	                throw new Error("With and height of grid must be divisible by 2");
	            }
	            this.data = [];
	        }
	        Object.defineProperty(Grid.prototype, "length", {
	            get: function () {
	                return this._width * this._height;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Grid.prototype, "width", {
	            get: function () {
	                return this._width;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(Grid.prototype, "height", {
	            get: function () {
	                return this._height;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Grid.prototype.forEachQR = function (f) {
	            var _a = this, _width = _a._width, _height = _a._height;
	            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
	                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
	                    var q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
	                    var r = j;
	                    f(q, r, this.get(q, r));
	                }
	            }
	            return this;
	        };
	        /**
	         * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
	         * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
	         */
	        Grid.prototype.forEachIJ = function (f) {
	            var _a = this, _width = _a._width, _height = _a._height;
	            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
	                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
	                    var q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
	                    var r = j;
	                    f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r));
	                }
	            }
	            return this;
	        };
	        Grid.prototype.init = function (items) {
	            var _this = this;
	            items.forEach(function (item) {
	                _this.add(item.q, item.r, item);
	            });
	            return this;
	        };
	        Grid.prototype.initQR = function (f) {
	            var _this = this;
	            return this.forEachQR(function (q, r, item) { return _this.add(q, r, f(q, r, item)); });
	        };
	        Grid.prototype.mapQR = function (f) {
	            var mapped = new Grid(this._width, this._height);
	            this.forEachQR(function (q, r, item) { return mapped.add(q, r, f(q, r, item)); });
	            return mapped;
	        };
	        Grid.prototype.toArray = function () {
	            var arr = new Array(this._width * this._height);
	            var i = 0;
	            for (var q in this.data) {
	                for (var r in this.data[q]) {
	                    arr[i++] = this.data[q][r];
	                }
	            }
	            return arr;
	        };
	        Grid.prototype.get = function (q, r) {
	            var col = this.data[q];
	            if (col) {
	                return col[r];
	            }
	            else {
	                return undefined;
	            }
	        };
	        Grid.prototype.getOrCreate = function (q, r, defaultValue) {
	            var col = this.data[q];
	            if (!col) {
	                this.data[q] = [];
	                this.data[q][r] = defaultValue;
	                return defaultValue;
	            }
	            var cell = col[r];
	            if (!cell) {
	                this.data[q][r] = defaultValue;
	                return defaultValue;
	            }
	            return cell;
	        };
	        Grid.prototype.add = function (q, r, item) {
	            if (q in this.data) {
	                this.data[q][r] = item;
	            }
	            else {
	                var col = this.data[q] = [];
	                col[r] = item;
	            }
	        };
	        Grid.prototype.neighbors = function (q, r, range) {
	            var _this = this;
	            if (range === void 0) { range = 1; }
	            return (range == 1 ? Grid.NEIGHBOR_QRS : util_1.qrRange(range)).map(function (qr) {
	                return _this.get(q + qr.q, r + qr.r);
	            }).filter(function (x) { return x !== undefined; });
	        };
	        /**
	         * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
	         * Non-existing neighbors will occur as "undefined". The list is always returned
	         * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
	         * @param q
	         * @param r
	         * @returns {{q: number, r: number}[]}
	         */
	        Grid.prototype.surrounding = function (q, r) {
	            var _this = this;
	            return Grid.NEIGHBOR_QRS.map(function (qr) {
	                return _this.get(q + qr.q, r + qr.r);
	            });
	        };
	        return Grid;
	    }());
	    Grid.NEIGHBOR_QRS = [
	        { q: 1, r: -1 },
	        { q: 1, r: 0 },
	        { q: 0, r: 1 },
	        { q: -1, r: 1 },
	        { q: -1, r: 0 },
	        { q: 0, r: -1 } // NW
	    ];
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Grid;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Grid.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
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
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    var fileLoader = new three_1.XHRLoader();
	    var textureLoader = new three_1.TextureLoader();
	    function loadTexture(url, onProgress) {
	        return new Promise(function (resolve, reject) {
	            var onLoad = function (texture) {
	                resolve(texture);
	            };
	            var onProgressWrapper = function (progress) {
	                if (onProgress) {
	                    onProgress(100 * (progress.loaded / progress.total), progress.total, progress.loaded);
	                }
	            };
	            var onError = function (error) {
	                reject(error);
	            };
	            textureLoader.load(url, onLoad, onProgressWrapper, onError);
	        });
	    }
	    exports.loadTexture = loadTexture;
	    function loadFile(path) {
	        // TODO: Remove cache buster
	        var url = path; // + "?cachebuster=" + Math.random() * 9999999
	        return new Promise(function (resolve, reject) {
	            fileLoader.load(url, function (result) {
	                resolve(result);
	            }, undefined, function (error) {
	                reject(error);
	            });
	        });
	    }
	    exports.loadFile = loadFile;
	    function loadJSON(path) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, loadFile(path).then(function (str) { return JSON.parse(str); })];
	            });
	        });
	    }
	    exports.loadJSON = loadJSON;
	    function qrRange(qrRadius) {
	        var coords = [];
	        forEachRange(-qrRadius, qrRadius + 1, function (dx) {
	            forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, function (dy) {
	                var dz = -dx - dy;
	                coords.push({ q: dx, r: dz });
	            });
	        });
	        return coords;
	    }
	    exports.qrRange = qrRange;
	    function forEachRange(min, max, f) {
	        if (!max) {
	            return range(0, min);
	        }
	        else {
	            for (var i = min; i < max; i++) {
	                f(i);
	            }
	        }
	    }
	    exports.forEachRange = forEachRange;
	    function shuffle(a) {
	        var j, x, i;
	        for (i = a.length; i; i--) {
	            j = Math.floor(Math.random() * i);
	            x = a[i - 1];
	            a[i - 1] = a[j];
	            a[j] = x;
	        }
	        return a;
	    }
	    exports.shuffle = shuffle;
	    function range(minOrMax, max) {
	        if (!max) {
	            return this.range(0, minOrMax);
	        }
	        else {
	            var values = [];
	            for (var i = minOrMax; i < max; i++) {
	                values.push(i);
	            }
	            return values;
	        }
	    }
	    exports.range = range;
	    function flatMap(items, map) {
	        return [].concat.apply([], items.map(map));
	    }
	    exports.flatMap = flatMap;
	    function sum(numbers) {
	        return numbers.reduce(function (sum, item) { return sum + item; }, 0);
	    }
	    exports.sum = sum;
	    function qrEquals(a, b) {
	        return a.q == b.q && a.r == b.r;
	    }
	    exports.qrEquals = qrEquals;
	    function minBy(items, by) {
	        if (items.length == 0) {
	            return null;
	        }
	        else if (items.length == 1) {
	            return items[0];
	        }
	        else {
	            return items.reduce(function (min, cur) { return by(cur) < by(min) ? cur : min; }, items[0]);
	        }
	    }
	    exports.minBy = minBy;
	    function isInteger(value) {
	        return Math.floor(value) == value;
	    }
	    exports.isInteger = isInteger;
	    function flatten(items) {
	        return [].concat.apply([], items);
	    }
	    exports.flatten = flatten;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=util.js.map

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    function isLand(height) {
	        return height >= 0.0 && height < 0.75;
	    }
	    exports.isLand = isLand;
	    function isWater(height) {
	        return height < 0.0;
	    }
	    exports.isWater = isWater;
	    function isHill(height) {
	        return height >= 0.375 && height < 0.75;
	    }
	    exports.isHill = isHill;
	    function isMountain(height) {
	        return height >= 0.75;
	    }
	    exports.isMountain = isMountain;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=interfaces.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    exports.NE = 32;
	    exports.E = 16;
	    exports.SE = 8;
	    exports.SW = 4;
	    exports.W = 2;
	    exports.NW = 1;
	    function subdivideTriangle(a, b, c, numSubdivisions) {
	        if ((numSubdivisions || 0) <= 0)
	            return [a, b, c];
	        var ba = b.clone().sub(a);
	        var ah = a.clone().add(ba.setLength(ba.length() / 2));
	        var cb = c.clone().sub(b);
	        var bh = b.clone().add(cb.setLength(cb.length() / 2));
	        var ac = a.clone().sub(c);
	        var ch = c.clone().add(ac.setLength(ac.length() / 2));
	        return [].concat(subdivideTriangle(ah, bh, ch, numSubdivisions - 1), subdivideTriangle(ch, bh, c, numSubdivisions - 1), subdivideTriangle(ah, ch, a, numSubdivisions - 1), subdivideTriangle(bh, ah, b, numSubdivisions - 1));
	    }
	    exports.subdivideTriangle = subdivideTriangle;
	    function createHexagon(radius, numSubdivisions) {
	        var numFaces = 6 * Math.pow(4, numSubdivisions);
	        var positions = new Float32Array(numFaces * 3 * 3), p = 0;
	        var texcoords = new Float32Array(numFaces * 3 * 2), t = 0;
	        var border = new Float32Array(numFaces * 3 * 1), e = 0;
	        var points = [0, 1, 2, 3, 4, 5].map(function (i) {
	            return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * (i / 6.0)), radius * Math.cos(Math.PI * 2 * (i / 6.0)), 0);
	        }).concat([new three_1.Vector3(0, 0, 0)]);
	        var faces = [0, 6, 1, 1, 6, 2, 2, 6, 3, 3, 6, 4, 4, 6, 5, 5, 6, 0];
	        var vertices = []; // every three vertices constitute one face
	        for (var i = 0; i < faces.length; i += 3) {
	            var a = points[faces[i]], b = points[faces[i + 1]], c = points[faces[i + 2]];
	            vertices = vertices.concat(subdivideTriangle(a, b, c, numSubdivisions));
	        }
	        for (i = 0; i < vertices.length; i++) {
	            positions[p++] = vertices[i].x;
	            positions[p++] = vertices[i].y;
	            positions[p++] = vertices[i].z;
	            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].x + radius) / (radius * 2));
	            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].y + radius) / (radius * 2));
	            var inradius = (Math.sqrt(3) / 2) * radius;
	            border[e++] = vertices[i].length() >= inradius - 0.1 ? 1.0 : 0.0;
	        }
	        var geometry = new three_1.BufferGeometry();
	        geometry.addAttribute("position", new three_1.BufferAttribute(positions, 3));
	        geometry.addAttribute("uv", new three_1.BufferAttribute(texcoords, 2));
	        // 1.0 = border vertex, 0.0 otherwise
	        geometry.addAttribute("border", new three_1.BufferAttribute(border, 1));
	        return geometry;
	    }
	    exports.createHexagon = createHexagon;
	    /**
	     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
	     */
	    function randomPointInHexagon(hexRadius) {
	        // the hexagon consists of 6 triangles, construct one of them randomly
	        var startCornerIndex = Math.floor(Math.random() * 6);
	        var A = computeHexagonCorner(hexRadius, ((startCornerIndex + 0) % 6) / 6.0);
	        var B = new three_1.Vector3(0, 0, 0);
	        var C = computeHexagonCorner(hexRadius, ((startCornerIndex + 1) % 6) / 6.0);
	        // random point in the triangle based on AB and AC
	        var r = Math.random(), s = Math.random();
	        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
	        return A.clone().multiplyScalar((1 - rSqrt))
	            .add(B.clone().multiplyScalar(rSqrt * (1 - sSqrt)))
	            .add(C.clone().multiplyScalar(s * rSqrt));
	    }
	    exports.randomPointInHexagon = randomPointInHexagon;
	    /**
	     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
	     */
	    function randomPointInHexagonEx(hexRadius, modifier) {
	        // the hexagon consists of 6 triangles, construct one of them randomly
	        var startCornerIndex = Math.floor(Math.random() * 6);
	        var A = hexagonCorners1[startCornerIndex].clone();
	        var B = new three_1.Vector3(0, 0, 0);
	        var C = hexagonCorners1[(startCornerIndex + 1) % 6].clone();
	        // random point in the triangle based on AB and AC
	        var r = Math.random(), s = Math.random();
	        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
	        var point = A.multiplyScalar((1 - rSqrt))
	            .add(B.multiplyScalar(rSqrt * (1 - sSqrt)))
	            .add(C.multiplyScalar(s * rSqrt));
	        return point.multiplyScalar(modifier(startCornerIndex) * hexRadius);
	    }
	    exports.randomPointInHexagonEx = randomPointInHexagonEx;
	    function computeHexagonCorner(radius, angle) {
	        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
	    }
	    function computeHexagonCorner1(angle) {
	        var radius = 1.0;
	        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
	    }
	    var hexagonCorners1 = [
	        computeHexagonCorner1(0),
	        computeHexagonCorner1(1 / 6.0),
	        computeHexagonCorner1(2 / 6.0),
	        computeHexagonCorner1(3 / 6.0),
	        computeHexagonCorner1(4 / 6.0),
	        computeHexagonCorner1(5 / 6.0)
	    ];
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=hexagon.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1) {
	    "use strict";
	    var Z_PLANE = new three_1.Plane(new three_1.Vector3(0, 0, 1), 0);
	    function qrToWorld(q, r, scale) {
	        if (scale === void 0) { scale = 1.0; }
	        return new three_1.Vector3(Math.sqrt(3) * (q + r / 2) * scale, (3 / 2) * r * scale, 0);
	    }
	    exports.qrToWorld = qrToWorld;
	    function qrToWorldX(q, r, scale) {
	        if (scale === void 0) { scale = 1.0; }
	        return Math.sqrt(3) * (q + r / 2) * scale;
	    }
	    exports.qrToWorldX = qrToWorldX;
	    function qrToWorldY(q, r, scale) {
	        if (scale === void 0) { scale = 1.0; }
	        return (3 / 2) * r * scale;
	    }
	    exports.qrToWorldY = qrToWorldY;
	    function qrDistance(a, b) {
	        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
	    }
	    exports.qrDistance = qrDistance;
	    function pickingRay(vector, camera) {
	        // set two vectors with opposing z values
	        vector.z = -1.0;
	        var end = new three_1.Vector3(vector.x, vector.y, 1.0);
	        vector.unproject(camera);
	        end.unproject(camera);
	        // find direction from vector to end
	        end.sub(vector).normalize();
	        return new three_1.Raycaster(vector, end);
	    }
	    exports.pickingRay = pickingRay;
	    /**
	     * Transforms mouse coordinates into world space, assuming that the game view spans the entire window.
	     */
	    function mouseToWorld(e, camera) {
	        var mv = new three_1.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
	        var raycaster = pickingRay(mv, camera);
	        return raycaster.ray.intersectPlane(Z_PLANE);
	    }
	    exports.mouseToWorld = mouseToWorld;
	    /**
	     * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
	     */
	    function screenToWorld(x, y, camera) {
	        var mv = new three_1.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
	        var raycaster = pickingRay(mv, camera);
	        return raycaster.ray.intersectPlane(Z_PLANE);
	    }
	    exports.screenToWorld = screenToWorld;
	    /**
	     * Transforms world coordinates into screen space.
	     */
	    function worldToScreen(pos, camera) {
	        var v = pos.clone();
	        v.project(camera);
	        v.x = window.innerWidth / 2 + v.x * (window.innerWidth / 2);
	        v.y = window.innerHeight / 2 - v.y * (window.innerHeight / 2);
	        return v;
	    }
	    exports.worldToScreen = worldToScreen;
	    function axialToCube(q, r) {
	        return { x: q, y: -q - r, z: r };
	    }
	    exports.axialToCube = axialToCube;
	    function cubeToAxial(x, y, z) {
	        return { q: x, r: z };
	    }
	    exports.cubeToAxial = cubeToAxial;
	    /**
	     * Rounds fractal cube coordinates to the nearest full cube coordinates.
	     * @param cubeCoord
	     * @returns {{x: number, y: number, z: number}}
	     */
	    function roundToHex(cubeCoord) {
	        var x = cubeCoord.x, y = cubeCoord.y, z = cubeCoord.z;
	        var rx = Math.round(x);
	        var ry = Math.round(y);
	        var rz = Math.round(z);
	        var x_diff = Math.abs(rx - x);
	        var y_diff = Math.abs(ry - y);
	        var z_diff = Math.abs(rz - z);
	        if (x_diff > y_diff && x_diff > z_diff)
	            rx = -ry - rz;
	        else if (y_diff > z_diff)
	            ry = -rx - rz;
	        else
	            rz = -rx - ry;
	        return { x: rx, y: ry, z: rz };
	    }
	    exports.roundToHex = roundToHex;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=coords.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.LAND_FRAGMENT_SHADER = "\n//\n// Fragment Shader for Land\n//\n\nprecision mediump float;\n\nuniform float sineTime;\nuniform float showGrid;\nuniform float zoom;\nuniform sampler2D texture;\nuniform sampler2D hillsNormal;\nuniform sampler2D coastAtlas;\nuniform sampler2D riverAtlas;\nuniform sampler2D mapTexture;\nuniform sampler2D transitionTexture;\nuniform mat3 normalMatrix;\n\nuniform vec3 gridColor;\nuniform float gridWidth;\nuniform float gridOpacity;\n\n// (width, height, cellSize, cellSpacing)\nuniform vec4 textureAtlasMeta;\n\nvarying vec2 vUV;\nvarying vec2 vTexCoord;\nvarying vec3 vPosition;\nvarying float vExtra;\nvarying float vTerrain;\nvarying float vFogOfWar;\nvarying float vHill;\nvarying float vHidden;\nvarying vec2 vOffset;\nvarying vec2 vCoastTextureCell;\nvarying vec2 vRiverTextureCell;\nvarying vec3 vLightDirT;\nvarying vec3 vNeighborsEast;\nvarying vec3 vNeighborsWest;\n\nconst vec3 cameraPos = vec3(0, -25.0, 25.0);\nconst vec3 lightDir = vec3(0.0, -1.0, -1.0);\nconst vec3 lightAmbient = vec3(0.3, 0.3, 0.3);\nconst vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);\n\nconst float hillsNormalMapScale = 0.3; //0.1;\n\nvec2 cellIndexToUV(float idx) {\n    float atlasWidth = textureAtlasMeta.x;\n    float atlasHeight = textureAtlasMeta.y;\n    float cellSize = textureAtlasMeta.z;\n    float cols = atlasWidth / cellSize - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering\n    float rows = atlasHeight / cellSize;\n    float x = mod(idx, cols);\n    float y = floor(idx / cols);\n\n    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));\n    return vec2(x / cols + vUV.x / cols, 1.0 - (y / rows + (1.0 - vUV.y) / rows));\n}\n\n/**\n * Uses the texture of a neighboring terrain to blend the given color.\n * @parma color to blend with\n * @param terrain texture atlas index\n * @param sector 0 - 5 (NE - NW) \n */\nvec4 terrainTransition(vec4 inputColor, float terrain, float sector) {\n    if (vTerrain <= 1.0 && terrain > 1.0) return inputColor;\n    vec2 otherUV = cellIndexToUV(terrain);\n    vec2 blendMaskUV = vec2(sector/6.0 + vUV.x / 6.0, 1.0 - vUV.y / 6.0);\n    vec4 color = texture2D(texture, otherUV);\n    vec4 blend = texture2D(transitionTexture, blendMaskUV);\n    float a = min(blend.r, clamp(terrain - vTerrain, 0.0, 1.0));\n    return mix(inputColor, color, a);\n}\n\nvoid main() {\n    // LAND\n    vec4 texColor = texture2D(texture, vTexCoord);\n    vec3 normal = vec3(0.0, 1.0, 0.0);\n    vec2 normalMapUV = vPosition.xy * hillsNormalMapScale;\n\n    /// Transitions to neighboring tiles\n    texColor = terrainTransition(texColor, vNeighborsEast.x, 0.0);\n    texColor = terrainTransition(texColor, vNeighborsEast.y, 1.0);\n    texColor = terrainTransition(texColor, vNeighborsEast.z, 2.0);\n    texColor = terrainTransition(texColor, vNeighborsWest.x, 3.0);\n    texColor = terrainTransition(texColor, vNeighborsWest.y, 4.0);\n    texColor = terrainTransition(texColor, vNeighborsWest.z, 5.0);\n\n    // HILL\n    if (vHill > 0.0) {\n        normal = normalize((texture2D(hillsNormal, normalMapUV).xyz * 2.0) - 1.0);\n        normal = mix(normal, vec3(0.0, 1.0, 0.0), vExtra * vExtra * vExtra); // fade out towards tile edges\n    }\n\n    vec3 lightDir = vLightDirT;\n    float lambertian = max(dot(lightDir, normal), 0.0);\n    //lambertian = sqrt(lambertian);\n\n    vec3 color = lightAmbient * texColor.xyz + lambertian * texColor.xyz * lightDiffuse;\n    gl_FragColor = vec4(color, 1.0);    \n    \n    // comment out following line to show normal vector visualization\n    //gl_FragColor = vec4((normal.x + 1.0 / 2.0, 0.0, 1.0), (normal.y + 1.0 / 2.0, 0.0, 1.0), (normal.z + 1.0 / 2.0, 0.0, 1.0), 1.0);\n    \n    // comment out following line to show normal map texture (UV) coordinates\n    //gl_FragColor = vec4(mod(normalMapUV.x, 1.0), mod(normalMapUV.y, 1.0), 0.0, 1.0);\n\n    // Coast\n    vec2 coastUv = vec2(vCoastTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vCoastTextureCell.y / 8.0 + vUV.y / 8.0));\n    vec4 coastColor = texture2D(coastAtlas, coastUv);\n\n    if (coastColor.w > 0.0) {\n        vec3 coast = lightAmbient * coastColor.xyz + lambertian * coastColor.xyz * lightDiffuse;\n        gl_FragColor = mix(gl_FragColor, vec4(coast, 1.0), coastColor.w);\n    }\n    \n    // River\n    vec2 riverUv = vec2(vRiverTextureCell.x / 8.0 + vUV.x / 8.0, 1.0 - (vRiverTextureCell.y / 8.0 + vUV.y / 8.0));\n    vec4 riverColor = texture2D(riverAtlas, riverUv);\n\n    if (riverColor.w > 0.0) {\n        vec3 river = lightAmbient * riverColor.xyz + lambertian * riverColor.xyz * lightDiffuse;\n        //gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);\n        gl_FragColor = mix(gl_FragColor, vec4(river, 1.0), riverColor.w);\n    }\n\n    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border\n        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);\n    }\n\n    // FOW\n    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 && vHidden == 0.0 ? 0.66 : 1.0);\n\n    // Map Texture for hidden tiles\n    if (vHidden > 0.0) {\n        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));\n    }    \n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=land.fragment.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.LAND_VERTEX_SHADER = "\n//\n// Vertex Shader for Land\n//\nprecision mediump float;\n\nuniform float sineTime; // oscillating time [-1.0, 1.0]\nuniform float zoom; // camera zoom factor\nuniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\nuniform mat4 modelMatrix;\nuniform vec3 camera; // camera position in world space\n\n// (width, height, cellSize, cellSpacing)\nuniform vec4 textureAtlasMeta;\n\nuniform vec3 lightDir;\n\nattribute vec3 position; // position of one of the hexagon's vertices\nattribute vec2 offset; // world position offset for the entire hexagon (tile)\nattribute vec2 uv; // texture coordinates\nattribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)\n\n// style.x = texture atlas cell index\n// style.y = \"decimal bitmask\" (fog=1xx, hills=x1x, clouds=xx1)\n// style.z = coast texture index (0 - 64)\n// style.w = river texture index (0 - 64)\nattribute vec4 style;\n\n// type of terrain on surrounding tiles as texture atlas cell index (like style.x)\n// is -1 if there is no neighbor (e.g. at the border of the map)\nattribute vec3 neighborsEast; // x = NE, y = E, z = SE\nattribute vec3 neighborsWest; // x = SW, y = W, z = NW \n\nvarying vec3 vPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vUV;\nvarying float vExtra;\nvarying float vTerrain; // texture cell\nvarying float vFogOfWar; // 1.0 = shadow, 0.0 = visible\nvarying float vHidden; // 1.0 = hidden, 0.0 = visible\nvarying float vHill;\nvarying vec2 vOffset;\nvarying vec2 vCoastTextureCell;\nvarying vec2 vRiverTextureCell;\nvarying vec3 vLightDirT;\n\nvarying vec3 vNeighborsEast;\nvarying vec3 vNeighborsWest;\n\nvec2 cellIndexToUV(float idx) {\n    float atlasWidth = textureAtlasMeta.x;\n    float atlasHeight = textureAtlasMeta.y;\n    float cellSize = textureAtlasMeta.z;\n    float cols = atlasWidth / cellSize;\n    float rows = atlasHeight / cellSize;\n    float x = mod(idx, cols);\n    float y = floor(idx / cols);\n\n    //return vec2(uv.x * w + u, 1.0 - (uv.y * h + v));\n    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (1.0 - uv.y) / rows));\n}\n\nmat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {\n    vec3 binormal = cross(tangent, normal_ws);\n    mat3 M;\n    M[0] = normalize(binormal);\n    M[1] = normalize(tangent);\n    M[2] = normalize(normal_ws);\n    \n    return mat3(modelMatrix) * M;\n}\n\nvoid main() {\n    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);\n\n    // its a hill if style's 2nd decimal is 1, i.e. any number matching x1x, e.g. 10, 11, 110\n    float hill = floor(mod(style.y / 10.0, 10.0)); // 0 = no, 1 = yes\n\n    if (hill > 0.0 && border < 0.75) { // hill\n        //pos.z = 0.1 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.25;\n        vHill = 1.0;\n    } else {\n        vHill = 0.0;\n    }\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n    vPosition = pos;\n    vOffset = offset;\n\n    vUV = uv;\n    vTexCoord = cellIndexToUV(style.x);\n    vCoastTextureCell = vec2(mod(style.z, 8.0), floor(style.z / 8.0));\n    vRiverTextureCell = vec2(mod(style.w, 8.0), floor(style.w / 8.0));\n\n    vExtra = border;\n    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);\n    vHidden = style.y >= 100.0 ? 1.0 : 0.0;\n    \n    mat3 T = tangentSpace(vec3(0.0, -1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);\n    vLightDirT = normalize(T * lightDir);\n    \n    vNeighborsEast = neighborsEast;\n    vNeighborsWest = neighborsWest;\n    \n    vTerrain = style.x;\n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=land.vertex.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.MOUNTAINS_FRAGMENT_SHADER = "\n//\n// Fragment Shader for Land\n//\n\nprecision highp float;\nuniform float sineTime;\nuniform float showGrid;\nuniform float zoom;\nuniform sampler2D texture;\nuniform sampler2D hillsNormal;\nuniform sampler2D mapTexture;\n\nuniform vec3 gridColor;\nuniform float gridWidth;\nuniform float gridOpacity;\n\nvarying vec2 vTexCoord;\nvarying vec3 vPosition;\nvarying float vExtra;\nvarying float vFogOfWar;\nvarying float vHill;\nvarying float vHidden;\nvarying vec2 vOffset;\nvarying vec3 vLightDirT;\nvarying vec3 vNeighborsEast;\nvarying vec3 vNeighborsWest;\n\nconst vec3 cameraPos = vec3(0, -25.0, 25.0);\nconst vec3 lightPos = vec3(1000.0, 1000.0, 1000.0);\nconst vec3 lightAmbient = vec3(0.08, 0.08, 0.08);\nconst vec3 lightDiffuse = vec3(1.3, 1.3, 1.3);\n\nvoid main() {\n    // LAND\n    vec4 texColor = texture2D(texture, vTexCoord);\n    vec3 normal = vec3(0.0, 1.0, 0.0);\n\n    normal = normalize((texture2D(hillsNormal, vTexCoord * 1.5 + vOffset * 0.5).xyz * 2.0) - 1.0);\n\n    //vec3 lightDir = normalize(lightPos - vPosition);\n    vec3 lightDir = vLightDirT;\n    float lambertian = max(dot(lightDir, normal), 0.0);\n\n    vec3 color = lightAmbient + lambertian * texColor.xyz * lightDiffuse;\n    gl_FragColor = vec4(color, 1.0);\n\n    if (showGrid > 0.0 && vExtra > 1.0 - gridWidth) { // hex border\n        gl_FragColor = mix(vec4(gridColor, 1.0), gl_FragColor, 1.0 - gridOpacity);\n    }\n\n    // FOW\n    gl_FragColor = gl_FragColor * (vFogOfWar > 0.0 ? 0.66 : 1.0);\n\n    // Map Texture for hidden tiles\n    if (vHidden > 0.0) {\n        gl_FragColor = texture2D(mapTexture, vec2(vPosition.x * 0.05, vPosition.y * 0.05));\n    } \n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=mountains.fragment.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.MOUNTAINS_VERTEX_SHADER = "\n//\n// Vertex Shader for Land\n//\n\n\nprecision highp float;\n\nuniform float sineTime; // oscillating time [-1.0, 1.0]\nuniform float zoom; // camera zoom factor\nuniform float size; // quadratic map size (i.e. size=10 means 10x10 hexagons)\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat3 normalMatrix;\nuniform mat4 modelMatrix;\nuniform vec3 camera; // camera position in world space\n\nuniform vec3 lightDir;\n\n// (width, height, cellSize, cellSpacing)\nuniform vec4 textureAtlasMeta;\n\nattribute vec3 position; // position of one of the hexagon's vertices\nattribute vec2 offset; // world position offset for the entire hexagon (tile)\nattribute vec2 uv; // texture coordinates\nattribute float border; // border = distance from hexagon center (0.0 = center, 1.0 = border)\n\n// style.x = texture atlas cell index\n// style.y = \"decimal bitmask\" (fog=1xx, hills=x1x, clouds=xx1)\n// style.z = coast texture index (0 - 64)\n// style.w = river texture index (0 - 64)\nattribute vec2 style;\n\n// type of terrain on surrounding tiles as texture atlas cell index (like style.x)\n// is -1 if there is no neighbor (e.g. at the border of the map)\nattribute vec3 neighborsEast; // x = NE, y = E, z = SE\nattribute vec3 neighborsWest; // x = SW, y = W, z = NW \n\nvarying vec3 vPosition;\nvarying vec2 vTexCoord;\nvarying float vExtra;\nvarying float vFogOfWar; // 1.0 = shadow, 0.0 = no shadow\nvarying float vHill;\nvarying float vHidden; // 1.0 = hidden, 0.0 = visible\nvarying vec2 vOffset;\nvarying vec3 vLightDirT;\nvarying vec3 vNeighborsEast;\nvarying vec3 vNeighborsWest;\n\nvec2 cellIndexToUV(float idx) {\n    float atlasWidth = textureAtlasMeta.x;\n    float atlasHeight = textureAtlasMeta.y;\n    float cellSize = textureAtlasMeta.z;\n    float cols = atlasWidth / cellSize;\n    float rows = atlasHeight / cellSize;\n    float x = mod(idx, cols);\n    float y = floor(idx / cols);\n\n    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + uv.y / rows));\n}\n\nmat3 tangentSpace(vec3 normal_ws, vec3 tangent, mat4 worldMatrix) {\n    vec3 binormal = cross(tangent, normal_ws);\n    mat3 M;\n    M[0] = normalize(binormal);\n    M[1] = normalize(tangent);\n    M[2] = normalize(normal_ws);\n    \n    return mat3(modelMatrix) * M;\n}\n\nvoid main() {\n    vec3 pos = vec3(offset.x + position.x, offset.y + position.y, 0);\n\n    if (border < 0.95 && style.y < 100.0) {\n        pos.z = 0.2 + (0.5 + sin(uv.s + pos.s * 2.0) * 0.5) * 0.5;\n    }\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n    vPosition = pos;\n    vOffset = offset;\n\n    vTexCoord = cellIndexToUV(style.x);\n\n    vExtra = border;\n    vFogOfWar = mod(style.y, 10.0) == 1.0 ? 1.0 : 0.0;   // style.y < 100.0 ? 10.0 : (style.y == 1.0 || style.y == 11.0 ? 1.0 : 0.0);\n    vHidden = style.y >= 100.0 ? 1.0 : 0.0;\n    \n    vNeighborsEast = neighborsEast;\n    vNeighborsWest = neighborsWest;\n    \n    mat3 T = tangentSpace(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), modelMatrix);\n    vLightDirT = normalize(T * lightDir);\n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=mountains.vertex.js.map

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || function (d, b) {
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
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(4), __webpack_require__(2), __webpack_require__(3), __webpack_require__(7), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, three_1, Grid_1, util_1, coords_1, trees_vertex_1, trees_fragment_1, map_generator_1) {
	    "use strict";
	    var Forests = (function (_super) {
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
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.default = Forests;
	    var Trees = (function (_super) {
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
	        Trees.prototype.createGeometry = function () {
	            var _this = this;
	            var geometry = new three_1.BufferGeometry();
	            var _a = this._options, treeSize = _a.treeSize, treesPerForest = _a.treesPerForest, mapScale = _a.mapScale;
	            var numTreesRange = util_1.range(0, treesPerForest);
	            // tree positions
	            var positions = util_1.flatMap(this._tiles, function (tile, j) {
	                tile.bufferIndex = j * treesPerForest;
	                return numTreesRange.map(function (j) {
	                    var tilePos = coords_1.qrToWorld(tile.q, tile.r, mapScale);
	                    var localPos = map_generator_1.randomPointOnCoastTile(map_generator_1.waterAdjacency(_this._globalGrid, tile), mapScale);
	                    return tilePos.add(localPos).setZ(0.12);
	                });
	            });
	            var posAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(positions);
	            geometry.addAttribute("position", posAttr);
	            // tree parameters
	            var cols = this._options.spritesheetSubdivisions;
	            var params = util_1.flatMap(this._tiles, function (tile) {
	                var spriteIndex = function () { return tile.treeIndex * cols + Math.floor(Math.random() * cols); };
	                return numTreesRange.map(function (i) { return new three_1.Vector3(spriteIndex(), 0.0, tile.clouds ? 0.0 : 1.0); });
	            });
	            this._alphaAttr = new three_1.BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(params);
	            geometry.addAttribute("params", this._alphaAttr);
	            return geometry;
	        };
	        Trees.prototype.createMaterial = function () {
	            var _a = this._options, treeSize = _a.treeSize, mapScale = _a.mapScale;
	            var parameters = {
	                uniforms: {
	                    texture: {
	                        type: "t",
	                        value: this._texture
	                    },
	                    spritesheetSubdivisions: { type: "f", value: 4 },
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=Forests.js.map

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.TREES_VERTEX_SHADER = "\nprecision mediump float;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float size;\nuniform float scale;\n\nattribute vec3 position;\nattribute vec3 params; // x = spritesheet x, y = spritesheet y, z = alpha\nattribute vec3 color;\n\nvarying vec3 vParams;\nvarying vec3 vColor;\n\nvoid main() {\n    vParams = params;\n\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    gl_Position = projectionMatrix * mvPosition;\n    gl_PointSize = size * ( scale / - mvPosition.z );\n    \n    vColor = color;\n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=trees.vertex.js.map

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.TREES_FRAGMENT_SHADER = "\nprecision mediump float;\n\nuniform sampler2D texture;\nuniform float alphaTest;\nuniform float spritesheetSubdivisions;\n\nvarying vec3 vParams;\nvarying vec3 vColor;\n\nvec2 spriteIndexToUV(float idx, vec2 uv) {\n    float cols = spritesheetSubdivisions - 1e-6; // subtract small epsilon to avoid edge cases that cause flickering\n    float rows = spritesheetSubdivisions;\n    \n    float x = mod(idx, cols);\n    float y = floor(idx / cols);\n\n    return vec2(x / cols + uv.x / cols, 1.0 - (y / rows + (uv.y) / rows));\n}\n\nvoid main() {\n    vec2 uv = spriteIndexToUV(vParams.x, gl_PointCoord);\n    vec4 diffuse = texture2D(texture, uv);\n    \n    float alpha = diffuse.w * vParams.z;\n    \n    if (alpha < alphaTest) discard;\n    \n    gl_FragColor = vec4(diffuse.xyz, alpha);\n}\n";
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=trees.fragment.js.map

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
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
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(16), __webpack_require__(5), __webpack_require__(3), __webpack_require__(2), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, perlin_1, interfaces_1, util_1, Grid_1, hexagon_1) {
	    "use strict";
	    function randomHeight(q, r) {
	        var noise1 = perlin_1.simplex2(q / 10, r / 10);
	        var noise2 = perlin_1.perlin2(q / 5, r / 5);
	        var noise3 = perlin_1.perlin2(q / 30, r / 30);
	        var noise = noise1 + noise2 + noise3;
	        return noise / 3.0 * 2.0;
	    }
	    /**
	     * Generates are square map of the given size centered at (0,0).
	     * @param size
	     * @param heightAt
	     * @param terrainAt
	     */
	    function generateMap(size, tile) {
	        return __awaiter(this, void 0, void 0, function () {
	            var grid, withRivers;
	            return __generator(this, function (_a) {
	                grid = new Grid_1.default(size, size).mapQR(function (q, r) { return tile(q, r); });
	                withRivers = generateRivers(grid);
	                return [2 /*return*/, withRivers];
	            });
	        });
	    }
	    exports.generateMap = generateMap;
	    function generateRandomMap(size, tile) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                perlin_1.seed(Date.now() + Math.random());
	                return [2 /*return*/, generateMap(size, function (q, r) { return tile(q, r, randomHeight(q, r)); })];
	            });
	        });
	    }
	    exports.generateRandomMap = generateRandomMap;
	    function generateRivers(grid) {
	        // find a few river spawn points, preferably in mountains
	        var tiles = grid.toArray();
	        var numRivers = Math.max(1, Math.round(Math.sqrt(grid.length) / 4));
	        var spawns = util_1.shuffle(tiles.filter(function (t) { return isAccessibleMountain(t, grid); })).slice(0, numRivers);
	        // grow the river towards the water by following the height gradient
	        var rivers = spawns.map(growRiver);
	        // assign sequential indices to rivers and their tiles
	        var riverIndex = 0;
	        for (var _i = 0, rivers_1 = rivers; _i < rivers_1.length; _i++) {
	            var river = rivers_1[_i];
	            var riverTileIndex = 0;
	            for (var _a = 0, river_1 = river; _a < river_1.length; _a++) {
	                var tile = river_1[_a];
	                tile.river = {
	                    riverIndex: riverIndex,
	                    riverTileIndex: riverTileIndex++
	                };
	            }
	            riverIndex++;
	        }
	        return grid;
	        function growRiver(spawn) {
	            var river = [spawn];
	            var tile = spawn;
	            while (!interfaces_1.isWater(tile.height) && river.length < 20) {
	                var neighbors = sortByHeight(grid.neighbors(tile.q, tile.r)).filter(function (t) { return !contains(t, river); });
	                if (neighbors.length == 0) {
	                    console.info("Aborted river generation", river, tile);
	                    return river;
	                }
	                var next = neighbors[Math.max(neighbors.length - 1, Math.floor(Math.random() * 1.2))];
	                river.push(next);
	                tile = next;
	            }
	            return river;
	        }
	        function sortByHeight(tiles) {
	            return tiles.sort(function (a, b) { return b.height - a.height; });
	        }
	        function contains(t, ts) {
	            for (var _i = 0, ts_1 = ts; _i < ts_1.length; _i++) {
	                var other = ts_1[_i];
	                if (other.q == t.q && other.r == t.r) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    }
	    function isAccessibleMountain(tile, grid) {
	        var ns = grid.neighbors(tile.q, tile.r);
	        var spring = interfaces_1.isMountain(tile.height);
	        return spring && ns.filter(function (t) { return interfaces_1.isLand(t.height); }).length > 3;
	    }
	    /**
	     * Computes the water adjecency for the given tile.
	     * @param grid grid with all tiles to be searched
	     * @param tile tile to look at
	     */
	    function waterAdjacency(grid, tile) {
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
	    }
	    exports.waterAdjacency = waterAdjacency;
	    /**
	     * Returns a random point on a hex tile considering adjacent water, i.e. avoiding points on the beach.
	     * @param water water adjacency of the tile
	     * @param scale coordinate scale
	     * @returns {THREE.Vector3} local position
	     */
	    function randomPointOnCoastTile(water, scale) {
	        if (scale === void 0) { scale = 1.0; }
	        return hexagon_1.randomPointInHexagonEx(scale, function (corner) {
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
	    }
	    exports.randomPointOnCoastTile = randomPointOnCoastTile;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=map-generator.js.map

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * A speed-improved perlin and simplex noise algorithms for 2D.
	 *
	 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 * Converted to Javascript by Joseph Gentle.
	 * Conveted to TypeScript by Mathias Kahl (mathias.kahl@gmail.com)
	 *
	 * Version 2016-08-18
	 *
	 * This code was placed in the public domain by its original author,
	 * Stefan Gustavson. You may use it as you see fit, but
	 * attribution is appreciated.
	 *
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    var Grad = (function () {
	        function Grad(x, y, z) {
	            this.x = x;
	            this.y = y;
	            this.z = z;
	        }
	        Grad.prototype.dot2 = function (x, y) {
	            return this.x * x + this.y * y;
	        };
	        Grad.prototype.dot3 = function (x, y, z) {
	            return this.x * x + this.y * y + this.z * z;
	        };
	        return Grad;
	    }());
	    var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
	        new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
	        new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
	    var p = [151, 160, 137, 91, 90, 15,
	        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
	        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
	        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
	        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
	        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
	        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
	        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
	        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
	        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
	        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
	        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
	        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
	    // To remove the need for index wrapping, double the permutation table length
	    var perm = new Array(512);
	    var gradP = new Array(512);
	    // This isn't a very good seeding function, but it works ok. It supports 2^16
	    // different seed values. Write something better if you need more seeds.
	    function seed(seed) {
	        if (seed > 0 && seed < 1) {
	            // Scale the seed out
	            seed *= 65536;
	        }
	        seed = Math.floor(seed);
	        if (seed < 256) {
	            seed |= seed << 8;
	        }
	        for (var i = 0; i < 256; i++) {
	            var v;
	            if (i & 1) {
	                v = p[i] ^ (seed & 255);
	            }
	            else {
	                v = p[i] ^ ((seed >> 8) & 255);
	            }
	            perm[i] = perm[i + 256] = v;
	            gradP[i] = gradP[i + 256] = grad3[v % 12];
	        }
	    }
	    exports.seed = seed;
	    seed(0);
	    /*
	     for(var i=0; i<256; i++) {
	     perm[i] = perm[i + 256] = p[i];
	     gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
	     }*/
	    // Skewing and unskewing factors for 2, 3, and 4 dimensions
	    var F2 = 0.5 * (Math.sqrt(3) - 1);
	    var G2 = (3 - Math.sqrt(3)) / 6;
	    var F3 = 1 / 3;
	    var G3 = 1 / 6;
	    // 2D simplex noise
	    function simplex2(xin, yin) {
	        var n0, n1, n2; // Noise contributions from the three corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin) * F2; // Hairy factor for 2D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var t = (i + j) * G2;
	        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
	        var y0 = yin - j + t;
	        // For the 2D case, the simplex shape is an equilateral triangle.
	        // Determine which simplex we are in.
	        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	        if (x0 > y0) {
	            i1 = 1;
	            j1 = 0;
	        }
	        else {
	            i1 = 0;
	            j1 = 1;
	        }
	        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	        // c = (3-sqrt(3))/6
	        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	        var y1 = y0 - j1 + G2;
	        var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
	        var y2 = y0 - 1 + 2 * G2;
	        // Work out the hashed gradient indices of the three simplex corners
	        i &= 255;
	        j &= 255;
	        var gi0 = gradP[i + perm[j]];
	        var gi1 = gradP[i + i1 + perm[j + j1]];
	        var gi2 = gradP[i + 1 + perm[j + 1]];
	        // Calculate the contribution from the three corners
	        var t0 = 0.5 - x0 * x0 - y0 * y0;
	        if (t0 < 0) {
	            n0 = 0;
	        }
	        else {
	            t0 *= t0;
	            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
	        }
	        var t1 = 0.5 - x1 * x1 - y1 * y1;
	        if (t1 < 0) {
	            n1 = 0;
	        }
	        else {
	            t1 *= t1;
	            n1 = t1 * t1 * gi1.dot2(x1, y1);
	        }
	        var t2 = 0.5 - x2 * x2 - y2 * y2;
	        if (t2 < 0) {
	            n2 = 0;
	        }
	        else {
	            t2 *= t2;
	            n2 = t2 * t2 * gi2.dot2(x2, y2);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to return values in the interval [-1,1].
	        return 70 * (n0 + n1 + n2);
	    }
	    exports.simplex2 = simplex2;
	    // 3D simplex noise
	    function simplex3(xin, yin, zin) {
	        var n0, n1, n2, n3; // Noise contributions from the four corners
	        // Skew the input space to determine which simplex cell we're in
	        var s = (xin + yin + zin) * F3; // Hairy factor for 2D
	        var i = Math.floor(xin + s);
	        var j = Math.floor(yin + s);
	        var k = Math.floor(zin + s);
	        var t = (i + j + k) * G3;
	        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
	        var y0 = yin - j + t;
	        var z0 = zin - k + t;
	        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	        // Determine which simplex we are in.
	        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	        if (x0 >= y0) {
	            if (y0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            }
	            else if (x0 >= z0) {
	                i1 = 1;
	                j1 = 0;
	                k1 = 0;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            }
	            else {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 1;
	                j2 = 0;
	                k2 = 1;
	            }
	        }
	        else {
	            if (y0 < z0) {
	                i1 = 0;
	                j1 = 0;
	                k1 = 1;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            }
	            else if (x0 < z0) {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 0;
	                j2 = 1;
	                k2 = 1;
	            }
	            else {
	                i1 = 0;
	                j1 = 1;
	                k1 = 0;
	                i2 = 1;
	                j2 = 1;
	                k2 = 0;
	            }
	        }
	        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	        // c = 1/6.
	        var x1 = x0 - i1 + G3; // Offsets for second corner
	        var y1 = y0 - j1 + G3;
	        var z1 = z0 - k1 + G3;
	        var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
	        var y2 = y0 - j2 + 2 * G3;
	        var z2 = z0 - k2 + 2 * G3;
	        var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
	        var y3 = y0 - 1 + 3 * G3;
	        var z3 = z0 - 1 + 3 * G3;
	        // Work out the hashed gradient indices of the four simplex corners
	        i &= 255;
	        j &= 255;
	        k &= 255;
	        var gi0 = gradP[i + perm[j + perm[k]]];
	        var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
	        var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
	        var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];
	        // Calculate the contribution from the four corners
	        var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
	        if (t0 < 0) {
	            n0 = 0;
	        }
	        else {
	            t0 *= t0;
	            n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
	        }
	        var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
	        if (t1 < 0) {
	            n1 = 0;
	        }
	        else {
	            t1 *= t1;
	            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
	        }
	        var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
	        if (t2 < 0) {
	            n2 = 0;
	        }
	        else {
	            t2 *= t2;
	            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
	        }
	        var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
	        if (t3 < 0) {
	            n3 = 0;
	        }
	        else {
	            t3 *= t3;
	            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
	        }
	        // Add contributions from each corner to get the final noise value.
	        // The result is scaled to return values in the interval [-1,1].
	        return 32 * (n0 + n1 + n2 + n3);
	    }
	    exports.simplex3 = simplex3;
	    // ##### Perlin noise stuff
	    function fade(t) {
	        return t * t * t * (t * (t * 6 - 15) + 10);
	    }
	    function lerp(a, b, t) {
	        return (1 - t) * a + t * b;
	    }
	    // 2D Perlin Noise
	    function perlin2(x, y) {
	        // Find unit grid cell containing point
	        var X = Math.floor(x), Y = Math.floor(y);
	        // Get relative xy coordinates of point within that cell
	        x = x - X;
	        y = y - Y;
	        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	        X = X & 255;
	        Y = Y & 255;
	        // Calculate noise contributions from each of the four corners
	        var n00 = gradP[X + perm[Y]].dot2(x, y);
	        var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
	        var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
	        var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
	        // Compute the fade curve value for x
	        var u = fade(x);
	        // Interpolate the four results
	        return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
	    }
	    exports.perlin2 = perlin2;
	    // 3D Perlin Noise
	    function perlin3(x, y, z) {
	        // Find unit grid cell containing point
	        var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
	        // Get relative xyz coordinates of point within that cell
	        x = x - X;
	        y = y - Y;
	        z = z - Z;
	        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
	        X = X & 255;
	        Y = Y & 255;
	        Z = Z & 255;
	        // Calculate noise contributions from each of the eight corners
	        var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
	        var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
	        var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
	        var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
	        var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
	        var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
	        var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
	        var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);
	        // Compute the fade curve value for x, y, z
	        var u = fade(x);
	        var v = fade(y);
	        var w = fade(z);
	        // Interpolate
	        return lerp(lerp(lerp(n000, n100, u), lerp(n001, n101, u), w), lerp(lerp(n010, n110, u), lerp(n011, n111, u), w), v);
	    }
	    exports.perlin3 = perlin3;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=perlin.js.map

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(7), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, coords_1, three_1) {
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
	            this.lastDrag = new three_1.Vector3(0, 0, 0);
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=DefaultMapViewController.js.map

/***/ }
/******/ ])});;