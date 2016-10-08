import {Camera} from "three"
import {screenToWorld} from "./camera-utils";

export default class MapView {
    private _zoom: number = 1

    constructor() {
    }

    render(camera: Camera) {
        const frustrumMin = screenToWorld(0, 0, camera)
        const frustrumMax = screenToWorld(window.innerWidth, window.innerHeight, camera)
    }
}
