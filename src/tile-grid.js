define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    var TileGrid = (function () {
        function TileGrid(_tiles) {
            this._tiles = _tiles;
            this.grid = [];
            for (var _i = 0, _tiles_1 = _tiles; _i < _tiles_1.length; _i++) {
                var tile = _tiles_1[_i];
                if (typeof this.grid[tile.q] == "undefined") {
                    this.grid[tile.q] = [];
                }
                this.grid[tile.q][tile.r] = tile;
            }
        }
        TileGrid.prototype.get = function (q, r) {
            if (typeof this.grid[q] == "undefined")
                return null;
            else if (typeof this.grid[q][r] == "undefined")
                return null;
            return this.grid[q][r];
        };
        TileGrid.prototype.neighbors = function (q, r) {
            var _this = this;
            return util_1.qrRange(1).map(function (qr) {
                return _this.get(q + qr.q, r + qr.r);
            }).filter(function (x) { return x != null; });
        };
        TileGrid.prototype.list = function () {
            var tiles = [];
            for (var i in this.grid) {
                for (var j in this.grid[i]) {
                    var tile = this.grid[i][j];
                    if (tile) {
                        tiles.push(tile);
                    }
                }
            }
            return tiles;
        };
        return TileGrid;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TileGrid;
});
