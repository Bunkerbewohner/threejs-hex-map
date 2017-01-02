import { TileData, QR } from './interfaces';
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

    /**
     * Return the camera used by the map view.
     */
    getCamera(): Camera;

    /**
     * Returns the world space position at the center of the view on the Z plane (the plane with the tiles).
     */
    getViewCenter(): Vector3;

    /**
     * Set the direction for continuous scrolling of the view. (0, 0) stops the scrolling.
     */
    setScrollDir(x: number, y: number): void;

    /**
     * Given a QR coordinate returns the camera position that will focus them in the center of the view.
     */
    getCameraFocusPosition(pos: QR): Vector3;

    /**
     * Center the view on the given QR coordinates.
     */
    focus(q: number, r: number): void;

    getZoom(): number;

    setZoom(z: number): void;

    /**
     * Set a function that is called each frame when the view is updated
     */
    setOnAnimateCallback(callback: (dtS: number) => void): void;
}

export default MapViewController