import { Object3D, Vector3, Vector2 } from 'three';
import { TileData } from './interfaces';
import { randomPointInHexagon } from './hexagon';
import { qrToWorld, qrToWorldX, qrToWorldY } from './coords';

export default class Trees extends THREE.Object3D {
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointCloudMaterial;
  private pointCloud: THREE.PointCloud;
  private treeSize = 1.2
  private numTreesPerForest = 50

  constructor(private tiles: TileData[]) {
    super()

    this.material = this.buildMaterial()
    this.geometry = this.buildGeometry()
    this.pointCloud = new THREE.PointCloud(this.geometry, this.material)
    this.add(this.pointCloud)
  }

  buildMaterial(): THREE.PointCloudMaterial {
    var texture = THREE.ImageUtils.loadTexture("textures/tree.png")
    texture.minFilter = THREE.LinearFilter

    var material = new THREE.PointCloudMaterial({
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
    var tiles: TileData[] = this.tiles
    var numWoods = tiles.filter(t => t.trees).length
    var treesPerWood = this.numTreesPerForest
    var spread = 1.5
    var halfSpread = spread/2
    var geometry = new THREE.BufferGeometry()
    var treePositions = new Float32Array(treesPerWood * numWoods * 3)
    var treeColors = new Float32Array(treesPerWood * numWoods * 3)
    var vertexIndex = 0
    var numTreesLeft = () => treePositions.length - vertexIndex
    var actualNumTrees = 0

    // iterate from back to front to get automatic sorting by z-depth
    for (var i = tiles.length - 1; i > 0; i--) {
      if (!tiles[i].trees) continue;
      var tile = tiles[i]
      var numTrees = this.getNumTrees(tile)
      var baseColor = this.getTreeColor(tile)
      let positions: Vector3[] = []
      let colors: number[][] = []

      // generate random tree points on this tile
      for (var t = 0; t < numTrees; t++) {
        var point = randomPointInHexagon(0.85)
        point.setZ(0.1)

        positions.push(point)
        colors.push(this.varyColor(baseColor))
      }

      // sort by Y,Z
      positions.sort((a, b) => {
        var diff = b.y - a.y
        if (Math.abs(diff) < 0.1) return b.z - a.z
        else return diff
      })

      // add the vertices for this tile
      for (var t = 0; t < positions.length; t++) {
          let x = qrToWorldX(tile.q, tile.r)
          let y = qrToWorldY(tile.q, tile.r)
        treePositions[vertexIndex + 0] = x + positions[t].x
        treePositions[vertexIndex + 1] = y + positions[t].y
        treePositions[vertexIndex + 2] = 0 + positions[t].z
        treeColors[vertexIndex + 0] = colors[t][0]
        treeColors[vertexIndex + 1] = colors[t][1]
        treeColors[vertexIndex + 2] = colors[t][2]
        vertexIndex += 3
      }

      actualNumTrees += positions.length
    }

    geometry.addAttribute("position", new THREE.BufferAttribute(treePositions.slice(0, actualNumTrees-1), 3))
    geometry.addAttribute("color", new THREE.BufferAttribute(treeColors.slice(0, actualNumTrees-1), 3))
    return geometry;
  }

  // add slight variation to color
  private varyColor(color: number[]): number[] {
    var vary = Math.random() > 0.5
    var variance = 0.5

    return [
      vary ? (1 - variance/2 + Math.random() * variance) * color[0] : color[0],
      vary ? (1 - variance/2 + Math.random() * variance) * color[1] : color[1],
      vary ? (1 - variance/2 + Math.random() * variance) * color[2] : color[2]
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
    if (tile.river) {
      // reduce the number of trees on this tile to make the resources
      // more easily visible
      return this.numTreesPerForest * 0.25;
    } else {
      return this.numTreesPerForest;
    }
  }
}