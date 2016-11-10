import { TileData, isLand, isWater, isMountain, TextureAtlas, isHill } from './interfaces';
import {createHexagon} from "./hexagon"
import {
    InstancedBufferGeometry,
    RawShaderMaterial,
    BufferGeometry,
    Vector2,
    Vector3,
    Vector4,
    Texture,
    Mesh,
    Group,
    TextureLoader,
    XHRLoader,
    BufferAttribute,
    Sphere
} from "three"
import {Promise} from "es6-promise"
import { loadFile, qrRange, loadTexture } from './util';
import TileGrid from "./tile-grid";
import Trees from './trees';
import { qrToWorld } from './coords';
import Grid from "./Grid";

const textureLoader = new TextureLoader()

export default class MapMesh extends Group {

    static landShaders = {
        fragmentShader: loadFile("../../src/shaders/land.fragment.glsl"),
        vertexShader: loadFile("../../src/shaders/land.vertex.glsl")
    }

    static waterShaders = {
        fragmentShader: loadFile("../../src/shaders/water.fragment.glsl"),
        vertexShader: loadFile("../../src/shaders/water.vertex.glsl")
    }

    static mountainShaders = {
        fragmentShader: loadFile("../../src/shaders/mountains.fragment.glsl"),
        vertexShader: loadFile("../../src/shaders/mountains.vertex.glsl")
    }

    private tileGrid: Grid<TileData>
    private coastAtlas: Texture
    private riverAtlas: Texture
    private terrainDiffuseMap: Texture
    private hillsNormalMap: Texture

    private land: Mesh
    //private water: Mesh
    private mountains: Mesh

    boundingSphere: Sphere

    constructor(private _tiles: TileData[], grid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        this.tileGrid = grid
        this.coastAtlas = textureLoader.load("textures/coast-diffuse.png")
        this.riverAtlas = textureLoader.load("textures/river-diffuse.png")
        this.terrainDiffuseMap = textureLoader.load(_textureAtlas.image)
        this.hillsNormalMap = textureLoader.load("textures/hills-normal.png")
        this.hillsNormalMap.wrapS = this.hillsNormalMap.wrapT = THREE.RepeatWrapping

        Promise.all([
            this.createLandMesh(_tiles.filter(t => !isMountain(t.height))),            
            this.createMountainMesh(_tiles.filter(t => isMountain(t.height)))
            //this.createWaterMesh(_tiles.filter(t => isWater(t.height))) 
        ]).then(() => {
            this.computeBoundingSphere()
            this.createTrees()
        }).catch((err) => {
            console.error(err)
        })
    }

    private createTrees() {
        const trees = new Trees(this._tiles, this.tileGrid)
        this.add(trees)
    }

    private computeBoundingSphere() {
        const bs = this.boundingSphere = new Sphere()
        const childrenBounds = [this.land, this.mountains].map(x => x.geometry.boundingSphere)

        const pts = [].concat(...childrenBounds.map(bounds => {
            return [
                bounds.center.clone().sub(new Vector3(bounds.radius, bounds.radius, 0)),
                bounds.center.clone().add(new Vector3(bounds.radius, bounds.radius, 0))
            ]
        }))

        bs.setFromPoints(pts)
    }

    createLandMesh(tiles: TileData[]) {
        const vertexShader = MapMesh.landShaders.vertexShader
        const fragmentShader = MapMesh.landShaders.fragmentShader
        const atlas = this._textureAtlas

        return Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, this.tileGrid, 0, this._textureAtlas)
            const material = new THREE.RawShaderMaterial({
                uniforms: {
                    sineTime: {value: 0.0},
                    camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                    texture: {type: "t", value: this.terrainDiffuseMap},
                    textureAtlasMeta: {
                        type: "4f",
                        value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                    },
                    hillsNormal: {
                        type: "t",
                        value: this.hillsNormalMap
                    },
                    coastAtlas: {
                        type: "t",
                        value: this.coastAtlas
                    },
                    riverAtlas: {
                        type: "t",
                        value: this.riverAtlas
                    }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.FrontSide,
                wireframe: false,
                transparent: false
            })

            this.land = new Mesh(geometry, material)
            this.add(this.land)
        })
    }

    createWaterMesh(tiles: TileData[]) {
    }

    createMountainMesh(tiles: TileData[]) {
        const vertexShader = MapMesh.mountainShaders.vertexShader
        const fragmentShader = MapMesh.mountainShaders.fragmentShader
        const atlas = this._textureAtlas

        return Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, this.tileGrid, 1, this._textureAtlas)
            const material = new THREE.RawShaderMaterial({
                uniforms: {
                    sineTime: {value: 0.0},
                    camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                    texture: {type: "t", value: this.terrainDiffuseMap},
                    textureAtlasMeta: {
                        type: "4f",
                        value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                    },
                    hillsNormal: {
                        type: "t",
                        value: this.hillsNormalMap
                    }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.FrontSide,
                wireframe: false,
                transparent: false
            })

            this.mountains = new Mesh(geometry, material)
            this.add(this.mountains)
        })
    }
}

