var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./interfaces", "./hexagon", "three", "es6-promise"], function (require, exports, interfaces_1, hexagon_1, three_1, es6_promise_1) {
    "use strict";
    var textureLoader = new three_1.TextureLoader();
    var fileLoader = new three_1.XHRLoader();
    var MapMesh = (function (_super) {
        __extends(MapMesh, _super);
        function MapMesh(_tiles) {
            _super.call(this);
            this._tiles = _tiles;
            this.createLandMesh(_tiles.filter(function (t) { return interfaces_1.isLand(t.height); }));
            this.createWaterMesh(_tiles.filter(function (t) { return interfaces_1.isWater(t.height); }));
            this.createMountainMesh(_tiles.filter(function (t) { return interfaces_1.isMountain(t.height); }));
        }
        MapMesh.prototype.createLandMesh = function (tiles) {
            var _this = this;
            MapMesh.landProps.onLoaded(function (diffuseMap, fragmentShader, vertexShader) {
                var geometry = createHexagonTilesGeometry(tiles, 0);
                var material = new THREE.RawShaderMaterial({
                    uniforms: {
                        sineTime: { value: 0.0 },
                        viewCenter: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
                        camera: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
                        texture: { type: "t", value: diffuseMap }
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    side: THREE.FrontSide,
                    wireframe: false,
                    transparent: false
                });
                _this.land = new three_1.Mesh(geometry, material);
                _this.add(_this.land);
            });
        };
        MapMesh.prototype.createWaterMesh = function (tiles) {
        };
        MapMesh.prototype.createMountainMesh = function (tiles) {
        };
        MapMesh.landProps = {
            diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
            fragmentShader: fileLoader.load("../../src/shaders/terrain.fragment.glsl?cachebuster=" + Math.random() * 9999999),
            vertexShader: fileLoader.load("../../src/shaders/terrain.vertex.glsl?cachebuster=" + Math.random() * 9999999),
            onLoaded: function (callback) {
                es6_promise_1.Promise.all([
                    MapMesh.landProps.diffuseMap,
                    MapMesh.landProps.fragmentShader,
                    MapMesh.landProps.vertexShader
                ]).then(function (values) {
                    callback(values[0], values[1], values[2]);
                });
            }
        };
        MapMesh.waterProps = {
            diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
            fragmentShader: fileLoader.load("shaders/water.fragment.glsl?cachebuster=" + Math.random() * 9999999),
            vertexShader: fileLoader.load("shaders/water.vertex.glsl?cachebuster=" + Math.random() * 9999999)
        };
        MapMesh.mountainProps = {
            diffuseMap: textureLoader.load("textures/terrain-diffuse.png"),
            fragmentShader: fileLoader.load("shaders/mountains.fragment.glsl?cachebuster=" + Math.random() * 9999999),
            vertexShader: fileLoader.load("shaders/mountains.vertex.glsl?cachebuster=" + Math.random() * 9999999)
        };
        return MapMesh;
    }(THREE.Group));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapMesh;
    function createHexagonTilesGeometry(tiles, numSubdivisions) {
        var hexagon = hexagon_1.createHexagon(1.0, numSubdivisions);
        var geometry = new three_1.InstancedBufferGeometry();
        geometry.maxInstancedCount = tiles.length;
        geometry.addAttribute("position", hexagon.attributes.position);
        geometry.addAttribute("uv", hexagon.attributes.uv);
        geometry.addAttribute("border", hexagon.attributes.border);
        // positions for each hexagon tile
        var tilePositions = tiles.map(function (tile) { return new three_1.Vector2(Math.sqrt(3) * (tile.q + tile.r / 2), 3 / 2 * tile.r); });
        var posAttr = new THREE.InstancedBufferAttribute(new Float32Array(tilePositions.length * 3), 2, 1);
        posAttr.copyVector2sArray(tilePositions);
        geometry.addAttribute("offset", posAttr);
        return geometry;
    }
});
