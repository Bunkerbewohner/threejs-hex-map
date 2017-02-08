import {TileData} from "./interfaces";
import {Object3D, Texture, Points, PointsMaterial, BufferAttribute, BufferGeometry, Vector3, Color,
    ShaderMaterial, RawShaderMaterial} from "three"
import Grid from "./Grid";
import {range, flatten, flatMap} from "./util";
import {qrToWorld} from "./coords";
import {TREES_VERTEX_SHADER} from "./shaders/trees.vertex";
import {TREES_FRAGMENT_SHADER} from "./shaders/trees.fragment";
import {randomPointOnCoastTile, waterAdjacency} from "./map-generator";

interface ForestTile extends TileData {
    bufferIndex: number;
}

export interface Options {
    /**
     * Scaling factor for tile size, e.g. 1.0 if the tile size is not changed.
     */
    mapScale: number;

    /**
     * Size of trees > 0.0.
     */
    treeSize: number;

    /**
     * Spritesheet with n columns and rows, where n equals the option spritesheetSubdivisions.
     */
    spritesheet: Texture;

    /**
     * Number of spritesheet subdivisions, i.e. columns and rows.
     */
    spritesheetSubdivisions: number;

    /**
     * Number of trees that are rendered per forest.
     */
    treesPerForest: number;

    /**
     * Parts of the tree sprite whose opacity is lower than this value will not be rendered,
     * i.e. the transparent background. Valid values are between 0.0 and 1.0.
     */
    alphaTest: number;
}

export default class Forests extends Object3D {
    private _forestTiles: ForestTile[]
    private _globalGrid: Grid<TileData>
    private _options: Options
    private _trees: Trees

    constructor(tiles: TileData[], globalGrid: Grid<TileData>, options: Options) {
        super()

        this._forestTiles = tiles.filter(t => typeof t.treeIndex != "undefined")
            .map(t => ({bufferIndex: -1, ...t}))
        this._globalGrid = globalGrid
        this._options = {...options}

        this._trees = new Trees(globalGrid, this._forestTiles, options)
        this.add(this._trees)
    }

    updateTiles(tiles: TileData[]) {
        this._trees.updateTiles(tiles.filter(t => typeof t.treeIndex != "undefined"))
    }
}

class Trees extends Object3D {
    private _texture: Texture
    private _tiles: ForestTile[]
    private _grid: Grid<ForestTile>
    private _points: Points
    private _options: Options
    private _alphaAttr: BufferAttribute
    private _globalGrid: Grid<TileData> // grid with all tiles

    constructor(globalGrid: Grid<TileData>, tiles: ForestTile[], options: Options) {
        super()

        this._globalGrid = globalGrid
        this._grid = new Grid<ForestTile>(0, 0).init(tiles)
        this._texture = options.spritesheet
        this._tiles = tiles
        this._options = options

        this.create()
    }

    updateTiles(tiles: TileData[]) {
        const attr = this._alphaAttr

        for (let updated of tiles) {
            const old = this._grid.get(updated.q, updated.r)
            const val = updated.clouds ? 0 : 1
            if (updated.clouds == old.clouds) continue;

            for (let i = 0; i < this._options.treesPerForest; i++) {
                attr.setZ(old.bufferIndex + i, val)
            }

            old.clouds = updated.clouds
        }

        attr.needsUpdate = true
    }

    private create() {
        this._points = new Points(this.createGeometry(), this.createMaterial())
        this.add(this._points)
    }

    private createGeometry(): BufferGeometry {
        const geometry = new BufferGeometry()
        const {treeSize, treesPerForest, mapScale} = this._options
        const numTreesRange = range(0, treesPerForest)

        // tree positions
        const positions = flatMap(this._tiles, (tile, j) => {
            tile.bufferIndex = j * treesPerForest
            return numTreesRange.map(j => {
                const tilePos = qrToWorld(tile.q, tile.r, mapScale)
                const localPos = randomPointOnCoastTile(waterAdjacency(this._globalGrid, tile), mapScale)
                return tilePos.add(localPos).setZ(0.12)
            })
        })

        const posAttr = new BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(positions)
        geometry.addAttribute("position", posAttr)

        // tree parameters
        const cols = this._options.spritesheetSubdivisions

        const params = flatMap(this._tiles, tile => {
            const spriteIndex = () => tile.treeIndex * cols + Math.floor(Math.random() * cols)
            return numTreesRange.map(i => new Vector3(spriteIndex(), 0.0, tile.clouds ? 0.0 : 1.0))
        })
        this._alphaAttr = new BufferAttribute(new Float32Array(positions.length * 3), 3).copyVector3sArray(params)
        geometry.addAttribute("params", this._alphaAttr)

        return geometry
    }

    private createMaterial() {
        const {treeSize, mapScale, spritesheetSubdivisions} = this._options
        const parameters = {
            uniforms: {
                texture: {
                    type: "t",
                    value: this._texture
                },
                spritesheetSubdivisions: { type: "f", value: spritesheetSubdivisions },
                size: {
                    type: "f",
                    value: (this._options.mapScale || 1.0) * this._options.treeSize
                },
                scale: { type: 'f', value: window.innerHeight / 2 },
                alphaTest: { type: 'f', value: this._options.alphaTest }
            },
            transparent: true,
            vertexShader: TREES_VERTEX_SHADER,
            fragmentShader: TREES_FRAGMENT_SHADER
        }
        return new RawShaderMaterial(parameters)
    }
}