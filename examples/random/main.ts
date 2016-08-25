import {PerspectiveCamera, Scene} from "three"
import {generateRandomMap} from "../../src/map-generator"
import MapMesh from "../../src/map-mesh"
import {TextureAtlas} from "../../src/interfaces"
import {loadFile} from "../../src/util"
import {Promise} from "es6-promise"

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
    var zoom = (parseFloat(localStorage.getItem("zoom"))) || 25
    camera.position.z = zoom
    camera.rotation.x = Math.PI / 4.5

    const textureAtlas = loadFile("land-atlas.json").then(json => JSON.parse(json))
    const tiles = generateRandomMap(96, (q, r, h) => {
        if (h < 0) return "water";
        if (h > 0.75) return "mountain";
        if (Math.random() > 0.5) return "grass"
        else return "plains"
    })

    Promise.all([textureAtlas, tiles]).then(([textureAtlas, tiles]) => {
        const mesh = new MapMesh(tiles, textureAtlas)
        mesh.position.y = zoom * 0.95
        scene.add(mesh)
    })
}