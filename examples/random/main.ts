import {PerspectiveCamera, Scene} from "three"
import {generateRandomMap} from "../../src/map-generator";
import MapMesh from "../../src/map-mesh";

const camera    = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
const scene     = new Scene()
const renderer  = new THREE.WebGLRenderer({
    canvas: document.getElementsByTagName("canvas")[0],
    devicePixelRatio: window.devicePixelRatio
})

function onWindowResize(event: Event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(timestamp: number) {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
    document.getElementsByTagName("canvas")[0].style.display = "none"
    document.write("Your browser is not supported (missing extension ANGLE_instanced_arrays)")
} else {
    window.addEventListener('resize', onWindowResize, false);
    renderer.setClearColor(0x6495ED);
    renderer.setSize(window.innerWidth, window.innerHeight)
    init()
    animate(0)
}

function init() {
    generateRandomMap(96).then(tiles => {
        const mesh = new MapMesh(tiles)
        scene.add(mesh)
    })
}