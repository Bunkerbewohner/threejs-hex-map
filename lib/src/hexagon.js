define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NE = 32;
    exports.E = 16;
    exports.SE = 8;
    exports.SW = 4;
    exports.W = 2;
    exports.NW = 1;
    function subdivideTriangle(a, b, c, numSubdivisions) {
        if ((numSubdivisions || 0) <= 0)
            return [a, b, c];
        var ba = b.clone().sub(a);
        var ah = a.clone().add(ba.setLength(ba.length() / 2));
        var cb = c.clone().sub(b);
        var bh = b.clone().add(cb.setLength(cb.length() / 2));
        var ac = a.clone().sub(c);
        var ch = c.clone().add(ac.setLength(ac.length() / 2));
        return [].concat(subdivideTriangle(ah, bh, ch, numSubdivisions - 1), subdivideTriangle(ch, bh, c, numSubdivisions - 1), subdivideTriangle(ah, ch, a, numSubdivisions - 1), subdivideTriangle(bh, ah, b, numSubdivisions - 1));
    }
    exports.subdivideTriangle = subdivideTriangle;
    function createHexagon(radius, numSubdivisions) {
        var numFaces = 6 * Math.pow(4, numSubdivisions);
        var positions = new Float32Array(numFaces * 3 * 3), p = 0;
        var texcoords = new Float32Array(numFaces * 3 * 2), t = 0;
        var border = new Float32Array(numFaces * 3 * 1), e = 0;
        var points = [0, 1, 2, 3, 4, 5].map(function (i) {
            return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * (i / 6.0)), radius * Math.cos(Math.PI * 2 * (i / 6.0)), 0);
        }).concat([new three_1.Vector3(0, 0, 0)]);
        var faces = [0, 6, 1, 1, 6, 2, 2, 6, 3, 3, 6, 4, 4, 6, 5, 5, 6, 0];
        var vertices = []; // every three vertices constitute one face
        for (var i = 0; i < faces.length; i += 3) {
            var a = points[faces[i]], b = points[faces[i + 1]], c = points[faces[i + 2]];
            vertices = vertices.concat(subdivideTriangle(a, b, c, numSubdivisions));
        }
        for (i = 0; i < vertices.length; i++) {
            positions[p++] = vertices[i].x;
            positions[p++] = vertices[i].y;
            positions[p++] = vertices[i].z;
            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].x + radius) / (radius * 2));
            texcoords[t++] = 0.02 + 0.96 * ((vertices[i].y + radius) / (radius * 2));
            var inradius = (Math.sqrt(3) / 2) * radius;
            border[e++] = vertices[i].length() >= inradius - 0.1 ? 1.0 : 0.0;
        }
        var geometry = new three_1.BufferGeometry();
        geometry.addAttribute("position", new three_1.BufferAttribute(positions, 3));
        geometry.addAttribute("uv", new three_1.BufferAttribute(texcoords, 2));
        // 1.0 = border vertex, 0.0 otherwise
        geometry.addAttribute("border", new three_1.BufferAttribute(border, 1));
        return geometry;
    }
    exports.createHexagon = createHexagon;
    /**
     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
     */
    function randomPointInHexagon(hexRadius) {
        // the hexagon consists of 6 triangles, construct one of them randomly
        var startCornerIndex = Math.floor(Math.random() * 6);
        var A = computeHexagonCorner(hexRadius, ((startCornerIndex + 0) % 6) / 6.0);
        var B = new three_1.Vector3(0, 0, 0);
        var C = computeHexagonCorner(hexRadius, ((startCornerIndex + 1) % 6) / 6.0);
        // random point in the triangle based on AB and AC
        var r = Math.random(), s = Math.random();
        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
        return A.clone().multiplyScalar((1 - rSqrt))
            .add(B.clone().multiplyScalar(rSqrt * (1 - sSqrt)))
            .add(C.clone().multiplyScalar(s * rSqrt));
    }
    exports.randomPointInHexagon = randomPointInHexagon;
    /**
     * Returns a random point in the regular hexagon at (0,0) with given hex radius on the Z=0 plane.
     */
    function randomPointInHexagonEx(hexRadius, modifier) {
        // the hexagon consists of 6 triangles, construct one of them randomly
        var startCornerIndex = Math.floor(Math.random() * 6);
        var A = hexagonCorners1[startCornerIndex].clone();
        var B = new three_1.Vector3(0, 0, 0);
        var C = hexagonCorners1[(startCornerIndex + 1) % 6].clone();
        // random point in the triangle based on AB and AC
        var r = Math.random(), s = Math.random();
        var rSqrt = Math.sqrt(r), sSqrt = Math.sqrt(s);
        var point = A.multiplyScalar((1 - rSqrt))
            .add(B.multiplyScalar(rSqrt * (1 - sSqrt)))
            .add(C.multiplyScalar(s * rSqrt));
        return point.multiplyScalar(modifier(startCornerIndex) * hexRadius);
    }
    exports.randomPointInHexagonEx = randomPointInHexagonEx;
    function computeHexagonCorner(radius, angle) {
        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
    }
    function computeHexagonCorner1(angle) {
        var radius = 1.0;
        return new three_1.Vector3(radius * Math.sin(Math.PI * 2 * angle), radius * Math.cos(Math.PI * 2 * angle), 0);
    }
    var hexagonCorners1 = [
        computeHexagonCorner1(0),
        computeHexagonCorner1(1 / 6.0),
        computeHexagonCorner1(2 / 6.0),
        computeHexagonCorner1(3 / 6.0),
        computeHexagonCorner1(4 / 6.0),
        computeHexagonCorner1(5 / 6.0)
    ];
});
//# sourceMappingURL=hexagon.js.map