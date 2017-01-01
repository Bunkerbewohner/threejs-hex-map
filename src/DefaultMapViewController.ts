import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { screenToWorld, pickingRay, qrToWorld } from './coords';
import { TileData, QR } from './interfaces';
import { Vector3, Camera, Vector2 } from 'three';

export default class Controller implements MapViewController {
    private controls: MapViewControls
    private pickingCamera: Camera
    private mouseDownPos: Vector3
    private dragStartCameraPos: Vector3
    private lastDrag: Vector3 = new Vector3(0, 0, 0)
    private debugText: HTMLDivElement = document.getElementById("debug") as HTMLDivElement
    private selectedQR: QR = {q: 0, r: 0}

    init(controls: MapViewControls, canvas: HTMLCanvasElement) {
        this.controls = controls        

        document.addEventListener("keydown", this.onKeyDown, false)

        canvas.addEventListener("mousedown", this.onMouseDown, false)
        canvas.addEventListener("mousemove", this.onMouseMove, false)
        canvas.addEventListener("mouseup", this.onMouseUp, false)
        canvas.addEventListener("mouseout", this.onMouseOut, false)
        canvas.addEventListener("mouseenter", this.onMouseEnter, false)

        canvas.addEventListener("touchstart", (e) => {
            this.onMouseDown(e.touches[0] as any)
            e.preventDefault()
        }, false)
        canvas.addEventListener("touchmove", (e) => {
            this.onMouseMove(e.touches[0] as any)
            e.preventDefault()
        }, false)
        canvas.addEventListener("touchend", (e) => this.onMouseUp(e.touches[0] || e.changedTouches[0] as any), false)
        
        setInterval(() => this.showDebugInfo(), 100)
        this.controls.focus(0, 0)
    }

    onKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode == 32) { // SPACE BAR
            console.log(`center view on QR(${this.selectedQR.q},${this.selectedQR.r})`)
            this.controls.focus(this.selectedQR.q, this.selectedQR.r)
        }
    }

    onMouseDown = (e: MouseEvent) => {
        this.pickingCamera = this.controls.getCamera().clone()
        this.mouseDownPos = screenToWorld(e.clientX, e.clientY, this.pickingCamera)
        this.dragStartCameraPos = this.controls.getCamera().position.clone()                
    }

    onMouseEnter = (e: MouseEvent) => {
        if (e.buttons === 1) {
            this.onMouseDown(e)
        }
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
        if (!this.lastDrag) {
            const mousePos = screenToWorld(e.clientX, e.clientY, this.controls.getCamera())
            const tile = this.controls.pickTile(mousePos)
            if (tile) {
                this.controls.selectTile(tile)
                this.selectedQR = tile
                this.showDebugInfo()
            }        
        }

        this.mouseDownPos = null // end drag
        this.lastDrag = null
    }

    onMouseOut = (e: MouseEvent) => {
        this.mouseDownPos = null // end drag
        this.controls.setScrollDir(0, 0)
    }

    showDebugInfo() {
        const tileQR = this.selectedQR
        const tileXYZ = qrToWorld(tileQR.q, tileQR.r) // world space
        const camPos = this.controls.getViewCenter() //  this.controls.getCamera().position        

        this.debugText.innerHTML = `Selected Tile: QR(${tileQR.q}, ${tileQR.r}), XY(${tileXYZ.x.toFixed(2)}, ${tileXYZ.y.toFixed(2)})
            &nbsp; &bull; &nbsp; Camera Looks At (Center): XYZ(${camPos.x.toFixed(2)}, ${camPos.y.toFixed(2)}, ${camPos.z.toFixed(2)})`
    }
}