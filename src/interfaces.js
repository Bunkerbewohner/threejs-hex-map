define(["require", "exports"], function (require, exports) {
    "use strict";
    function isLand(height) {
        return height >= 0.0 && height < 0.75;
    }
    exports.isLand = isLand;
    function isWater(height) {
        return height < 0.0;
    }
    exports.isWater = isWater;
    function isHill(height) {
        return height >= 0.375 && height < 0.75;
    }
    exports.isHill = isHill;
    function isMountain(height) {
        return height >= 0.75;
    }
    exports.isMountain = isMountain;
});
