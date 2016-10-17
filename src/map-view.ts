import {Camera} from "three"
import {screenToWorld} from "./camera-utils";
import Map from "./map-mesh";

export default class MapView {
    private _zoom: number = 1
    private _map: Map

    constructor(map: Map) {
        this._map = map
    }

    render(camera: Camera) {
        const frustrumMin = screenToWorld(0, 0, camera)
        const frustrumMax = screenToWorld(window.innerWidth, window.innerHeight, camera)
    }
}
