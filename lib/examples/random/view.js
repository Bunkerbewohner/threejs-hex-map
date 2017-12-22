var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
define(["require", "exports", "../../src/MapView", "../../src/util", "../../src/interfaces", "../../src/map-generator", "./util", "three"], function (require, exports, MapView_1, util_1, interfaces_1, map_generator_1, util_2, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function asset(relativePath) {
        return "../../assets/" + relativePath;
    }
    function loadTextureAtlas() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, util_1.loadJSON(asset("land-atlas.json"))];
            });
        });
    }
    function generateMap(mapSize) {
        return __awaiter(this, void 0, void 0, function () {
            function coldZone(q, r, height) {
                if (Math.abs(r) > mapSize * (0.44 + Math.random() * 0.03))
                    return "snow";
                else
                    return "tundra";
            }
            function warmZone(q, r, height) {
                return util_2.varying("grass", "grass", "grass", "plains", "plains", "desert");
            }
            function terrainAt(q, r, height) {
                if (height < 0.0)
                    return "ocean";
                else if (height > 0.75)
                    return "mountain";
                else if (Math.abs(r) > mapSize * 0.4)
                    return coldZone(q, r, height);
                else
                    return warmZone(q, r, height);
            }
            function treeAt(q, r, terrain) {
                if (terrain == "snow")
                    return 2;
                else if (terrain == "tundra")
                    return 1;
                else
                    return 0;
            }
            return __generator(this, function (_a) {
                return [2 /*return*/, map_generator_1.generateRandomMap(mapSize, function (q, r, height) {
                        var terrain = terrainAt(q, r, height);
                        var trees = interfaces_1.isMountain(height) || interfaces_1.isWater(height) || terrain == "desert" ? undefined :
                            (util_2.varying(true, false, false) ? treeAt(q, r, terrain) : undefined);
                        return { q: q, r: r, height: height, terrain: terrain, treeIndex: trees, rivers: null, fog: false, clouds: false };
                    })];
            });
        });
    }
    function initView(mapSize, initialZoom) {
        return __awaiter(this, void 0, void 0, function () {
            var textureLoader, loadTexture, options, _a, map, atlas, mapView, controller;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        textureLoader = new three_1.TextureLoader();
                        loadTexture = function (name) {
                            var texture = textureLoader.load(asset(name));
                            texture.name = name;
                            return texture;
                        };
                        options = {
                            terrainAtlas: null,
                            terrainAtlasTexture: loadTexture("terrain.png"),
                            hillsNormalTexture: loadTexture("hills-normal.png"),
                            coastAtlasTexture: loadTexture("coast-diffuse.png"),
                            riverAtlasTexture: loadTexture("river-diffuse.png"),
                            undiscoveredTexture: loadTexture("paper.jpg"),
                            treeSpritesheet: loadTexture("trees.png"),
                            treeSpritesheetSubdivisions: 4,
                            transitionTexture: loadTexture("transitions.png"),
                            treesPerForest: 50,
                            gridWidth: 0.025,
                            gridColor: new three_1.Color(0x42322b),
                            gridOpacity: 0.25,
                            // options per tree index, varying the different kinds of trees a little
                            treeOptions: [
                                undefined,
                                {
                                    treesPerForest: 25
                                },
                                {
                                    treesPerForest: 10,
                                    scale: 0.85
                                } // no options for tropical forests (index = 3)
                            ]
                        };
                        return [4 /*yield*/, Promise.all([generateMap(mapSize), loadTextureAtlas()])];
                    case 1:
                        _a = _b.sent(), map = _a[0], atlas = _a[1];
                        options.terrainAtlas = atlas;
                        mapView = new MapView_1.default();
                        mapView.zoom = initialZoom;
                        mapView.load(map, options);
                        controller = mapView.controller;
                        controller.debugOutput = document.getElementById("debug");
                        mapView.onLoaded = function () {
                            // uncover tiles around initial selection
                            setFogAround(mapView, mapView.selectedTile, 10, true, false);
                            setFogAround(mapView, mapView.selectedTile, 5, false, false);
                        };
                        mapView.onTileSelected = function (tile) {
                            // uncover tiles around selection
                            setFogAround(mapView, tile, 2, false, false);
                        };
                        return [2 /*return*/, mapView];
                }
            });
        });
    }
    exports.initView = initView;
    /**
     * @param fog whether there should be fog on this tile making it appear darker
     * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
     * @param range number of tiles around the given tile that should be updated
     * @param tile tile around which fog should be updated
     */
    function setFogAround(mapView, tile, range, fog, clouds) {
        var tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range);
        var updated = tiles.map(function (t) {
            t.fog = fog;
            t.clouds = clouds;
            return t;
        });
        mapView.updateTiles(updated);
    }
});
//# sourceMappingURL=view.js.map