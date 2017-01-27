import { PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group, Camera, Vector2, Object3D } from 'three';
import {generateRandomMap} from "./map-generator"
import MapMesh from "./MapMesh"
import { TextureAtlas, TileData, TileDataSource, QR } from './interfaces';
import {loadFile} from "./util"
import { screenToWorld } from './camera-utils';
import Grid from './Grid';
import DefaultTileSelector from "./DefaultTileSelector"
import DefaultMapViewController from "./DefaultMapViewController"
import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { qrToWorld, axialToCube, roundToHex, cubeToAxial, mouseToWorld } from './coords';
import ChunkedLazyMapMesh from "./ChunkedLazyMapMesh";
import { MapMeshOptions } from './MapMesh';

export default class MapView implements MapViewControls, TileDataSource {
    private static DEFAULT_ZOOM = 25

    private _camera: PerspectiveCamera
    private _scene: Scene
    private _renderer: WebGLRenderer
    private _scrollDir = new Vector3(0, 0, 0)    
    private _lastTimestamp = Date.now()
    private _zoom: number = 25

    private _mapMesh: Object3D & TileDataSource
    private _chunkedMesh: ChunkedLazyMapMesh
    private _tileGrid: Grid<TileData> = new Grid<TileData>(0, 0)

    private _tileSelector: THREE.Object3D = DefaultTileSelector
    private _controller: MapViewController = new DefaultMapViewController()
    private _selectedTile: TileData

    private _onTileSelected: (tile: TileData) => void
    private _onLoaded: () => void
    private _onAnimate: (dtS: number) => void = (dtS) => {}

    get controller() {
        return this._controller
    }

    get zoom() {
        return this._zoom
    }

    getZoom(): number {
        return this._zoom
    }

    set zoom(value: number) {
        this.setZoom(value)
    }

    get selectedTile(): TileData {
        return this._selectedTile
    }

    getTileGrid(): Grid<TileData> {
        return this._tileGrid
    }

    get mapMesh(): MapMesh {
        return this._mapMesh as MapMesh
    }

    /**
     * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
     */
    setZoom(z: number) {
        this._camera.updateMatrixWorld(false)

        // position the camera is currently centered at
        const lookAt = this.getViewCenter()

        // move camera along the Z axis to adjust the view distance
        this._zoom = z
        this._camera.position.z = z
        this._camera.updateMatrixWorld(true)

        if (lookAt != null) {
            // reposition camera so that the view center stays the same
            this._camera.position.copy(this.getCameraFocusPositionWorld(lookAt))
        }

        return this
    }

    get scrollDir() {
        return this._scrollDir
    }

    set onTileSelected(callback: (tile: TileData)=>void) {
        this._onTileSelected = callback
    }

    set onLoaded(callback: ()=>void) {
        this._onLoaded = callback
    }

    set onAnimate(callback: (dtS: number)=>void) {
        if (!callback) {
            throw new Error("Invalid onAnimate callback")
        }
        this._onAnimate = callback
    }

    setOnAnimateCallback(callback: (dtS: number)=>void) {
        this.onAnimate = callback
    }

    public scrollSpeed: number = 10

    constructor(canvasElementQuery: string = "canvas") {
        const canvas = document.querySelector(canvasElementQuery) as HTMLCanvasElement
        const camera = this._camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        const scene = this._scene = new Scene()
        const renderer = this._renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            devicePixelRatio: window.devicePixelRatio
        })        

        if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
            throw new Error("Your browser is not supported (missing extension ANGLE_instanced_arrays)")
        }

        renderer.setClearColor(0x6495ED);
        renderer.setSize(window.innerWidth, window.innerHeight)

        window.addEventListener('resize', (e) => this.onWindowResize(e), false);
                
        // setup camera
        camera.rotation.x = Math.PI / 4.5
        this.setZoom(MapView.DEFAULT_ZOOM)
        this.focus(0, 0)

        // tile selector
        this._tileSelector.position.setZ(0.1)
        this._scene.add(this._tileSelector)
        this._tileSelector.visible = true        

        // start rendering loop
        this.animate(0)        
        this._controller.init(this, canvas)
    }

    load(tiles: Grid<TileData>, options: MapMeshOptions) {
        this._tileGrid = tiles
        this._selectedTile = this._tileGrid.get(0, 0)        

        if ((tiles.width * tiles.height) < Math.pow(512, 2)) {
            const mesh = this._mapMesh = new MapMesh(tiles.toArray(), options, tiles)
            this._scene.add(this._mapMesh)
            mesh.loaded.then(() => {
                if (this._onLoaded) this._onLoaded()
            })
            console.info("using single MapMesh for " + (tiles.width * tiles.height) + " tiles")
        } else {
            const mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh(tiles, options)
            this._scene.add(this._mapMesh)
            mesh.loaded.then(() => {
                if (this._onLoaded) this._onLoaded()
            })
            console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles")
        }
    }

    updateTiles(tiles: TileData[]) {
        this._mapMesh.updateTiles(tiles)
    }

    getTile(q: number, r: number) {
        return this._mapMesh.getTile(q, r)
    }

    private animate = (timestamp: number) => {
        const dtS = (timestamp - this._lastTimestamp) / 1000.0

        const camera = this._camera
        const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM
        const scroll = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS)
        camera.position.add(scroll)

        if (this._chunkedMesh) {
            this._chunkedMesh.updateVisibility(camera)
        }

        this._onAnimate(dtS)

        this._renderer.render(this._scene, camera);
        requestAnimationFrame(this.animate);
        this._lastTimestamp = timestamp
    }

    onWindowResize(event: Event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //----- MapViewControls -----

    setScrollDir(x: number, y: number) {
        this._scrollDir.setX(x)
        this._scrollDir.setY(y)
        this._scrollDir.normalize()
    }

    getCamera(): Camera {
        return this._camera
    }

    /**
     * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
     */
    getViewCenter(): Vector3 {
        return mouseToWorld({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera)
    }

    getCameraFocusPosition(pos: QR): Vector3 {
        return this.getCameraFocusPositionWorld(qrToWorld(pos.q, pos.r))
    }

    getCameraFocusPositionWorld(pos: Vector3): Vector3 {
        const currentPos = this._camera.position.clone()
        const viewCenter = this.getViewCenter()
        const viewOffset = currentPos.sub(viewCenter)

        return pos.add(viewOffset)
    }

    focus(q: number, r: number) {
        this._camera.position.copy(this.getCameraFocusPosition({q, r}))
    }

    focusWorldPos(v: Vector3) {
        this._camera.position.copy(this.getCameraFocusPositionWorld(v))
    }

    selectTile(tile: TileData) {        
        const worldPos = qrToWorld(tile.q, tile.r)
        this._tileSelector.position.set(worldPos.x, worldPos.y, 0.1)
        if (this._onTileSelected) {
            this._onTileSelected(tile)
        }
    }

    pickTile(worldPos: THREE.Vector3): TileData | null {
        var x = worldPos.x
        var y = worldPos.y

        // convert from world coordinates into fractal axial coordinates
        var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y)
        var r = 2.0 / 3 * y

        // now need to round the fractal axial coords into integer axial coords for the grid lookup
        var cubePos = axialToCube(q, r)
        var roundedCubePos = roundToHex(cubePos)
        var roundedAxialPos = cubeToAxial(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z)

        // just look up the coords in our grid
        return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r)        
    }
}