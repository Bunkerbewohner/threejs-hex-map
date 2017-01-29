/// <reference types="three" />
import { Vector3, Camera, Raycaster } from "three";
import { QR } from './interfaces';
export declare function qrToWorld(q: number, r: number, scale?: number): Vector3;
export declare function qrToWorldX(q: number, r: number, scale?: number): number;
export declare function qrToWorldY(q: number, r: number, scale?: number): number;
export declare function qrDistance(a: QR, b: QR): number;
export declare function pickingRay(vector: Vector3, camera: Camera): Raycaster;
/**
 * Transforms mouse coordinates into world space, assuming that the game view spans the entire window.
 */
export declare function mouseToWorld(e: MouseEvent | {
    clientX: number;
    clientY: number;
}, camera: Camera): Vector3;
/**
 * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
 */
export declare function screenToWorld(x: number, y: number, camera: Camera): Vector3;
/**
 * Transforms world coordinates into screen space.
 */
export declare function worldToScreen(pos: Vector3, camera: Camera): Vector3;
export declare function axialToCube(q: number, r: number): {
    x: number;
    y: number;
    z: number;
};
export declare function cubeToAxial(x: any, y: number, z: number): {
    q: any;
    r: number;
};
/**
 * Rounds fractal cube coordinates to the nearest full cube coordinates.
 * @param cubeCoord
 * @returns {{x: number, y: number, z: number}}
 */
export declare function roundToHex(cubeCoord: {
    x: number;
    y: number;
    z: number;
}): {
    x: number;
    y: number;
    z: number;
};
