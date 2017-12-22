define(["require", "exports", "three", "./BoundingBox"], function (require, exports, three_1, BoundingBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuadTree = /** @class */ (function () {
        function QuadTree(data, capacity, pos, bounds) {
            this.data = [];
            this.capacity = capacity;
            this.pos = pos;
            if (bounds) {
                this.bounds = bounds;
            }
            else {
                var min = data.reduce(function (min, item) { return min.min(pos(item)); }, pos(data[0]));
                var max = data.reduce(function (max, item) { return max.max(pos(item)); }, pos(data[0]));
                var center = new three_1.Vector2().addVectors(min, max).multiplyScalar(0.5);
                var size = Math.max(max.x - min.x, max.y - min.y);
                this.bounds = new BoundingBox_1.BoundingBox(center, size / 2);
            }
            if (data != null) {
                data.forEach(this.insert.bind(this));
            }
        }
        QuadTree.prototype.isLeaf = function () {
            return !!!this.northWest;
        };
        QuadTree.prototype.insert = function (item) {
            var p = this.pos(item);
            if (!this.bounds.containsPoint(p)) {
                return false;
            }
            if (this.data != null && this.data.length < this.capacity) {
                this.data.push(item);
                return true;
            }
            if (this.isLeaf()) {
                this.subdivide();
            }
            return this.northWest.insert(item) || this.northEast.insert(item) || this.southWest.insert(item) || this.southEast.insert(item);
        };
        QuadTree.prototype.subdivide = function () {
            var _this = this;
            var box;
            var newBoundary = this.bounds.halfDimension / 2;
            box = new BoundingBox_1.BoundingBox({
                x: this.bounds.center.x - newBoundary,
                y: this.bounds.center.y + newBoundary,
            }, newBoundary);
            this.northWest = new QuadTree([], this.capacity, this.pos, box);
            box = new BoundingBox_1.BoundingBox({
                x: this.bounds.center.x + newBoundary,
                y: this.bounds.center.y + newBoundary
            }, newBoundary);
            this.northEast = new QuadTree([], this.capacity, this.pos, box);
            box = new BoundingBox_1.BoundingBox({
                x: this.bounds.center.x - newBoundary,
                y: this.bounds.center.y - newBoundary
            }, newBoundary);
            this.southWest = new QuadTree([], this.capacity, this.pos, box);
            box = new BoundingBox_1.BoundingBox({
                x: this.bounds.center.x + newBoundary,
                y: this.bounds.center.y - newBoundary
            }, newBoundary);
            this.southEast = new QuadTree([], this.capacity, this.pos, box);
            this.data.forEach(function (item) {
                _this.northWest.insert(item) ||
                    _this.northEast.insert(item) ||
                    _this.southEast.insert(item) ||
                    _this.southWest.insert(item);
            });
            this.data = null;
        };
        /**
         * Returns a list of items within the given bounding box.
         */
        QuadTree.prototype.queryRange = function (range) {
            var _this = this;
            var pointsInRange = [];
            if (!this.bounds.intersectsAABB(range)) {
                return pointsInRange;
            }
            pointsInRange = this.data ? this.data.filter(function (item) { return range.containsPoint(_this.pos(item)); }) : [];
            if (this.isLeaf()) {
                return pointsInRange;
            }
            pointsInRange.push.apply(pointsInRange, this.northWest.queryRange(range));
            pointsInRange.push.apply(pointsInRange, this.northEast.queryRange(range));
            pointsInRange.push.apply(pointsInRange, this.southWest.queryRange(range));
            pointsInRange.push.apply(pointsInRange, this.southEast.queryRange(range));
            return pointsInRange;
        };
        QuadTree.prototype.mapReduce = function (f) {
            var data = this.data != null ? f(this.data) : null;
            var center = new three_1.Vector2(this.bounds.center.x, this.bounds.center.y);
            var mapped = new QuadTree(data ? [data] : null, 1, function (item) { return center; }, this.bounds);
            if (this.northWest)
                mapped.northWest = this.northWest.mapReduce(f);
            if (this.northEast)
                mapped.northEast = this.northEast.mapReduce(f);
            if (this.southEast)
                mapped.southEast = this.southEast.mapReduce(f);
            if (this.southWest)
                mapped.southWest = this.southWest.mapReduce(f);
            return mapped;
        };
        return QuadTree;
    }());
    exports.default = QuadTree;
});
//# sourceMappingURL=QuadTree.js.map