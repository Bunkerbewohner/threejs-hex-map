import { Object3D, Vector2, Vector3, Sphere } from "three"
import {TileData, TextureAtlas} from "./interfaces";
import Grid from "./Grid";
import Camera = THREE.Camera;
import QuadTree from "./QuadTree";
import { qrToWorld, screenToWorld, qrToWorldX, qrToWorldY } from './coords';
import MapMesh from "./MapMesh";
import {BoundingBox} from "./BoundingBox";
import { range } from './util';


export default class ChunkedLazyMapMesh extends Object3D {
    private quadtree: QuadTree<MapThunk>
    private thunks: MapThunk[] = []

    get numChunks(): number {
        return this.thunks.length
    }

    constructor(private tileGrid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        // we're gonna handle frustrum culling ourselves
        this.frustumCulled = false

        // calculate size of map chunks so that there are at least 4 or each chunk contains 32^2 tiles
        const chunkSize = Math.min((tileGrid.width * tileGrid.height) / 4, Math.pow(32, 2))
        const chunkWidth = Math.ceil(Math.sqrt(chunkSize))
        const numChunksX = Math.ceil(tileGrid.width / chunkWidth)
        const numChunksY = Math.ceil(tileGrid.height / chunkWidth)
        const chunks: TileData[][][] = range(numChunksX).map(x => range(numChunksY).map(_ => []))

        // assign tiles to cells in the coarser chunk grid
        tileGrid.forEachIJ((i, j, q, r, tile) => {
            const bx = Math.floor((i / tileGrid.width) * numChunksX)
            const by = Math.floor((j / tileGrid.height) * numChunksY)
            chunks[bx][by].push(tile)
        })

        // create a thunk for each chunk
        chunks.forEach((row, x) => {
            row.forEach((tiles, y) => {
                const thunk = new MapThunk(tiles, tileGrid, _textureAtlas)
                this.thunks.push(thunk)
                this.add(thunk)
            })
        })

        let tree = this.quadtree = new QuadTree<MapThunk>(this.thunks, 1, (thunk: MapThunk) => thunk.computeCenter())
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
        this.thunks.forEach(thunk => thunk.updateVisibility(false))
        this.quadtree.queryRange(boundingBox).forEach(thunk => thunk.updateVisibility(true))
    }
}

class MapThunk extends Object3D {
    private loaded = false
    private mesh: MapMesh

    getTiles(): TileData[] {
        return this.tiles
    }

    computeCenter(): Vector2 {
        const sphere = new Sphere()
        sphere.setFromPoints(this.tiles.map(tile => new Vector3(qrToWorldX(tile.q, tile.r), qrToWorldY(tile.q, tile.r))))
        return new Vector2(sphere.center.x, sphere.center.y)
    }

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