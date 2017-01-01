/// <reference types="three" />
import { Vector3, Camera } from 'three';
import { TileData, TileDataSource, QR } from './interfaces';
import Grid from './Grid';
import { MapViewControls } from './MapViewController';
import { MapMeshOptions } from './MapMesh';
export default class MapView implements MapViewControls, TileDataSource {
    private static DEFAULT_ZOOM;
    private _camera;
    private _scene;
    private _renderer;
    private _scrollDir;
    private _lastTimestamp;
    private _zoom;
    private _mapMesh;
    private _chunkedMesh;
    private _tileGrid;
    private _tileSelector;
    private _controller;
    private _selectedTile;
    private _onTileSelected;
    private _onLoaded;
    zoom: number;
    readonly selectedTile: TileData;
    getTileGrid(): Grid<TileData>;
    /**
     * Sets up the camera with the given Z position (height) and so that QR(0, 0) will be roughly in the middle of the screen.
     */
    setZoom(z: number): this;
    readonly scrollDir: Vector3;
    onTileSelected: (tile: TileData) => void;
    onLoaded: () => void;
    scrollSpeed: number;
    constructor(canvasElementQuery?: string);
    load(tiles: Grid<TileData>, options: MapMeshOptions): void;
    updateTiles(tiles: TileData[]): void;
    getTile(q: number, r: number): TileData;
    private animate;
    onWindowResize(event: Event): void;
    setScrollDir(x: number, y: number): void;
    getCamera(): Camera;
    /**
     * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
     */
    getViewCenter(): Vector3;
    getCameraFocusPosition(pos: QR): Vector3;
    focus(q: number, r: number): void;
    selectTile(tile: TileData): void;
    pickTile(worldPos: THREE.Vector3): TileData | null;
}
