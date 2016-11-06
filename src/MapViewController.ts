import { TileData } from './interfaces';
import { Vector2, Vector3, Camera } from 'three';

interface MapViewController {
    init(controls: MapViewControls, canvas: HTMLCanvasElement): void;
}

export interface MapViewControls {
    /**
     * Return the tile located at the given world position
     */
    pickTile(worldPos: Vector3): TileData | null;

    /**
     * Move the tile selector to the given tile's position
     */
    selectTile(tile: TileData): void;

    getCamera(): Camera;

    setScrollDir(x: number, y: number): void;
}

export default MapViewController