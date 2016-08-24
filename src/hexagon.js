define(["require", "exports"], function (require, exports) {
    "use strict";
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
            return new THREE.Vector3(radius * Math.sin(Math.PI * 2 * (i / 6.0)), radius * Math.cos(Math.PI * 2 * (i / 6.0)), 0);
        }).concat([new THREE.Vector3(0, 0, 0)]);
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
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute("uv", new THREE.BufferAttribute(texcoords, 2));
        // 1.0 = border vertex, 0.0 otherwise
        geometry.addAttribute("border", new THREE.BufferAttribute(border, 1));
        return geometry;
    }
    exports.createHexagon = createHexagon;
});
