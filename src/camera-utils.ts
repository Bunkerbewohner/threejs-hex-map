import {Vector3, Camera, Raycaster, Plane} from "three";

export function pickingRay(vector: Vector3, camera: Camera): Raycaster {
    // set two vectors with opposing z values
    vector.z = -1.0;
    var end = new Vector3(vector.x, vector.y, 1.0);

    vector.unproject(camera);
    end.unproject(camera);

    // find direction from vector to end
    end.sub(vector).normalize();
    return new Raycaster(vector, end);
}

export function screenToWorld(x: number, y: number, camera: Camera): Vector3 {
    var mv = new Vector3(x, y, 0.5)
    var raycaster = pickingRay(mv, camera)
    var planeZ = new Plane(new Vector3(0, 0, 1), 0)
    return raycaster.ray.intersectPlane(planeZ)
}

export function mouseToWorld(mouseEvent: {clientX: number, clientY: number}, camera: Camera): Vector3 {
    var x = (mouseEvent.clientX / window.innerWidth) * 2 - 1
    var y = (mouseEvent.clientY / window.innerHeight) * 2 - 1
    return screenToWorld(x, y, camera)
}

export function screenCenterToWorld(camera: Camera): Vector3 {
    return screenToWorld(window.innerWidth/2, window.innerHeight/2, camera)
}