function createHexagonTilesGeometry(tiles: TileData[], grid: Grid<TileData>, numSubdivisions: number, textureAtlas: TextureAtlas) {
    const hexagon = createHexagon(1.0, numSubdivisions)
    const geometry = new InstancedBufferGeometry()

    geometry.maxInstancedCount = tiles.length
    geometry.addAttribute("position", (hexagon.attributes as any).position)
    geometry.addAttribute("uv", (hexagon.attributes as any).uv)
    geometry.addAttribute("border", (hexagon.attributes as any).border)

    // positions for each hexagon tile
    var tilePositions: Vector2[] = tiles.map((tile) => new Vector2(Math.sqrt(3) * (tile.q + tile.r / 2), 3 / 2 * tile.r))
    var posAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 3), 2, 1)
    posAttr.copyVector2sArray(tilePositions)
    geometry.addAttribute("offset", posAttr)

    //----------------
    const cellSize = textureAtlas.cellSize
    const cellSpacing = textureAtlas.cellSpacing
    const numColumns = textureAtlas.width / cellSize

    var styles = tiles.map(function (tile) {
        const cell = textureAtlas.textures[tile.terrain]

        const cellIndex = cell.cellY * numColumns + cell.cellX
        const shadow = tile.fog             ? 1 : 0
        //const clouds = tile.clouds          ? 1 << 1 : 0
        const hills = isHill(tile.height)   ? 1 : 0
        const style = shadow * 1 + hills * 10

        // Coast and River texture index
        const coastIdx = computeCoastTextureIndex(grid, tile)
        const riverIdx = computeRiverTextureIndex(grid, tile)

        return new Vector4(cellIndex, style, coastIdx, riverIdx)
    })

    var styleAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 4), 4, 1)
    styleAttr.copyVector4sArray(styles)
    geometry.addAttribute("style", styleAttr)

    geometry.boundingSphere = new THREE.Sphere()
    geometry.boundingSphere.setFromPoints(tilePositions.map(pos => new THREE.Vector3(pos.x, pos.y, 0)))

    return geometry
}

function computeCoastTextureIndex(grid: Grid<TileData>, tile: TileData): number {
    function isWaterTile(q: number, r: number) {
        const t = grid.get(q, r)
        if (!t) return false
        return isWater(t.height)
    }

    function bit(x: boolean) {
        return x ? "1" : "0"
    }

    if (isWaterTile(tile.q, tile.r)) {
        // only land tiles have a coast
        return 0
    }

    const NE = bit(isWaterTile(tile.q + 1, tile.r - 1))
    const E = bit(isWaterTile(tile.q + 1, tile.r))
    const SE = bit(isWaterTile(tile.q, tile.r + 1))
    const SW = bit(isWaterTile(tile.q - 1, tile.r + 1))
    const W = bit(isWaterTile(tile.q - 1, tile.r))
    const NW = bit(isWaterTile(tile.q, tile.r - 1))

    return parseInt(NE + E + SE + SW + W + NW, 2)
}

function isNextOrPrevRiverTile(grid: Grid<TileData>, tile: TileData, q: number, r: number) {
    const neighbor = grid.get(q, r)
    
    if (neighbor && neighbor.river && tile && tile.river) {        
        return tile.river.riverIndex == neighbor.river.riverIndex && Math.abs(tile.river.riverTileIndex - neighbor.river.riverTileIndex) == 1
    } else {
        return false
    }
}

function computeRiverTextureIndex(grid: Grid<TileData>, tile: TileData): number {
    if (!tile.river) return 0

    const NE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r - 1))
    const E = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q + 1, tile.r))
    const SE = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r + 1))
    const SW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r + 1))
    const W = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q - 1, tile.r))
    const NW = bitStr(isNextOrPrevRiverTile(grid, tile, tile.q, tile.r - 1))

    const combination = NE + E + SE + SW + W + NW
    return parseInt(combination, 2)
}

function bitStr(x: boolean): string {
    return x ? "1": "0"
}