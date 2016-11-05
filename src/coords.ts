import {Vector2, Vector3, Plane, Camera} from "three"
import { QR } from './interfaces';

const Z_PLANE = new Plane(new Vector3(0, 0, 1), 0)

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

export function pickingRay(vector: THREE.Vector3, camera: THREE.Camera): THREE.Raycaster {
    // set two vectors with opposing z values
    vector.z = -1.0;
    var end = new THREE.Vector3(vector.x, vector.y, 1.0);
    
    vector.unproject(camera);
    end.unproject(camera);

    // find direction from vector to end
    end.sub(vector).normalize();
    return new THREE.Raycaster(vector, end);
}

/**
 * Transforms mouse coordinates into world space, assuming that the game view spans the entire window.
 */
export function mouseToWorld(e: MouseEvent | {clientX: number, clientY: number}, camera: Camera): Vector3 {
  const mv = new Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5 )
  const raycaster = pickingRay(mv, camera);
  return raycaster.ray.intersectPlane(Z_PLANE)
}

/**
 * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
 */
export function screenToWorld(x: number, y: number, camera: Camera): Vector3 {
    const mv = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5 );
    const raycaster = pickingRay(mv, camera);
    return raycaster.ray.intersectPlane(Z_PLANE)
}

/**
 * Transforms world coordinates into screen space.
 */
export function worldToScreen(pos: THREE.Vector3, camera: Camera): Vector3 {
    var v = pos.clone()
    v.project(camera)
    v.x = window.innerWidth/2 + v.x * (window.innerWidth/2)
    v.y = window.innerHeight/2 - v.y * (window.innerHeight/2)

    return v
}