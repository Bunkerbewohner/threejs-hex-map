import {Vector2} from "three"

export function qrToWorld(q: number, r: number) {
    return new Vector2(Math.sqrt(3) * (q + r / 2), 3 / 2 * r)
}

export function qrToWorldX(q: number, r: number) {
    return Math.sqrt(3) * (q + r / 2)
}

export function qrToWorldY(q: number, r: number) {
    return 3 / 2 * r
}