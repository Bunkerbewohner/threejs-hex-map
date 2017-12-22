define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Z_PLANE = new three_1.Plane(new three_1.Vector3(0, 0, 1), 0);
    function qrToWorld(q, r, scale) {
        if (scale === void 0) { scale = 1.0; }
        return new three_1.Vector3(Math.sqrt(3) * (q + r / 2) * scale, (3 / 2) * r * scale, 0);
    }
    exports.qrToWorld = qrToWorld;
    function qrToWorldX(q, r, scale) {
        if (scale === void 0) { scale = 1.0; }
        return Math.sqrt(3) * (q + r / 2) * scale;
    }
    exports.qrToWorldX = qrToWorldX;
    function qrToWorldY(q, r, scale) {
        if (scale === void 0) { scale = 1.0; }
        return (3 / 2) * r * scale;
    }
    exports.qrToWorldY = qrToWorldY;
    function qrDistance(a, b) {
        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
    }
    exports.qrDistance = qrDistance;
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
    /**
     * Transforms mouse coordinates into world space, assuming that the game view spans the entire window.
     */
    function mouseToWorld(e, camera) {
        var mv = new three_1.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
        var raycaster = pickingRay(mv, camera);
        return raycaster.ray.intersectPlane(Z_PLANE);
    }
    exports.mouseToWorld = mouseToWorld;
    /**
     * Transforms screen coordinates into world space, assuming that the game view spans the entire window.
     */
    function screenToWorld(x, y, camera) {
        var mv = new three_1.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
        var raycaster = pickingRay(mv, camera);
        return raycaster.ray.intersectPlane(Z_PLANE);
    }
    exports.screenToWorld = screenToWorld;
    /**
     * Transforms world coordinates into screen space.
     */
    function worldToScreen(pos, camera) {
        var v = pos.clone();
        v.project(camera);
        v.x = window.innerWidth / 2 + v.x * (window.innerWidth / 2);
        v.y = window.innerHeight / 2 - v.y * (window.innerHeight / 2);
        return v;
    }
    exports.worldToScreen = worldToScreen;
    function axialToCube(q, r) {
        return { x: q, y: -q - r, z: r };
    }
    exports.axialToCube = axialToCube;
    function cubeToAxial(x, y, z) {
        return { q: x, r: z };
    }
    exports.cubeToAxial = cubeToAxial;
    /**
     * Rounds fractal cube coordinates to the nearest full cube coordinates.
     * @param cubeCoord
     * @returns {{x: number, y: number, z: number}}
     */
    function roundToHex(cubeCoord) {
        var x = cubeCoord.x, y = cubeCoord.y, z = cubeCoord.z;
        var rx = Math.round(x);
        var ry = Math.round(y);
        var rz = Math.round(z);
        var x_diff = Math.abs(rx - x);
        var y_diff = Math.abs(ry - y);
        var z_diff = Math.abs(rz - z);
        if (x_diff > y_diff && x_diff > z_diff)
            rx = -ry - rz;
        else if (y_diff > z_diff)
            ry = -rx - rz;
        else
            rz = -rx - ry;
        return { x: rx, y: ry, z: rz };
    }
    exports.roundToHex = roundToHex;
});
//# sourceMappingURL=coords.js.map