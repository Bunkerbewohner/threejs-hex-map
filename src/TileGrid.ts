import {TileData} from "./interfaces";
import {qrRange} from "./util";

export default class TileGrid {

    private grid: TileData[][] = []

    constructor(private _tiles: TileData[]) {
        for (let tile of _tiles) {
            if (typeof this.grid[tile.q] == "undefined") {
                this.grid[tile.q] = []
            }

            this.grid[tile.q][tile.r] = tile
        }
    }

    get(q: number, r: number): TileData {
        if (typeof this.grid[q] == "undefined") return null
        else if (typeof this.grid[q][r] == "undefined") return null
        return this.grid[q][r]
    }

    neighbors(q: number, r: number): TileData[] {
        return qrRange(1).map(qr => {
            return this.get(q + qr.q, r + qr.r)
        }).filter(x => x != null)
    }

    list(): TileData[] {
        const tiles: TileData[] = []

        for (let i in this.grid) {
            for (let j in this.grid[i]) {
                const tile = this.grid[i][j]
                if (tile) {
                    tiles.push(tile)
                }
            }
        }

        return tiles
    }
}