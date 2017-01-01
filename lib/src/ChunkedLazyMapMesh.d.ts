/// <reference types="three" />
import { Object3D } from "three";
import { TileData, TileDataSource } from './interfaces';
import Grid from "./Grid";
import Camera = THREE.Camera;
import { MapMeshOptions } from './MapMesh';
export default class ChunkedLazyMapMesh extends Object3D implements TileDataSource {
    private tileGrid;
    private options;
    private quadtree;
    private thunks;
    readonly loaded: Promise<void>;
    readonly numChunks: number;
    constructor(tileGrid: Grid<TileData>, options: MapMeshOptions);
    /**
     * Adjusts visibility of chunks so that only map parts that can actually be seen by the camera are rendered.
     * @param camera the camera to use for visibility checks
     */
    updateVisibility(camera: Camera): void;
    updateTiles(tiles: TileData[]): void;
    getTile(q: number, r: number): TileData;
}
