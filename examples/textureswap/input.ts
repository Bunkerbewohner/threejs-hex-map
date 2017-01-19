import { KeyActions, KEY_CODES } from './util';
import MapView from '../../src/MapView';

export function initInput(mapView: MapView) {
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
        },
        [KEY_CODES.E]: {
            down: () => mapView.setZoom(mapView.getZoom() * 0.9)
        },
        [KEY_CODES.Q]: {
            down: () => mapView.setZoom(mapView.getZoom() * 1.1)
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
}