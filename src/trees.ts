import {Object3D, Vector3, Vector2, InstancedBufferGeometry, InstancedBufferAttribute} from 'three';
import { TileData, isWater, TileDataSource } from './interfaces';
import {randomPointInHexagon, randomPointInHexagonEx, NE, E, SE, SW, W, NW} from './hexagon';
import {qrToWorld, qrToWorldX, qrToWorldY} from './coords';
import MapMesh from './MapMesh';
import Grid from "./Grid";
import { MapMeshOptions } from './MapMesh';
import Texture = THREE.Texture;
import TextureLoader = THREE.TextureLoader;

const textureLoader = new TextureLoader()

interface TreeTile extends TileData {
    bufferIndex: number;
}

export default class Trees extends THREE.Object3D {
    private geometry: THREE.BufferGeometry[] = [];
    private material: THREE.PointsMaterial[] = [];
    private pointCloud: THREE.Points[] = [];
    private treeSize = 1.2
    private numTreesPerForest = 50
    private allTiles: TreeTile[]
    private tiles: TreeTile[][] = []
    private localGrid: Grid<TreeTile>[] = []

    private textures: Texture[]
    private _scale: number

    /**
     *
     * @param tiles tiles with trees to be rendered
     * @param _grid grid of all tiles
     */
    constructor(tiles: TileData[], private _grid: Grid<TileData>, private options: MapMeshOptions) {
        super()

        this._scale = options.scale || 1.0
        this.textures = options.treeTextures
        this.allTiles = tiles.filter(t => t.treeIndex != undefined).map(t => ({bufferIndex: -1, ...t}))

        for (let i = 0; i < this.textures.length; i++) {
            this.tiles[i] = this.allTiles.filter(t => t.treeIndex === i)
            this.localGrid[i] = new Grid<TreeTile>(0, 0).init(this.tiles[i])
            this.material[i] = this.buildMaterial(i)
            this.geometry[i] = this.buildGeometry(i)
            this.pointCloud[i] = new THREE.Points(this.geometry[i], this.material[i])
            this.add(this.pointCloud[i])
        }
    }

    updateTiles(tiles: TileData[]) {
        for (let treeIndex = 0; treeIndex < this.textures.length; treeIndex++) {
            const geometry = this.geometry[treeIndex] as InstancedBufferGeometry
            const positions = geometry.getAttribute("position") as InstancedBufferAttribute
            const numTrees = this.numTreesPerForest
            const treeTiles = tiles.filter(t => t.treeIndex === treeIndex)

            treeTiles.forEach(tile => {
                const old = this.localGrid[treeIndex].get(tile.q, tile.r)
                if (!old) return

                if (old.clouds != tile.clouds) {
                    old.clouds = tile.clouds
                    const value = tile.clouds ? 9999 : 0.2
                    for (let i = 0; i < numTrees; i++) {
                        positions.setZ(old.bufferIndex + i, value)
                    }
                }
            })

            positions.needsUpdate = true
        }
    }

    buildMaterial(textureIndex: number): THREE.PointsMaterial {
        const texture = this.textures[textureIndex]
        texture.minFilter = THREE.LinearFilter

        return new THREE.PointsMaterial({
            map: texture,
            transparent: true,
            vertexColors: THREE.VertexColors,
            opacity: 1,
            alphaTest: 0.20,
            size: this.treeSize * this._scale * (this.options.treeSize || 1.0)
        })
    }

