import {Tile} from "./interfaces"
import {createHexagon} from "./hexagon"
import {InstancedBufferGeometry, BufferGeometry, Vector2, Texture, Mesh} from "three"
import BufferAttribute = THREE.BufferAttribute;

export default class Map {
    private water: Mesh

    constructor(private _size: number, private _tiles: Tile[]) {
        this.water = this.createWaterMesh(_tiles, null, null, null)

    }

    createWaterMesh(tiles: Tile[], vertexShader: string, fragmentShader: string, texture: Texture) {
        const geometry = createHexagonTilesGeometry(tiles.filter(t => t.height < 0), 0)
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                sineTime: { value: 0.0 },
                viewCenter: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                camera: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                texture: {
                    type: "t",
                    value: texture
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.FrontSide,
            wireframe: false,
            transparent: false
        })

        return new Mesh(geometry, material)
    }
}

function createHexagonTilesGeometry(tiles: Tile[], numSubdivisions: number) {
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