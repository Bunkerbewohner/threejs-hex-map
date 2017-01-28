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
    Sphere,
    RepeatWrapping
} from "three"
import { loadFile, qrRange, loadTexture } from './util';
import Trees from './trees';
import { qrToWorld } from './coords';
import Grid from "./Grid";
import { LAND_FRAGMENT_SHADER } from './shaders/land.fragment';
import { LAND_VERTEX_SHADER } from './shaders/land.vertex';
import { MOUNTAINS_FRAGMENT_SHADER } from './shaders/mountains.fragment';
import { MOUNTAINS_VERTEX_SHADER } from './shaders/mountains.vertex';
import Forests from "./Forests";

export interface MapMeshOptions {

    /**
     * Texture containing the sub textures referenced in the terrain texture atlas.
     */
    terrainAtlasTexture: Texture;

    /**
     * Texture atlas describing the sub textures for each terrain type.
     */
    terrainAtlas: TextureAtlas;

    /**
     * Texture with blend masks for transitions between terrains
     */
    transitionTexture: Texture;

    /**
     * River tile atlas texture containing parts for each possible river variation.
     * Use /tools/river-atlas.py to generate.
     */
    riverAtlasTexture: Texture;

    /**
     * Coast tile atlas texture containg parts for each possible coast variation. 
     * Use /tools/coast-atlas.py to generate.
     */
    coastAtlasTexture: Texture;

    /**
     * The texture used for undiscovered tiles
     */
    undiscoveredTexture: Texture; 

    /**
     * Normal map for hills
     */
    hillsNormalTexture: Texture;

    /**
     * Diffuse map for tree sprites
     */
    treeSpritesheet: Texture;

    /**
     * Number of horizontal and vertical spritesheet subdivisions
     */
    treeSpritesheetSubdivisions: number;

    /**
     * Default 1.0
     */
    treeSize?: number;

    /**
     * Default 50
     */
    treesPerForest?: number;

    /**
     * Overall scale of the geometry. Default 1.0
     */
    scale?: number;

    /**
     * GLSL code of the land fragment shader. For default see /src/shaders/land.fragment.ts.
     */
    landFragmentShader?: string;

    /**
     * GLSL code of the land vertex shader. For default see /src/shaders/land.vertex.ts.
     */
    landVertexShader?: string;

    /**
     * GLSL code of the mountain fragment shader. For default see /src/shaders/mountains.fragment.ts.
     */
    mountainsFragmentShader?: string;

    /**
     * GLSL code of the mountain vertex shader. For default see /src/shaders/mountains.vertex.ts.
     */
    mountainsVertexShader?: string;
}

export interface MapMeshTile extends TileData {
    /**
     * Index of this tile in its vertex buffer
     */
    bufferIndex: number;

    isMountain: boolean;
}

export interface TextureReplacements {
    terrainAtlasTexture?: Texture;
    riverAtlasTexture?: Texture;
    coastAtlasTexture?: Texture;
    undiscoveredTexture?: Texture;
    treeTexture?: Texture;
}

export default class MapMesh extends Group implements TileDataSource {

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

    private land: Mesh
    private mountains: Mesh
    private trees: Forests

    boundingSphere: Sphere

    readonly loaded: Promise<void>

    private _showGrid = true

    get showGrid() {
        return this._showGrid
    }

    set showGrid(value: boolean) {
        this._showGrid = value

        const landMaterial: any = this.land.material
        landMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0

        const mountainMaterial: any = this.mountains.material
        mountainMaterial.uniforms.showGrid.value = value ? 1.0 : 0.0
    }

