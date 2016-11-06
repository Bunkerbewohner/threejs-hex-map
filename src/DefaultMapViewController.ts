import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { screenToWorld, pickingRay } from './coords';
import { TileData } from './interfaces';
import { Vector3, Camera, Vector2 } from 'three';

export default class Controller implements MapViewController {
    private controls: MapViewControls
    private pickingCamera: Camera
    private mouseDownPos: Vector3
    private dragStartCameraPos: Vector3
    private lastDrag: Vector3 = new Vector3(0, 0, 0)

    init(controls: MapViewControls, canvas: HTMLCanvasElement) {
        this.controls = controls        

        canvas.addEventListener("mousedown", this.onMouseDown, false)
        canvas.addEventListener("mousemove", this.onMouseMove, false)
        canvas.addEventListener("mouseup", this.onMouseUp, false)
        canvas.addEventListener("mouseout", this.onMouseOut, false)
    }

    onMouseDown = (e: MouseEvent) => {
        this.pickingCamera = this.controls.getCamera().clone()
        this.mouseDownPos = screenToWorld(e.clientX, e.clientY, this.pickingCamera)
        this.dragStartCameraPos = this.controls.getCamera().position.clone()        
    }

    onMouseMove = (e: MouseEvent) => {
        // scrolling via mouse drag
        if (this.mouseDownPos) {
            const mousePos = screenToWorld(e.clientX, e.clientY, this.pickingCamera)
            const dv = this.lastDrag = mousePos.sub(this.mouseDownPos).multiplyScalar(-1)

            const newCameraPos = dv.clone().add(this.dragStartCameraPos)
            this.controls.getCamera().position.copy(newCameraPos)
        }

        // scrolling via screen edge only in fullscreen mode
        if (window.innerHeight == screen.height && !this.mouseDownPos) {
            const scrollZoneSize = 20
            const mousePos2D = new Vector2(e.clientX, e.clientY)
            const screenCenter2D = new Vector2(window.innerWidth / 2, window.innerHeight / 2)
            const diff = mousePos2D.clone().sub(screenCenter2D)

            if (Math.abs(diff.x) > screenCenter2D.x - scrollZoneSize || Math.abs(diff.y) > screenCenter2D.y - scrollZoneSize) {
                this.controls.setScrollDir(diff.x, -diff.y)
            } else {
                this.controls.setScrollDir(0, 0)
            }
        }
    }

    onMouseUp = (e: MouseEvent) => {
        this.mouseDownPos = null // end drag
        
        if (this.lastDrag.length() < 1) {
            const mousePos = screenToWorld(e.clientX, e.clientY, this.controls.getCamera())
            const tile = this.controls.pickTile(mousePos)
            if (tile) {
                this.controls.selectTile(tile)
            }
        }
    }

    onMouseOut = (e: MouseEvent) => {
        this.mouseDownPos = null // end drag
        this.controls.setScrollDir(0, 0)
    }
}