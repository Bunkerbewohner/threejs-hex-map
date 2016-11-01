import {PerspectiveCamera, Scene, WebGLRenderer} from "three"
import {generateRandomMap} from "../../src/map-generator"
import {TextureAtlas} from "../../src/interfaces"
import { loadFile, loadJSON } from '../../src/util';
import {Promise} from "es6-promise"
import MapView from '../../src/MapView';
import { KeyActions, KEY_CODES, paramInt, paramFloat } from './util';

const mapSize = paramInt("size", 96)
const zoom = paramFloat("zoom", 25)
const mapView = new MapView().setZoom(zoom)

const textureAtlas = loadJSON<TextureAtlas>("land-atlas.json")
const tiles = generateRandomMap(mapSize, (q, r, h) => {
    if (h < 0) return "water";
    if (h > 0.75) return "mountain";
    if (Math.random() > 0.5) return "grass"
    else return "plains"
}).catch(err => {
    console.error(err)
    return null
})

Promise.all([tiles, textureAtlas]).then(([tiles, textureAtlas]) => {
    console.log(tiles, tiles.toArray())
    mapView.load(tiles, textureAtlas)
})

const keyActions: KeyActions = {
    [KEY_CODES.LEFT_ARROW]: {
        down: () => mapView.scrollDir.x = -1,
        up: () => mapView.scrollDir.x = 0 
    },
    [KEY_CODES.RIGHT_ARROW]: {
        down: () => mapView.scrollDir.x = 1,
        up: () => mapView.scrollDir.x = 0
    },
    [KEY_CODES.UP_ARROW]: {
        down: () => mapView.scrollDir.y = 1,
        up: () => mapView.scrollDir.y = 0
    },
    [KEY_CODES.DOWN_ARROW]: {
        down: () => mapView.scrollDir.y = -1,
        up: () => mapView.scrollDir.y = 0
    }
}

window.addEventListener("keydown", (event: KeyboardEvent) => {
    const actions = keyActions[event.keyCode]

    if (actions && "down" in actions) {
        actions["down"]()
    }
}, false)

window.addEventListener("keyup", (event: KeyboardEvent) => {
    const actions = keyActions[event.keyCode]

    if (actions && "up" in actions) {
        actions["up"]()
    }
}, false)