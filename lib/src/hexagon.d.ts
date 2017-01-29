/// <reference types="three" />
import { Vector3, BufferGeometry } from "three";
export declare const NE = 32;
export declare const E = 16;
export declare const SE = 8;
export declare const SW = 4;
export declare const W = 2;
export declare const NW = 1;
export declare function subdivideTriangle(a: Vector3, b: Vector3, c: Vector3, numSubdivisions: number): Vector3[];
export declare function createHexagon(radius: number, numSubdivisions: number): BufferGeometry;
/**
 * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
 */
export declare function randomPointInHexagon(hexRadius: number): Vector3;
/**
 * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
 */
export declare function randomPointInHexagonEx(hexRadius: number, modifier: (cornerIndex: number) => number): Vector3;
