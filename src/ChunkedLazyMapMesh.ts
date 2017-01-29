import { Object3D, Vector2, Vector3, Sphere, Camera } from "three"
import { TileData, TextureAtlas, TileDataSource } from './interfaces';
import Grid from "./Grid";
import QuadTree from "./QuadTree";
import { qrToWorld, screenToWorld, qrToWorldX, qrToWorldY } from './coords';
import MapMesh from "./MapMesh";
import {BoundingBox} from "./BoundingBox";
import { range } from './util';
import { MapMeshOptions } from './MapMesh';


export default class ChunkedLazyMapMesh extends Object3D implements TileDataSource {
    private quadtree: QuadTree<MapThunk>
    private thunks: MapThunk[] = []

    readonly loaded: Promise<void>

    get numChunks(): number {
        return this.thunks.length
    }

    constructor(private tileGrid: Grid<TileData>, private options: MapMeshOptions) {
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

        const promises: Promise<void>[] = []

        // create a thunk for each chunk
        chunks.forEach((row, x) => {
            row.forEach((tiles, y) => {
                const thunk = new MapThunk(tiles, tileGrid, options)
                this.thunks.push(thunk)
                promises.push(thunk.loaded)
                thunk.load() // preload
                this.add(thunk)
            })
        })

        this.loaded = Promise.all(promises).then(() => null)
        this.quadtree = new QuadTree<MapThunk>(this.thunks, 1, (thunk: MapThunk) => thunk.computeCenter())        
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

    updateTiles(tiles: TileData[]) {
        this.thunks.forEach(thunk => thunk.updateTiles(tiles))
    }

    getTile(q: number, r: number) {
        const xy = qrToWorld(q, r)
        const queryBounds = new BoundingBox(xy, 1)
        const thunks = this.quadtree.queryRange(queryBounds)

        for (let thunk of thunks) {
            const tile = thunk.getTile(q, r)
            if (tile) {
                return tile
            }
        }

        return null
    }
}

class MapThunk extends Object3D implements TileDataSource {
    private _loaded = false
    private mesh: MapMesh

    private resolve: ()=>void

    readonly loaded: Promise<void> = new Promise<void>((resolve, reject) => {
        this.resolve = resolve
    })

    getTiles(): TileData[] {
        return this.tiles
    }

    getTile(q: number, r: number) {
        return this.mesh.getTile(q, r)
    }

    computeCenter(): Vector2 {
        const sphere = new Sphere()
        sphere.setFromPoints(this.tiles.map(tile => new Vector3(qrToWorldX(tile.q, tile.r), qrToWorldY(tile.q, tile.r))))
        return new Vector2(sphere.center.x, sphere.center.y)
    }

    constructor(private tiles: TileData[], private grid: Grid<TileData>, private options: MapMeshOptions) {
        super()
        this.frustumCulled = false
    }

    updateTiles(tiles: TileData[]) {
        if (!this.mesh) {
            this.load()
        }

        this.mesh.updateTiles(tiles)        
    }

    load() {
        if (!this._loaded) {
            this._loaded = true
            const mesh = this.mesh = new MapMesh(this.tiles, this.options, this.grid)
            mesh.frustumCulled = false

            this.add(mesh)
            this.resolve()
        }
    }

    updateVisibility(value: boolean) {
        if (value && !this._loaded) {
            this.load()
        }
        this.visible = value
    }
}