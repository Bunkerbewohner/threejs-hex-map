import {simplex2, perlin2} from "./perlin"
import {Height, Tile} from "./interfaces"
import Map from "./map";

function randomHeight(q: number, r: number) {
    var noise1 = simplex2(q / 10, r / 10)
    var noise2 = perlin2(q / 5, r / 5)
    var noise3 = perlin2(q / 30, r / 30)

    var noise = noise1 + noise2 + noise3

    return noise / 3.0
}

export function generateMap(size: number, heightAt: (q: number, r: number) => Height) {
    var tiles: Tile[] = []

    for (var q = -size/2; q < size/2; q++) {
        for (var r = -size/2; r < size/2; r++) {
            var hex: Tile = {
                q: q - r/2 + ((-size/2 + r) % 2) * 0.5,
                r: r,
                height: heightAt(q, r),
                fog: true,
                clouds: true
            }
            tiles.push(hex);
        }
    }

    return new Map(size, tiles)
}

export function generateRandomMap(size: number) {
    return generateMap(size, randomHeight)
}