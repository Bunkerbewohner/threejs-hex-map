define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function pickingRay(vector, camera) {
        // set two vectors with opposing z values
        vector.z = -1.0;
        var end = new three_1.Vector3(vector.x, vector.y, 1.0);
        vector.unproject(camera);
        end.unproject(camera);
        // find direction from vector to end
        end.sub(vector).normalize();
        return new three_1.Raycaster(vector, end);
    }
    exports.pickingRay = pickingRay;
    function screenToWorld(x, y, camera) {
        var mv = new three_1.Vector3(x, y, 0.5);
        var raycaster = pickingRay(mv, camera);
        var planeZ = new three_1.Plane(new three_1.Vector3(0, 0, 1), 0);
        return raycaster.ray.intersectPlane(planeZ);
    }
    exports.screenToWorld = screenToWorld;
    function mouseToWorld(mouseEvent, camera) {
        var x = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
        var y = (mouseEvent.clientY / window.innerHeight) * 2 - 1;
        return screenToWorld(x, y, camera);
    }
    exports.mouseToWorld = mouseToWorld;
    function screenCenterToWorld(camera) {
        return screenToWorld(window.innerWidth / 2, window.innerHeight / 2, camera);
    }
    exports.screenCenterToWorld = screenCenterToWorld;
});
//# sourceMappingURL=camera-utils.js.map