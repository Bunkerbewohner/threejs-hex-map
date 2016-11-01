import {simplex2, perlin2, seed} from "./perlin"
import {Height, TileData, isLand, isWater, isMountain, isHill} from "./interfaces"
import {Promise} from "es6-promise"
import TileGrid from "./tile-grid";
import {shuffle, qrRange} from "./util";
import Grid from './Grid';

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
                            terrainAt: (q: number, r: number, height: Height) => string): Promise<Grid<TileData>> {
    return new Promise((resolve, reject) => {        
        const grid = new Grid<TileData>(size, size).mapQR((q, r) => {
            const height = heightAt(q, r)
            const terrain = terrainAt(q, r, height)
            const trees = !isMountain(height) && !isWater(height) && Math.random() > 0.5
            return {q, r, height, terrain, fog: true, clouds: true, river: null, trees}
        })

        const withRivers = generateRivers(grid)

        resolve(withRivers)
    })
}

export function generateRandomMap(size: number, terrainAt: (q: number, r: number, height: Height) => string): Promise<Grid<TileData>> {
    seed(Math.random())
    return generateMap(size, randomHeight, terrainAt)
}

function generateRivers(grid: Grid<TileData>): Grid<TileData> {
    // find a few river spawn points, preferably in mountains
    const tiles = grid.toArray()
    const numRivers = Math.max(1, Math.round(Math.sqrt(grid.length) / 4)) 
    const spawns: TileData[] = shuffle(tiles.filter(t => isAccessibleMountain(t, grid))).slice(0, numRivers)

    // grow the river towards the water by following the height gradient
    const rivers = spawns.map(growRiver)

    let riverIndex = 0
    for (let river of rivers) {
        let riverTileIndex = 0
        for (let tile of river) {
            tile.river = {
                riverIndex: riverIndex,
                riverTileIndex: riverTileIndex++
            }
        }
        riverIndex++
    }

    return grid

    function growRiver(spawn: TileData): TileData[] {
        const river = [spawn]

        let tile = spawn

        while (!isWater(tile.height) && river.length < 20) {
            const neighbors = sortByHeight(grid.neighbors(tile.q, tile.r)).filter(t => !contains(t, river))
            if (neighbors.length == 0) {
                console.info("Aborted river generation", river, tile)
                return river
            }

            const next = neighbors[Math.max(neighbors.length - 1, Math.floor(Math.random() * 1.2))]
            river.push(next)

            tile = next
        }

        return river
    }

    function sortByHeight(tiles: TileData[]): TileData[] {
        function sort(a: TileData, b: TileData) {
            return b.height - a.height
        }

        const arr = [].concat(tiles)
        arr.sort(sort)

        return arr
    }

    function contains(t: TileData, ts: TileData[]) {
        for (let other of ts) {
            if (other.q == t.q && other.r == t.r) {
                return true
            }
        }
        return false
    }
}

function isAccessibleMountain(tile: TileData, grid: Grid<TileData>) {
    let ns = grid.neighbors(tile.q, tile.r)
    let spring = isMountain(tile.height)
    return spring && ns.filter(t => isLand(t.height)).length > 3
}