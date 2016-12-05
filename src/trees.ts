import {Object3D, Vector3, Vector2, InstancedBufferGeometry, InstancedBufferAttribute} from 'three';
import { TileData, isWater, TileDataSource } from './interfaces';
import {randomPointInHexagon, randomPointInHexagonEx, NE, E, SE, SW, W, NW} from './hexagon';
import {qrToWorld, qrToWorldX, qrToWorldY} from './coords';
import MapMesh from './MapMesh';
import Grid from "./Grid";
import Texture = THREE.Texture;
import TextureLoader = THREE.TextureLoader;

const textureLoader = new TextureLoader()

interface TreeTile extends TileData {
    bufferIndex: number;
}

export default class Trees extends THREE.Object3D {
    private geometry: THREE.BufferGeometry;
    private material: THREE.PointsMaterial;
    private pointCloud: THREE.Points;
    private treeSize = 1.2
    private numTreesPerForest = 50
    private tiles: TreeTile[]
    private localGrid: Grid<TreeTile>

    static texture: Texture = textureLoader.load("../../assets/tree.png")

    /**
     *
     * @param tiles tiles with trees to be rendered
     * @param _grid grid of all tiles
     */
    constructor(tiles: TileData[], private _grid: Grid<TileData>) {
        super()

        this.tiles = tiles.filter(t => t.trees).map(t => ({bufferIndex: -1, ...t}))
        this.localGrid = new Grid<TreeTile>(0, 0).init(this.tiles)

        this.material = this.buildMaterial()
        this.geometry = this.buildGeometry()
        this.pointCloud = new THREE.Points(this.geometry, this.material)
        this.add(this.pointCloud)
    }

    updateTiles(tiles: TileData[]) {
        const geometry = this.geometry as InstancedBufferGeometry
        const positions = geometry.getAttribute("position") as InstancedBufferAttribute
        const numTrees = this.numTreesPerForest
        
        tiles.forEach(tile => {
            const old = this.localGrid.get(tile.q, tile.r)
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

    buildMaterial(): THREE.PointsMaterial {
        var texture = Trees.texture
        texture.minFilter = THREE.LinearFilter

        var material = new THREE.PointsMaterial({
            map: texture,
            transparent: true,
            vertexColors: THREE.VertexColors,
            opacity: 1,
            alphaTest: 0.20,
            size: this.treeSize
        })

        return material;
    }

    buildGeometry(): THREE.BufferGeometry {
        var tiles: TreeTile[] = this.tiles        
        var numWoods = tiles.length
        var treesPerWood = this.numTreesPerForest
        var spread = 1.5
        var halfSpread = spread / 2
        var geometry = new THREE.BufferGeometry()
        var treePositions = new Float32Array(treesPerWood * numWoods * 3)
        var treeColors = new Float32Array(treesPerWood * numWoods * 3)
        var vertexIndex = 0
        var numTreesLeft = () => treePositions.length - vertexIndex
        var actualNumTrees = 0
        var bufferIndex = 0

        // iterate from back to front to get automatic sorting by z-depth
        for (var i = tiles.length - 1; i >= 0; i--) {
            const tile = tiles[i]
            const x = qrToWorldX(tile.q, tile.r)
            const y = qrToWorldY(tile.q, tile.r)
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
        return randomPointInHexagonEx(corner => {
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