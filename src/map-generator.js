define(["require", "exports", "./perlin", "es6-promise"], function (require, exports, perlin_1, es6_promise_1) {
    "use strict";
    function randomHeight(q, r) {
        var noise1 = perlin_1.simplex2(q / 10, r / 10);
        var noise2 = perlin_1.perlin2(q / 5, r / 5);
        var noise3 = perlin_1.perlin2(q / 30, r / 30);
        var noise = noise1 + noise2 + noise3;
        return noise / 3.0;
    }
    /**
     * Generates are square map of the given size centered at (0,0).
     * @param size
     * @param heightAt
     */
    function generateMap(size, heightAt) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var tiles = [];
            for (var q = -size / 2; q < size / 2; q++) {
                for (var r = -size / 2; r < size / 2; r++) {
                    var hex = {
                        q: q - r / 2 + ((-size / 2 + r) % 2) * 0.5,
                        r: r,
                        height: heightAt(q, r),
                        fog: true,
                        clouds: true
                    };
                    tiles.push(hex);
                }
            }
            resolve(tiles);
        });
    }
    exports.generateMap = generateMap;
    function generateRandomMap(size) {
        perlin_1.seed(Math.random());
        return generateMap(size, randomHeight);
    }
    exports.generateRandomMap = generateRandomMap;
});