    buildGeometry(textureIndex: number): THREE.BufferGeometry {
        const tiles: TreeTile[] = this.tiles[textureIndex]
        const numWoods = tiles.length
        const treesPerWood = this.numTreesPerForest
        const spread = 1.5
        const halfSpread = spread / 2
        const geometry = new THREE.BufferGeometry()
        const treePositions = new Float32Array(treesPerWood * numWoods * 3)
        const treeColors = new Float32Array(treesPerWood * numWoods * 3)
        const numTreesLeft = () => treePositions.length - vertexIndex
        let vertexIndex = 0
        let actualNumTrees = 0
        let bufferIndex = 0

        // iterate from back to front to get automatic sorting by z-depth
        for (var i = tiles.length - 1; i >= 0; i--) {
            const tile = tiles[i]
            const x = qrToWorldX(tile.q, tile.r, this._scale)
            const y = qrToWorldY(tile.q, tile.r, this._scale)
            const z = tile.clouds ? 9999 : 0.1
            const numTrees = treesPerWood
            const baseColor = this.getTreeColor(tile)
            const positions: Vector3[] = new Array(numTrees)
            const colors: number[][] = new Array(numTrees)
            const waterAdjacency = this.waterAdjacency(this._grid, tile)
            tile.bufferIndex = bufferIndex

            // generate random tree points on this tile
            for (var t = 0; t < numTrees; t++) {
                var point = this.randomPointOnTile(waterAdjacency)
                point.setZ(0.1)

                positions[t] = point
                colors[t] = this.varyColor(baseColor)
            }

            // sort by Y,Z
            positions.sort((a, b) => {
                var diff = b.y - a.y
                if (Math.abs(diff) < 0.1) return b.z - a.z
                else return diff
            })

            // add the vertices for this tile
            for (var t = 0; t < positions.length; t++) {
                treePositions[vertexIndex + 0] = x + positions[t].x
                treePositions[vertexIndex + 1] = y + positions[t].y
                treePositions[vertexIndex + 2] = z + positions[t].z
                treeColors[vertexIndex + 0] = colors[t][0]
                treeColors[vertexIndex + 1] = colors[t][1]
                treeColors[vertexIndex + 2] = colors[t][2]
                vertexIndex += 3
            }

            bufferIndex += positions.length
            actualNumTrees += positions.length
        }

        geometry.addAttribute("position", new THREE.BufferAttribute(treePositions, 3))
        geometry.addAttribute("color", new THREE.BufferAttribute(treeColors, 3))
        return geometry;
    }

    private randomPointOnTile(water: WaterAdjacency): Vector3 {
        return randomPointInHexagonEx(this._scale, corner => {
            corner = (2 + (6 - corner)) % 6
            if (corner == 0 && water.NE) return 0.5
            if (corner == 1 && water.E) return 0.5
            if (corner == 2 && water.SE) return 0.5
            if (corner == 3 && water.SW) return 0.5
            if (corner == 4 && water.W) return 0.5
            if (corner == 5 && water.NW) return 0.5

            return 1
        })
    }

    // add slight variation to color
    private varyColor(color: number[]): number[] {
        var vary = Math.random() > 0.5
        var variance = 0.5

        return [
            vary ? (1 - variance / 2 + Math.random() * variance) * color[0] : color[0],
            vary ? (1 - variance / 2 + Math.random() * variance) * color[1] : color[1],
            vary ? (1 - variance / 2 + Math.random() * variance) * color[2] : color[2]
        ]
    }

    private getTreeColor(tile: TileData): number[] {
        // base color
        var color = [1, 1, 1] // default forest color
        if (tile.terrain == "plains") {
            color = [1, 1, 0.2] // yellowish for plains
        } else if (tile.terrain == "jungle") {
            color = [0.4, 0.7, 0.4] // dark green for jungle
        }

        return color
    }

    private getNumTrees(tile: TileData): number {
        return this.numTreesPerForest;
    }

    private waterAdjacency(grid: Grid<TileData>, tile: TileData): WaterAdjacency {
        function isWaterTile(q: number, r: number) {
            const t = grid.get(q, r)
            if (!t) return false
            return isWater(t.height)
        }

        return {
            NE: isWaterTile(tile.q + 1, tile.r - 1),
            E: isWaterTile(tile.q + 1, tile.r),
            SE: isWaterTile(tile.q, tile.r + 1),
            SW: isWaterTile(tile.q - 1, tile.r + 1),
            W: isWaterTile(tile.q - 1, tile.r),
            NW: isWaterTile(tile.q, tile.r - 1)
        }
    }

}

interface WaterAdjacency {
    NE: boolean;
    E: boolean;
    SE: boolean;
    SW: boolean;
    W: boolean;
    NW: boolean;
}