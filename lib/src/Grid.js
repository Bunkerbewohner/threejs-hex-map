define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    var Grid = (function () {
        function Grid(_width, _height) {
            this._width = _width;
            this._height = _height;
            this.data = [];
            this.halfWidth = this._width / 2;
            this.halfHeight = this._height / 2;
            if (_width % 2 != 0 || _height % 2 != 0) {
                throw new Error("With and height of grid must be divisible by 2");
            }
            this.data = [];
        }
        Object.defineProperty(Grid.prototype, "length", {
            get: function () {
                return this._width * this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Grid.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Grid.prototype.forEachQR = function (f) {
            var _a = this, _width = _a._width, _height = _a._height;
            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                    var q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
                    var r = j;
                    f(q, r, this.get(q, r));
                }
            }
            return this;
        };
        /**
         * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
         * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
         */
        Grid.prototype.forEachIJ = function (f) {
            var _a = this, _width = _a._width, _height = _a._height;
            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                    var q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
                    var r = j;
                    f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r));
                }
            }
            return this;
        };
        Grid.prototype.init = function (items) {
            var _this = this;
            items.forEach(function (item) {
                _this.add(item.q, item.r, item);
            });
            return this;
        };
        Grid.prototype.initQR = function (f) {
            var _this = this;
            return this.forEachQR(function (q, r, item) { return _this.add(q, r, f(q, r, item)); });
        };
        Grid.prototype.mapQR = function (f) {
            var mapped = new Grid(this._width, this._height);
            this.forEachQR(function (q, r, item) { return mapped.add(q, r, f(q, r, item)); });
            return mapped;
        };
        Grid.prototype.toArray = function () {
            var arr = new Array(this._width * this._height);
            var i = 0;
            for (var q in this.data) {
                for (var r in this.data[q]) {
                    arr[i++] = this.data[q][r];
                }
            }
            return arr;
        };
        Grid.prototype.get = function (q, r) {
            var col = this.data[q];
            if (col) {
                return col[r];
            }
            else {
                return undefined;
            }
        };
        Grid.prototype.getOrCreate = function (q, r, defaultValue) {
            var col = this.data[q];
            if (!col) {
                this.data[q] = [];
                this.data[q][r] = defaultValue;
                return defaultValue;
            }
            var cell = col[r];
            if (!cell) {
                this.data[q][r] = defaultValue;
                return defaultValue;
            }
            return cell;
        };
        Grid.prototype.add = function (q, r, item) {
            if (q in this.data) {
                this.data[q][r] = item;
            }
            else {
                var col = this.data[q] = [];
                col[r] = item;
            }
        };
        Grid.prototype.neighbors = function (q, r, range) {
            var _this = this;
            if (range === void 0) { range = 1; }
            return util_1.qrRange(range).map(function (qr) {
                return _this.get(q + qr.q, r + qr.r);
            }).filter(function (x) { return x !== undefined; });
        };
        return Grid;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Grid;
});
//# sourceMappingURL=Grid.js.map