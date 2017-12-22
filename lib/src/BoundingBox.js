define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BoundingBox = /** @class */ (function () {
        function BoundingBox(center, halfDimension) {
            this.center = center;
            this.halfDimension = halfDimension;
        }
        BoundingBox.prototype.containsPoint = function (point) {
            if (point.x < (this.center.x - this.halfDimension)) {
                return false;
            }
            if (point.y < (this.center.y - this.halfDimension)) {
                return false;
            }
            if (point.x > (this.center.x + this.halfDimension)) {
                return false;
            }
            if (point.y > (this.center.y + this.halfDimension)) {
                return false;
            }
            return true;
        };
        BoundingBox.prototype.intersectsAABB = function (other) {
            if (other.center.x + other.halfDimension < this.center.x - this.halfDimension) {
                return false;
            }
            if (other.center.y + other.halfDimension < this.center.y - this.halfDimension) {
                return false;
            }
            if (other.center.x - other.halfDimension > this.center.x + this.halfDimension) {
                return false;
            }
            if (other.center.y - other.halfDimension > this.center.y + this.halfDimension) {
                return false;
            }
            return true;
        };
        return BoundingBox;
    }());
    exports.BoundingBox = BoundingBox;
});
//# sourceMappingURL=BoundingBox.js.map