import {simplex2, perlin2, seed} from "./perlin"
import {Height, TileData} from "./interfaces"
import {Promise} from "es6-promise"

function randomHeight(q: number, r: number) {
    var noise1 = simplex2(q / 10, r / 10)
    var noise2 = perlin2(q / 5, r / 5)
    var noise3 = perlin2(q / 30, r / 30)
    var noise = noise1 + noise2 + noise3

    //if (Math.random() > 0.6) noise += 0.5

    return noise / 3.0 * 2.0
}

/**
 * Generates are square map of the given size centered at (0,0).
 * @param size
 * @param heightAt
 * @param terrainAt
 */
export function generateMap(size: number,
                            heightAt: (q: number, r: number) => Height,
                            terrainAt: (q: number, r: number, height: Height) => string): Promise<TileData[]> {
    return new Promise((resolve, reject) => {
        var tiles: TileData[] = []

        for (var i = -size / 2; i < size / 2; i++) {
            for (var j = -size / 2; j < size / 2; j++) {
                const q = i - j / 2 + ((-size / 2 + j) % 2) * 0.5
                const r = j
                const height = heightAt(q, r)
                const terrain = terrainAt(q, r, height)

                tiles.push({q, r, height, terrain, fog: true, clouds: true})
            }
        }

        resolve(tiles)
    })
}

export function generateRandomMap(size: number, terrainAt: (q: number, r: number, height: Height) => string): Promise<TileData[]> {
    seed(Math.random())
    return generateMap(size, randomHeight, terrainAt)
}