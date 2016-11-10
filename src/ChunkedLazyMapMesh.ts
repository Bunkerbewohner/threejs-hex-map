import { Object3D } from "three"
import {TileData, TextureAtlas} from "./interfaces";
import Grid from "./Grid";
import Camera = THREE.Camera;
import QuadTree from "./QuadTree";
import {qrToWorld, screenToWorld} from "./coords";
import MapMesh from "./MapMesh";
import {BoundingBox} from "./BoundingBox";
import Vector2 = THREE.Vector2;
import Vector3 = THREE.Vector3;

export default class ChunkedLazyMapMesh extends Object3D {
    private quadtree: QuadTree<MapThunk>
    private thunks: MapThunk[] = []

    get numChunks(): number {
        return this.thunks.length
    }

    constructor(private tileGrid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        // we're gonna handle frustrum culling ourselves
        //this.frustumCulled = false

        // create chunks
        const chunkSize = Math.min((tileGrid.width * tileGrid.height) / 4, Math.pow(64, 2))
        let tree = new QuadTree<TileData>(tileGrid.toArray(), chunkSize, (tile: TileData) => qrToWorld(tile.q, tile.r))

        this.quadtree = tree.mapReduce(tiles => {
            const thunk = new MapThunk(tiles, tileGrid, _textureAtlas)
            this.thunks.push(thunk)
            return thunk
        })

        this.thunks.forEach(thunk => this.add(thunk))
    }

    /**
     * Adjusts visibility of chunks so that only map parts that can actually be seen by the camera are rendered.
     * @param camera the camera to use for visibility checks
     */
    updateVisibility(camera: Camera) {
        const min = screenToWorld(0, 0, camera)
        const max = screenToWorld(window.innerWidth, window.innerHeight, camera)
        const center = new Vector3().addVectors(min, max).multiplyScalar(0.5)
        const size = Math.max(max.x - min.x, max.y - min.y)

        const boundingBox = new BoundingBox(new Vector2(center.x, center.y), size*2)
        this.thunks.forEach(thunk => thunk.visible = false)
        this.quadtree.queryRange(boundingBox).forEach(thunk => thunk.updateVisibility(true))
    }
}

class MapThunk extends Object3D {
    private loaded = false
    private mesh: MapMesh

    constructor(private tiles: TileData[], private grid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()
        this.frustumCulled = false
    }

    load() {
        if (!this.loaded) {
            this.loaded = true
            const mesh = this.mesh = new MapMesh(this.tiles, this.grid, this._textureAtlas)
            mesh.frustumCulled = false

            this.add(mesh)
        }
    }

    updateVisibility(value: boolean) {
        if (value && !this.loaded) {
            this.load()
        }
        this.visible = value
    }
}