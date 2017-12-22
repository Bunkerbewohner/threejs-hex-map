define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var geometry = new three_1.RingGeometry(0.85, 1, 6, 2);
    var material = new three_1.MeshBasicMaterial({
        color: 0xffff00
    });
    var selector = new three_1.Mesh(geometry, material);
    selector.rotateZ(Math.PI / 2);
    exports.default = selector;
});
//# sourceMappingURL=DefaultTileSelector.js.map