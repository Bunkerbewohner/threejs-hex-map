define(["require", "exports"], function (require, exports) {
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
        return TileGrid;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TileGrid;
});
