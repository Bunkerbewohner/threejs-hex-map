import {PerspectiveCamera, Scene, WebGLRenderer} from "three"
import {generateRandomMap} from "../../src/map-generator"
import { TextureAtlas, isMountain, isWater } from '../../src/interfaces';
import { loadFile, loadJSON } from '../../src/util';
import MapView from '../../src/MapView';
import { KeyActions, KEY_CODES, paramInt, paramFloat, varying } from './util';

const mapSize = paramInt("size", 96)
const zoom = paramFloat("zoom", 25)
const mapView = new MapView().setZoom(zoom)

async function init() {
    async function loadTextureAtlas() {
        return loadJSON<TextureAtlas>("land-atlas.json")
    }

    async function generateMap() {        
        return generateRandomMap(mapSize, (q, r, height) => {            
            const terrain = (height < 0 && "water") || (height > 0.75 && "mountain") || varying("grass", "plains")
            const trees = !isMountain(height) && !isWater(height) && varying(true, false)
            return {q, r, height, terrain, trees, river: null, fog: false, clouds: false }
        })
    }

    const [atlas, map] = await Promise.all([loadTextureAtlas(), generateMap()])
    mapView.load(map, atlas)
}

init()

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