define(["require", "exports", "./perlin", "es6-promise"], function (require, exports, perlin_1, es6_promise_1) {
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
                    tiles.push({ q: q, r: r, height: height, terrain: terrain, fog: true, clouds: true });
                }
            }
            resolve(tiles);
        });
    }
    exports.generateMap = generateMap;
    function generateRandomMap(size, terrainAt) {
        perlin_1.seed(Math.random());
        return generateMap(size, randomHeight, terrainAt);
    }
    exports.generateRandomMap = generateRandomMap;
});
