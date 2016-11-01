import {PerspectiveCamera, Scene, WebGLRenderer, Vector3, Group} from "three"
import {generateRandomMap} from "./map-generator"
import MapMesh from "./MapMesh"
import { TextureAtlas, TileData } from './interfaces';
import {loadFile} from "./util"
import {Promise} from "es6-promise"
import { screenToWorld } from './camera-utils';
import Grid from './Grid';

export default class MapView {
    private static DEFAULT_ZOOM = 25

    private _camera: PerspectiveCamera
    private _scene: Scene
    private _renderer: WebGLRenderer
    private _scrollDir = new Vector3(0, 0, 0)    
    private _lastTimestamp = Date.now()
    private _zoom: number = 25

    private _textureAtlas: TextureAtlas;

    get zoom() {
        return this._zoom
    }

    setZoom(z: number) {
        this._zoom = z
        this._camera.position.z = z
        this._camera.position.y = -this.zoom * 0.95
        return this
    }

    get scrollDir() {
        return this._scrollDir
    }

    public scrollSpeed: number = 10

    constructor(canvasElementQuery: string = "canvas") {
        const camera = this._camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        const scene = this._scene = new Scene()
        const renderer = this._renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector(canvasElementQuery) as HTMLCanvasElement,
            devicePixelRatio: window.devicePixelRatio
        })

        if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
            throw new Error("Your browser is not supported (missing extension ANGLE_instanced_arrays)")
        }

        window.addEventListener('resize', (e) => this.onWindowResize(e), false);
        
        renderer.setClearColor(0x6495ED);
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.rotation.x = Math.PI / 4.5        
        this.setZoom(MapView.DEFAULT_ZOOM)
        camera.position.y = -this.zoom * 0.95
        this.animate(0)
    }

    load(tiles: Grid<TileData>, textureAtlas: TextureAtlas) {
        this._textureAtlas = textureAtlas
        this._scene.add(new MapMesh(tiles.toArray(), textureAtlas))
    }

    private animate = (timestamp: number) => {
        const dtS = (timestamp - this._lastTimestamp) / 1000.0

        const camera = this._camera
        const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM
        const scroll = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS)
        camera.position.add(scroll)

        this._renderer.render(this._scene, camera);
        requestAnimationFrame(this.animate);
        this._lastTimestamp = timestamp
    }

    onWindowResize(event: Event) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        const frustrumMin = screenToWorld(0, 0, this._camera)
        const frustrumMax = screenToWorld(window.innerWidth, window.innerHeight, this._camera)
    }
}