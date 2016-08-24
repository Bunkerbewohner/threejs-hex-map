import {TileData, isLand, isWater, isMountain} from "./interfaces"
import {createHexagon} from "./hexagon"
import {InstancedBufferGeometry, BufferGeometry, Vector2, Vector3, Texture, Mesh, TextureLoader, XHRLoader} from "three"
import BufferAttribute = THREE.BufferAttribute;
import {Promise} from "es6-promise"
import RawShaderMaterial = THREE.RawShaderMaterial;

const textureLoader = new TextureLoader()
const fileLoader = new XHRLoader()

export default class MapMesh extends THREE.Group {

    static landProps = {
        diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
        fragmentShader: fileLoader.load("../../src/shaders/terrain.fragment.glsl?cachebuster=" + Math.random() * 9999999),
        vertexShader: fileLoader.load("../../src/shaders/terrain.vertex.glsl?cachebuster=" + Math.random() * 9999999),

        onLoaded: (callback: (diffuseMap: Texture, fragmentShader: string, vertexShader: string) => void) => {
            Promise.all([
                MapMesh.landProps.diffuseMap,
                MapMesh.landProps.fragmentShader,
                MapMesh.landProps.vertexShader
            ]).then((values: any[]) => {
                callback(values[0], values[1], values[2])
            })
        }
    }

    static waterProps = {
        diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
        fragmentShader: fileLoader.load("shaders/water.fragment.glsl?cachebuster=" + Math.random() * 9999999),
        vertexShader: fileLoader.load("shaders/water.vertex.glsl?cachebuster=" + Math.random() * 9999999)
    }

    static mountainProps = {
        diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
        fragmentShader: fileLoader.load("shaders/mountains.fragment.glsl?cachebuster=" + Math.random() * 9999999),
        vertexShader: fileLoader.load("shaders/mountains.vertex.glsl?cachebuster=" + Math.random() * 9999999)
    }

    private land: Mesh
    private water: Mesh
    private mountains: Mesh

    constructor(private _tiles: TileData[]) {
        super()
        this.createLandMesh(_tiles.filter(t => isLand(t.height)))
        this.createWaterMesh(_tiles.filter(t => isWater(t.height)))
        this.createMountainMesh(_tiles.filter(t => isMountain(t.height)))
    }

    createLandMesh(tiles: TileData[]) {
        MapMesh.landProps.onLoaded((diffuseMap, fragmentShader, vertexShader) => {
            const geometry = createHexagonTilesGeometry(tiles, 0)
            const material = new THREE.RawShaderMaterial({
                uniforms: {
                    sineTime: { value: 0.0 },
                    viewCenter: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
                    camera: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
                    texture: { type: "t", value: diffuseMap }
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
    }
}

function createHexagonTilesGeometry(tiles: TileData[], numSubdivisions: number) {
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

    return geometry
}