    /**
     * @param tiles the tiles to actually render in this mesh
     * @param globalGrid the grid with all tiles, including the ones that are not rendered in this mesh
     * @param options map mesh configuration options
     */
    constructor(tiles: TileData[], private options: MapMeshOptions, globalGrid?: Grid<TileData>) {
        super()

        // use default shaders if none are provided
        if (!options.landFragmentShader) {
            options.landFragmentShader = LAND_FRAGMENT_SHADER
        }

        if (!options.landVertexShader) {
            options.landVertexShader = LAND_VERTEX_SHADER
        }

        if (!options.mountainsFragmentShader) {
            options.mountainsFragmentShader = MOUNTAINS_FRAGMENT_SHADER
        }

        if (!options.mountainsVertexShader) {
            options.mountainsVertexShader = MOUNTAINS_VERTEX_SHADER
        }

        // local, extended copy of tile data
        this.tiles = tiles.map(t => ({
            bufferIndex: -1,
            isMountain: isMountain(t.height),
            ...t
        }))

        this.localGrid = new Grid<MapMeshTile>(0, 0).init(this.tiles)
        this.globalGrid = globalGrid || this.localGrid

        options.hillsNormalTexture.wrapS = options.hillsNormalTexture.wrapT = RepeatWrapping
        options.terrainAtlasTexture.wrapS = options.terrainAtlasTexture.wrapT = RepeatWrapping
        options.undiscoveredTexture.wrapS = options.undiscoveredTexture.wrapT = RepeatWrapping
        //options.transitionTexture.flipY = true

        this.loaded = Promise.all([
            this.createLandMesh(this.tiles.filter(t => !t.isMountain)),            
            this.createMountainMesh(this.tiles.filter(t => t.isMountain)),
            this.createTrees()
        ]).catch((err) => {
            console.error("Could not create MapMesh", err)
        })
    }

    /**
     * "Hot-swaps" the given textures.
     * @param textures
     */
    replaceTextures(textures: TextureReplacements) {
        for (let name in textures) {
            const replacement: Texture = (textures as any)[name]
            if (replacement) {
                const old: Texture = (this.options as any)[name]
                const {wrapT, wrapS} = old

                old.copy(replacement)
                old.wrapT = wrapT
                old.wrapS = wrapS
                old.needsUpdate = true
            }
        }
    }

    updateTiles(tiles: TileData[]) {
        this.updateFogAndClouds(tiles)
        this.trees.updateTiles(tiles)
    }

    getTile(q: number, r: number): TileData {
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

            if (updated.fog != old.fog || updated.clouds != old.clouds) {
                old.fog = updated.fog
                old.clouds = updated.clouds
                const attribute = old.isMountain ? mountainsStyleAttr : landStyleAttr
                this.updateFogStyle(attribute, old.bufferIndex, updated.fog, updated.clouds)
            }
        })

        landStyleAttr.needsUpdate = true
        mountainsStyleAttr.needsUpdate = true        
    }

    private updateFogStyle(attr: InstancedBufferAttribute, index: number, fog: boolean, clouds: boolean) {
        const style = attr.getY(index)
        const fogMask = 0b1
        const newStyle = fog ? (style | fogMask) : (style & ~fogMask)
        const withClouds = !clouds ? newStyle % 100 : 100 + newStyle

        attr.setY(index, withClouds)
    }

    private async createTrees() {
        //const trees = this.trees = new Trees(this.tiles, this.globalGrid, this.options)
        const trees = this.trees = new Forests(this.tiles, this.globalGrid, {
            treeSize: this.options.treeSize || 1.44,
            spritesheet: this.options.treeSpritesheet,
            spritesheetSubdivisions: this.options.treeSpritesheetSubdivisions,
            treesPerForest: this.options.treesPerForest || 50,
            mapScale: this.options.scale || 1.0
        })
        this.add(trees)
    }

    private async createLandMesh(tiles: MapMeshTile[]) {
        const atlas = this.options.terrainAtlas
        const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 0, this.options)
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                sineTime: {value: 0.0},
                showGrid: {value: this._showGrid ? 1.0 : 0.0},
                camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                texture: {type: "t", value: this.options.terrainAtlasTexture},
                textureAtlasMeta: {
                    type: "4f",
                    value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                },
                hillsNormal: {
                    type: "t",
                    value: this.options.hillsNormalTexture
                },
                coastAtlas: {
                    type: "t",
                    value: this.options.coastAtlasTexture
                },
                riverAtlas: {
                    type: "t",
                    value: this.options.riverAtlasTexture
                },
                mapTexture: {
                    type: "t",
                    value: this.options.undiscoveredTexture
                },
                transitionTexture: {
                    type: "t",
                    value: this.options.transitionTexture
                },
                lightDir: {
                    type: "v3",
                    value: new THREE.Vector3(0.5, 0.6, -0.5).normalize()
                }
            },
            vertexShader: this.options.landVertexShader,
            fragmentShader: this.options.landFragmentShader,
            side: THREE.FrontSide,
            wireframe: false,
            transparent: false
        })

        this.land = new Mesh(geometry, material)
        this.land.frustumCulled = false

        this.add(this.land)
    }

    private async createMountainMesh(tiles: MapMeshTile[]) {
        const atlas = this.options.terrainAtlas
        const geometry = createHexagonTilesGeometry(tiles, this.globalGrid, 1, this.options)
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                sineTime: {value: 0.0},
                showGrid: {value: this._showGrid ? 1.0 : 0.0},
                camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                texture: {type: "t", value: this.options.terrainAtlasTexture},
                textureAtlasMeta: {
                    type: "4f",
                    value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                },
                hillsNormal: {
                    type: "t",
                    value: this.options.hillsNormalTexture
                },
                mapTexture: {
                    type: "t",
                    value: this.options.undiscoveredTexture
                },
                lightDir: {
                    type: "v3",
                    value: new THREE.Vector3(0.5, 0.6, -0.5).normalize()
                }
            },
            vertexShader: this.options.mountainsVertexShader,
            fragmentShader: this.options.mountainsFragmentShader,
            side: THREE.FrontSide,
            wireframe: false,
            transparent: false
        })

        this.mountains = new Mesh(geometry, material)
        this.mountains.frustumCulled = false            

        this.add(this.mountains)
    }
}

