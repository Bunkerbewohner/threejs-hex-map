/// <reference types="three" />
import { TileData } from './interfaces';
import Grid from "./Grid";
import { MapMeshOptions, MapMeshTile } from './MapMesh';
export default class Trees extends THREE.Object3D {
    private _grid;
    private options;
    private geometry;
    private material;
    private pointCloud;
    private treeSize;
    private numTreesPerForest;
    private allTiles;
    private tiles;
    private localGrid;
    private textures;
    private _scale;
    /**
     *
     * @param tiles tiles with trees to be rendered
     * @param _grid grid of all tiles
     */
    constructor(tiles: MapMeshTile[], _grid: Grid<TileData>, options: MapMeshOptions);
    updateTiles(tiles: TileData[]): void;
    buildMaterial(textureIndex: number): THREE.PointsMaterial;
    buildGeometry(textureIndex: number): THREE.BufferGeometry;
    private randomPointOnTile(water);
    private varyColor(color);
    private getTreeColor(tile);
    private getNumTrees(tile);
    private waterAdjacency(grid, tile);
}
