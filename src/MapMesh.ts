import { TileData, isLand, isWater, isMountain, TextureAtlas, isHill, TileDataSource } from './interfaces';
import {createHexagon} from "./hexagon"
import {
    InstancedBufferGeometry,
    InstancedBufferAttribute,
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
import { loadFile, qrRange, loadTexture } from './util';
import Trees from './trees';
import { qrToWorld } from './coords';
import Grid from "./Grid";

const textureLoader = new TextureLoader()

export interface MapMeshOptions {
    diffuseMap: TextureAtlas;
    cloudTexture: string;
    hillsNormalMap: string;
}

interface MapMeshTile extends TileData {
    /**
     * Index of this tile in its vertex buffer
     */
    bufferIndex: number;

    isMountain: boolean;
}

export default class MapMesh extends Group implements TileDataSource {

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

    static coastAtlas = textureLoader.load("textures/coast-diffuse.png")
    static riverAtlas = textureLoader.load("textures/river-diffuse.png")
    static hillsNormal = textureLoader.load("textures/hills-normal.png")
    static textureAtlas: Texture

    /**
     * List of tiles displayed in this mesh
     */
    private tiles: MapMeshTile[]

    /**
     * Grid of the tiles displayed in this mesh containing the same elements as this.tiles
     */
    private localGrid: Grid<MapMeshTile>

    /**
     * Global grid of all tiles, even the ones not displayed in this mesh
     */
    private globalGrid: Grid<TileData>

    private coastAtlas: Texture
    private riverAtlas: Texture
    private terrainDiffuseMap: Texture
    private hillsNormalMap: Texture

    private land: Mesh
    //private water: Mesh
    private mountains: Mesh

    boundingSphere: Sphere

    readonly loaded: Promise<void>

    /**
     * @param _tiles the tiles to actually render in this mesh
     * @param grid the grid with all tiles, including the ones that are not rendered in this mesh
     */
    constructor(tiles: TileData[], grid: Grid<TileData>, private _textureAtlas: TextureAtlas) {
        super()

        if (!MapMesh.textureAtlas) {
            MapMesh.textureAtlas = textureLoader.load(_textureAtlas.image)
        }

        this.tiles = tiles.map(t => ({
            bufferIndex: -1,
            isMountain: isMountain(t.height),
            ...t
        }))

        this.localGrid = new Grid<MapMeshTile>(0, 0).init(this.tiles)
        this.globalGrid = grid
        this.coastAtlas = MapMesh.coastAtlas
        this.riverAtlas = MapMesh.riverAtlas
        this.terrainDiffuseMap = MapMesh.textureAtlas
        this.hillsNormalMap = MapMesh.hillsNormal
        this.hillsNormalMap.wrapS = this.hillsNormalMap.wrapT = THREE.RepeatWrapping

        this.loaded = Promise.all([
            this.createLandMesh(this.tiles.filter(t => !t.isMountain)),            
            this.createMountainMesh(this.tiles.filter(t => t.isMountain))
            //this.createWaterMesh(_tiles.filter(t => isWater(t.height))) 
        ]).then(() => {   
            setTimeout(() => {
                this.createTrees()
            }, 250)            
        }).catch((err) => {
            console.error(err)
        })
    }

    updateTiles(tiles: TileData[]) {
        this.updateFogAndClouds(tiles)
    }

    getTile(q: number, r: number) {
        return this.localGrid.get(q, r)
    }
    
    /**
     * Updates only fog and clouds visualization of existing tiles.
     * @param tiles changed tiles
     */
    updateFogAndClouds(tiles: TileData[]) {
        const landGeometry = this.land.geometry as InstancedBufferGeometry
        const landStyleAttr = landGeometry.getAttribute("style") as InstancedBufferAttribute
        const mountainsGeometry = this.mountains.geometry as InstancedBufferGeometry
        const mountainsStyleAttr = mountainsGeometry.getAttribute("style") as InstancedBufferAttribute

        tiles.forEach(updated => {            
            const old = this.localGrid.get(updated.q, updated.r)            
            if (!old) return

            if (updated.fog != old.fog) {
                old.fog = updated.fog
                const attribute = old.isMountain ? mountainsStyleAttr : landStyleAttr
                this.updateFogStyle(attribute, old.bufferIndex, updated.fog)
            }
        })

        landStyleAttr.needsUpdate = true
        mountainsStyleAttr.needsUpdate = true
    }

    private updateFogStyle(attr: InstancedBufferAttribute, index: number, fog: boolean) {
        const style = attr.getY(index)
        const fogMask = 0b1
        const newStyle = fog ? (style | fogMask) : (style & ~fogMask)

        console.log("Updating style from " + style + " to " + newStyle)

        attr.setY(index, newStyle)
    }

    private createTrees() {
        const trees = new Trees(this.tiles, this.globalGrid)
        this.add(trees)
    }

    private createLandMesh(tiles: MapMeshTile[]) {
        const vertexShader = MapMesh.landShaders.vertexShader
        const fragmentShader = MapMesh.landShaders.fragmentShader
        const atlas = this._textureAtlas

        return Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 0, this._textureAtlas)
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
            this.land.frustumCulled = false

            this.add(this.land)
        })
    }

    private createWaterMesh(tiles: TileData[]) {
    }

    private createMountainMesh(tiles: MapMeshTile[]) {
        const vertexShader = MapMesh.mountainShaders.vertexShader
        const fragmentShader = MapMesh.mountainShaders.fragmentShader
        const atlas = this._textureAtlas

        return Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 1, this._textureAtlas)
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
            this.mountains.frustumCulled = false            

            this.add(this.mountains)
        })
    }
}

function createHexagonTilesGeometry(tiles: MapMeshTile[], grid: Grid<TileData>, numSubdivisions: number, textureAtlas: TextureAtlas) {
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

    var styles = tiles.map(function (tile, index) {
        const cell = textureAtlas.textures[tile.terrain]

        const cellIndex = cell.cellY * numColumns + cell.cellX
        const shadow = tile.fog             ? 1 : 0
        //const clouds = tile.clouds          ? 1 << 1 : 0
        const hills = isHill(tile.height)   ? 1 : 0
        const style = shadow * 1 + hills * 10

        // Coast and River texture index
        const coastIdx = computeCoastTextureIndex(grid, tile)
        const riverIdx = computeRiverTextureIndex(grid, tile)

        tile.bufferIndex = index

        return new Vector4(cellIndex, style, coastIdx, riverIdx)
    })

    var styleAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 4), 4, 1)
    styleAttr.copyVector4sArray(styles)
    geometry.addAttribute("style", styleAttr)

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