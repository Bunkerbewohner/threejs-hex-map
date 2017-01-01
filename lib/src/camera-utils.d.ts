/// <reference types="three" />
import { Vector3, Camera, Raycaster } from "three";
export declare function pickingRay(vector: Vector3, camera: Camera): Raycaster;
export declare function screenToWorld(x: number, y: number, camera: Camera): Vector3;
export declare function mouseToWorld(mouseEvent: {
    clientX: number;
    clientY: number;
}, camera: Camera): Vector3;
export declare function screenCenterToWorld(camera: Camera): Vector3;
