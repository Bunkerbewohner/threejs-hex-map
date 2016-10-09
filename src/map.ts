import { TileData, TextureAtlas } from './interfaces';
import MapMesh from './map-mesh';

export default class Map {
    private grid: {[q: number]: {[r: number]: TileData}} = {}
    private buckets: {[modq: number]: {[modr: number]: Bucket}}
    private bucketList: Bucket[];

    gridGet(q: number, r: number): TileData | undefined {
        return this.grid[q] ? this.grid[q][r] : undefined
    }

    private assignGrid(tile: TileData) {
        const {q, r} = tile
        if (!this.grid[q]) {
            this.grid[q] = []
        }
        
        this.grid[q][r] = tile
    }

    private qrToBucketQr(q: number, r: number): {q: number, r: number} {
        return {
            q: q % this.bucketSize.q,
            r: r % this.bucketSize.r
        }
    }

    private assignBucket(tile: TileData): Bucket {
        const {q,r} = this.qrToBucketQr(tile.q, tile.r)

        if (!this.buckets[q]) {
            this.buckets[q] = []
        }

        if (!this.buckets[q][r]) {
            this.buckets[q][r] = new Bucket(q, r)
        }

        const bucket = this.buckets[q][r]
        bucket.addTile(tile)

        return bucket
    }

    constructor(tiles: TileData[], private bucketSize = {q: 20, r: 16}) {
        tiles.forEach(this.assignGrid)
        this.bucketList = tiles.map(this.assignBucket)
    }

    build(textures: TextureAtlas) {
        this.bucketList.forEach(bucket => bucket.build(textures))
    }

    getBucket(q: number, r: number): Bucket | undefined {
        const qrMod = this.qrToBucketQr(q, r)
        if (!this.buckets[qrMod.q]) return undefined
        return this.buckets[qrMod.q][qrMod.r]
    }
}

class Bucket {
    qMod: number;
    rMod: number;
    tiles: TileData[];
    mesh: MapMesh;
    textures: TextureAtlas;
    
    private _built = false

    get built(): boolean {
        return this._built
    }

    constructor(qMod: number, rMod: number) {
        this.qMod = qMod
        this.rMod = rMod
    }

    addTile(tile: TileData) {
        if (this._built) {
            throw new Error("Cannot add tiles to built bucket")
        }
        this.tiles.push(tile)
    }

    build(textures: TextureAtlas) {
        this.textures = textures        
        this._built = false // lazy
    }

    show() {
        if (!this.built) {
            this.mesh = new MapMesh(this.tiles, this.textures)
        }
        this.mesh.visible = true
    }
}