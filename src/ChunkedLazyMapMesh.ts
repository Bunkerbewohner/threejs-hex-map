import { Object3D } from "three"
import {TileData, TextureAtlas} from "./interfaces";
import Grid from "./Grid";
import Camera = THREE.Camera;
import QuadTree from "./QuadTree";
import {qrToWorld} from "./coords";
import MapMesh from "./MapMesh";

export default class ChunkedLazyMapMesh extends Object3D {
    private quadtree: QuadTree<MapThunk>
    private thunks: MapThunk[] = []

    constructor(private tileGrid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        // we're gonna handle frustrum culling ourselves
        //this.frustumCulled = false

        // create chunks
        const chunkSize = Math.min((tileGrid.width * tileGrid.height) / 4, 64)
        let tree = new QuadTree<TileData>(tileGrid.toArray(), chunkSize, (tile: TileData) => qrToWorld(tile.q, tile.r))

        this.quadtree = tree.mapReduce(tiles => {
            const thunk = new MapThunk(tiles, tileGrid, _textureAtlas)
            this.thunks.push(thunk)
            console.log(tiles, thunk)
            return thunk
        })

        this.thunks.forEach(thunk => this.add(thunk))
    }

    /**
     * Adjusts visibility of chunks so that only map parts that can actually be seen by the camera are rendered.
     * @param camera the camera to use for visibility checks
     */
    updateVisibility(camera: Camera) {

    }
}

class MapThunk extends Object3D {
    constructor(private tiles: TileData[], private grid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        this.add(new MapMesh(tiles, grid, _textureAtlas))
    }
}