function createHexagonTilesGeometry(tiles: MapMeshTile[], grid: Grid<TileData>, numSubdivisions: number, options: MapMeshOptions) {
    const scale = options.scale || 1.0
    const hexagon = createHexagon(scale, numSubdivisions)
    const geometry = new InstancedBufferGeometry()
    const textureAtlas = options.terrainAtlas

    geometry.maxInstancedCount = tiles.length
    geometry.addAttribute("position", (hexagon.attributes as any).position)
    geometry.addAttribute("uv", (hexagon.attributes as any).uv)
    geometry.addAttribute("border", (hexagon.attributes as any).border)

    // positions for each hexagon tile
    const tilePositions: Vector3[] = tiles.map((tile) => qrToWorld(tile.q, tile.r, scale))
    const posAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 2), 2, 1)
    posAttr.copyVector2sArray(tilePositions)
    geometry.addAttribute("offset", posAttr)

    //----------------
    const cellSize = textureAtlas.cellSize
    const cellSpacing = textureAtlas.cellSpacing
    const numColumns = textureAtlas.width / cellSize

    function terrainCellIndex(terrain: string): number {
        const cell = textureAtlas.textures[terrain]
        return cell.cellY * numColumns + cell.cellX
    }

    const styles = tiles.map(function (tile, index) {
        const cell = textureAtlas.textures[tile.terrain]
        if (!cell) {
            throw new Error(`Terrain '${tile.terrain}' not in texture atlas\r\n` + JSON.stringify(textureAtlas))
        }

        const cellIndex = terrainCellIndex(tile.terrain)
        const shadow = tile.fog             ? 1 : 0
        const clouds = tile.clouds          ? 1 : 0
        const hills = isHill(tile.height)   ? 1 : 0
        const style = shadow * 1 + hills * 10 + clouds * 100

        // Coast and River texture index
        const coastIdx = computeCoastTextureIndex(grid, tile)
        const riverIdx = computeRiverTextureIndex(grid, tile)

        tile.bufferIndex = index

        return new Vector4(cellIndex, style, coastIdx, riverIdx)
    })

    const styleAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 4), 4, 1)
    styleAttr.copyVector4sArray(styles)
    geometry.addAttribute("style", styleAttr)

    // surrounding tile terrain represented as two consecutive Vector3s
    // 1. [tileIndex + 0] = NE, [tileIndex + 1] = E, [tileIndex + 2] = SE
    // 2. [tileIndex + 0] = SW, [tileIndex + 1] = W, [tileIndex + 2] = NW
    const neighborsEast = new THREE.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, 1)
    const neighborsWest = new THREE.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3, 1)

    for (let i = 0; i < tiles.length; i++) {
        const neighbors = grid.surrounding(tiles[i].q, tiles[i].r)

        for (let j = 0; j < neighbors.length; j++) {
            const neighbor = neighbors[j]
            const attr = j > 2 ? neighborsWest : neighborsEast
            const array = attr.array as number[]

            // terrain cell index indicates the type of terrain for lookup in the shader
            array[3 * i + j % 3] = neighbor ? terrainCellIndex(neighbor.terrain) : -1
        }
    }

    geometry.addAttribute("neighborsEast", neighborsEast)
    geometry.addAttribute("neighborsWest", neighborsWest)

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