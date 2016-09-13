import {Promise} from "es6-promise"
import {XHRLoader} from "three"
import {QR} from "./interfaces"

const fileLoader = new XHRLoader()

export function loadFile(path: string): Promise<string> {
    const url = path + "?cachebuster=" + Math.random() * 9999999
    return new Promise((resolve, reject) => {
        fileLoader.load(url, (result) => {
            resolve(result)
        }, undefined, (error) => {
            reject(error)
        })
    })
}

export function qrRange(qrRadius: number): QR[] {
    const coords: QR[] = [];

    forEachRange(-qrRadius, qrRadius + 1, (dx) => {
        forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, (dy) => {
            var dz = -dx - dy;
            coords.push({q: this.x + dx, r: this.z + dz});
        })
    })

    return coords;
}

export function forEachRange(min: number, max: number, f: (n: number) => void) {
    if (!max) {
        return this.range(0, min);
    } else {
        for (var i = min; i < max; i++) {
            f(i);
        }
    }
}