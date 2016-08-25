import {TileData, isLand, isWater, isMountain, TextureAtlas, isHill} from "./interfaces"
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
    TextureLoader,
    XHRLoader,
    BufferAttribute
} from "three"
import {Promise} from "es6-promise"
import {loadFile} from "./util"

const textureLoader = new TextureLoader()

export default class MapMesh extends THREE.Group {

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

    private land: Mesh
    //private water: Mesh
    private mountains: Mesh

    constructor(private _tiles: TileData[], private _textureAtlas: TextureAtlas) {
        super()
        this.createLandMesh(_tiles.filter(t => !isMountain(t.height)))
        //this.createWaterMesh(_tiles.filter(t => isWater(t.height)))
        this.createMountainMesh(_tiles.filter(t => isMountain(t.height)))

        const mountains = _tiles.filter(t => isMountain(t.height))
        console.log("MOUNTAINS= ", mountains)
    }

    createLandMesh(tiles: TileData[]) {
        const vertexShader = MapMesh.landShaders.vertexShader
        const fragmentShader = MapMesh.landShaders.fragmentShader
        const atlas = this._textureAtlas

        const hillNormal = textureLoader.load("textures/hills-normal.png")
        hillNormal.wrapS = hillNormal.wrapT = THREE.RepeatWrapping

        Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, 0, this._textureAtlas)
            const material = new THREE.RawShaderMaterial({
                uniforms: {
                    sineTime: {value: 0.0},
                    camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                    texture: {type: "t", value: textureLoader.load(this._textureAtlas.image)},
                    textureAtlasMeta: {
                        type: "4f",
                        value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                    },
                    hillsNormal: {
                        type: "t",
                        value: hillNormal
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

        const hillNormal = textureLoader.load("textures/hills-normal.png")
        hillNormal.wrapS = hillNormal.wrapT = THREE.RepeatWrapping

        Promise.all([vertexShader, fragmentShader]).then(([vertexShader, fragmentShader]) => {
            const geometry = createHexagonTilesGeometry(tiles, 1, this._textureAtlas)
            const material = new THREE.RawShaderMaterial({
                uniforms: {
                    sineTime: {value: 0.0},
                    camera: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
                    texture: {type: "t", value: textureLoader.load(this._textureAtlas.image)},
                    textureAtlasMeta: {
                        type: "4f",
                        value: new Vector4(atlas.width, atlas.height, atlas.cellSize, atlas.cellSpacing)
                    },
                    hillsNormal: {
                        type: "t",
                        value: hillNormal
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

function createHexagonTilesGeometry(tiles: TileData[], numSubdivisions: number, textureAtlas: TextureAtlas) {
    const hexagon = createHexagon(1.0, numSubdivisions)
    const geometry = new InstancedBufferGeometry()
    geometry.maxInstancedCount = tiles.length
    geometry.addAttribute("position", (hexagon.attributes as any).position)
    geometry.addAttribute("uv", (hexagon.attributes as any).uv)
    geometry.addAttribute("border", (hexagon.attributes as any).border)

    // positions for each hexagon tile
    var tilePositions = tiles.map((tile) => new Vector2(Math.sqrt(3) * (tile.q + tile.r / 2), 3 / 2 * tile.r))
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

        return new Vector2(cellIndex, style)
    })

    var styleAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 3), 2, 1)
    styleAttr.copyVector2sArray(styles)
    geometry.addAttribute("style", styleAttr)

    return geometry
}