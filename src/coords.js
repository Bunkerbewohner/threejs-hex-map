define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    function qrToWorld(q, r) {
        return new three_1.Vector2(Math.sqrt(3) * (q + r / 2), 3 / 2 * r);
    }
    exports.qrToWorld = qrToWorld;
    function qrToWorldX(q, r) {
        return Math.sqrt(3) * (q + r / 2);
    }
    exports.qrToWorldX = qrToWorldX;
    function qrToWorldY(q, r) {
        return 3 / 2 * r;
    }
    exports.qrToWorldY = qrToWorldY;
});
