
import {TileData} from "./interfaces";
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
}