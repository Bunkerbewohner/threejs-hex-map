define(["require", "exports", "three", "../../src/map-generator", "../../src/map-mesh"], function (require, exports, three_1, map_generator_1, map_mesh_1) {
    "use strict";
    var camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    var scene = new three_1.Scene();
    var renderer = new THREE.WebGLRenderer({
        canvas: document.getElementsByTagName("canvas")[0],
        devicePixelRatio: window.devicePixelRatio
    });
    function onWindowResize(event) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate(timestamp) {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
        document.getElementsByTagName("canvas")[0].style.display = "none";
        document.write("Your browser is not supported (missing extension ANGLE_instanced_arrays)");
    }
    else {
        window.addEventListener('resize', onWindowResize, false);
        renderer.setClearColor(0x6495ED);
        renderer.setSize(window.innerWidth, window.innerHeight);
        init();
        animate(0);
    }
    function init() {
        map_generator_1.generateRandomMap(96).then(function (tiles) {
            var mesh = new map_mesh_1.default(tiles);
            scene.add(mesh);
        });
    }
});
