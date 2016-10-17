define(["require", "exports", "./perlin", "./interfaces", "es6-promise", "./tile-grid"], function (require, exports, perlin_1, interfaces_1, es6_promise_1, tile_grid_1) {
    "use strict";
    function randomHeight(q, r) {
        var noise1 = perlin_1.simplex2(q / 10, r / 10);
        var noise2 = perlin_1.perlin2(q / 5, r / 5);
        var noise3 = perlin_1.perlin2(q / 30, r / 30);
        var noise = noise1 + noise2 + noise3;
        //if (Math.random() > 0.6) noise += 0.5
        return noise / 3.0 * 2.0;
    }
    /**
     * Generates are square map of the given size centered at (0,0).
     * @param size
     * @param heightAt
     * @param terrainAt
     */
    function generateMap(size, heightAt, terrainAt) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var tiles = [];
            for (var i = -size / 2; i < size / 2; i++) {
                for (var j = -size / 2; j < size / 2; j++) {
                    var q = i - j / 2 + ((-size / 2 + j) % 2) * 0.5;
                    var r = j;
                    var height = heightAt(q, r);
                    var terrain = terrainAt(q, r, height);
                    tiles.push({ q: q, r: r, height: height, terrain: terrain, fog: true, clouds: true, river: null });
                }
            }
            var grid = generateRivers(new tile_grid_1.default(tiles));
            tiles = grid.list();
            resolve(tiles);
        });
    }
    exports.generateMap = generateMap;
    function generateRandomMap(size, terrainAt) {
        perlin_1.seed(Math.random());
        return generateMap(size, randomHeight, terrainAt);
    }
    exports.generateRandomMap = generateRandomMap;
    function generateRivers(grid) {
        // find a few river spawn points, preferably in mountains
        var tiles = grid.list();
        var numRivers = 8;
        var spawns = [];
        var potentialSprings = tiles.filter(function (t) { return isAccessibleMountain(t, grid); });
        var m = 0;
        while (spawns.length < numRivers && m < potentialSprings.length - 1) {
            spawns.push(potentialSprings[m++]);
        }
        // grow the river towards the water by following the height gradient
        var rivers = spawns.map(growRiver);
        var riverIndex = 0;
        for (var _i = 0, rivers_1 = rivers; _i < rivers_1.length; _i++) {
            var river = rivers_1[_i];
            var riverTileIndex = 0;
            for (var _a = 0, river_1 = river; _a < river_1.length; _a++) {
                var tile = river_1[_a];
                tile.river = {
                    riverIndex: riverIndex++,
                    riverTileIndex: riverTileIndex++
                };
            }
        }
        return grid;
        function randomSpring() {
            var index = Math.floor(Math.random() * potentialSprings.length);
            return potentialSprings[index];
        }
        function growRiver(spawn) {
            var river = [spawn];
            var tile = spawn;
            while (!interfaces_1.isWater(tile.height) && river.length < 20) {
                var neighbors = sortByHeight(grid.neighbors(tile.q, tile.r)).filter(function (t) { return !contains(t, river); });
                if (neighbors.length == 0) {
                    console.info("Aborted river generation", river, tile);
                    return river;
                }
                var next = neighbors[0];
                river.push(next);
                tile = next;
            }
            return river;
        }
        function sortByHeight(tiles) {
            function sort(a, b) {
                return b.height - a.height;
            }
            var arr = [].concat(tiles);
            arr.sort(sort);
            return arr;
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
        var spring = interfaces_1.isMountain(tile.height) || interfaces_1.isHill(tile.height);
        return spring && ns.filter(function (t) { return interfaces_1.isLand(t.height); }).length > 3;
    }
});
