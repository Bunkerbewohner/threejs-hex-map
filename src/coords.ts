import {Vector2} from "three"
import { QR } from './interfaces';

export function qrToWorld(q: number, r: number) {
    return new Vector2(Math.sqrt(3) * (q + r / 2), 3 / 2 * r)
}

export function qrToWorldX(q: number, r: number) {
    return Math.sqrt(3) * (q + r / 2)
}

export function qrToWorldY(q: number, r: number) {
    return 3 / 2 * r
}

export function qrDistance(a: QR, b: QR) {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}