import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { screenToWorld } from './coords';
import { TileData } from './interfaces';
import { Vector3 } from 'three';

export default class Controller implements MapViewController {
    private _controls: MapViewControls

    init(controls: MapViewControls, canvas: HTMLCanvasElement) {
        this._controls = controls

        canvas.addEventListener("mousedown", this.onMouseDown)
        canvas.addEventListener("mousemove", this.onMouseMove)
        canvas.addEventListener("mouseup", this.onMouseUp)
    }

    onMouseDown = (e: MouseEvent) => {
        const worldPos: Vector3 = screenToWorld(e.clientX, e.clientY, this._controls.getCamera())
        const tile: TileData = this._controls.pickTile(worldPos)

        if (tile) {
            this._controls.selectTile(tile)
        }
    }

    onMouseMove = (e: MouseEvent) => {

    }

    onMouseUp = (e: MouseEvent) => {

    }
}