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
define(["require", "exports", "./perlin", "./interfaces", "./util", "./Grid", "./hexagon"], function (require, exports, perlin_1, interfaces_1, util_1, Grid_1, hexagon_1) {
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
        rivers.forEach(function (river, riverIndex) {
            river.forEach(function (tile, riverTileIndex) {
                if (riverTileIndex < river.length - 1) {
                    tile.river = { riverIndex: riverIndex, riverTileIndex: riverTileIndex };
                }
            });
        });
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
});
//# sourceMappingURL=map-generator.js.map