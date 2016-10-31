import {PerspectiveCamera, Scene} from "three"
import {generateRandomMap} from "../../src/map-generator"
import MapMesh from "../../src/map-mesh"
import {TextureAtlas} from "../../src/interfaces"
import {loadFile} from "../../src/util"
import {Promise} from "es6-promise"

var lastTimestamp = Date.now()

const mapSize = (parseInt(localStorage.getItem("size"))) || 96

var zoom = (parseFloat(localStorage.getItem("zoom"))) || 25

const vScroll     = new THREE.Vector3(0, 0, 0)
const scrollSpeed = 10

const camera    = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
const scene     = new Scene()
const renderer  = new THREE.WebGLRenderer({
    canvas: document.getElementsByTagName("canvas")[0],
    devicePixelRatio: window.devicePixelRatio
})

const keyCodes = {
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
}

interface KeyActions {
    [keyCode: number]: KeyAction;
}

interface KeyAction {
    down?: () => void; // function to call when key is pressed
    up?: () => void; // function to call when key is released
}

const keyActions: KeyActions = {
    [keyCodes.LEFT_ARROW]: {
        down: () => vScroll.x = -1,
        up: () => vScroll.x = 0 
    },
    [keyCodes.RIGHT_ARROW]: {
        down: () => vScroll.x = 1,
        up: () => vScroll.x = 0
    },
    [keyCodes.UP_ARROW]: {
        down: () => vScroll.y = 1,
        up: () => vScroll.y = 0
    },
    [keyCodes.DOWN_ARROW]: {
        down: () => vScroll.y = -1,
        up: () => vScroll.y = 0
    }
}

function onKeyDown(event: KeyboardEvent) {
    const actions = keyActions[event.keyCode]

    if (actions && "down" in actions) {
        actions["down"]()
    }
}

function onKeyUp(event: KeyboardEvent) {
    const actions = keyActions[event.keyCode]

    if (actions && "up" in actions) {
        actions["up"]()
    }
}

function onWindowResize(event: Event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onExit() {
    localStorage.setItem("zoom", camera.position.z+"")
    localStorage.setItem("size", mapSize+"")
}

function animate(timestamp: number) {
    const dtS = (timestamp - lastTimestamp) / 1000.0

    const scroll = vScroll.clone().normalize().multiplyScalar(scrollSpeed * dtS)
    camera.position.add(scroll)

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    lastTimestamp = timestamp
}

if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
    document.getElementsByTagName("canvas")[0].style.display = "none"
    document.write("Your browser is not supported (missing extension ANGLE_instanced_arrays)")
} else {
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('beforeunload', onExit, false)
    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
    renderer.setClearColor(0x6495ED);
    renderer.setSize(window.innerWidth, window.innerHeight)
    init()
    animate(0)
}

function init() {    
    camera.position.z = zoom
    camera.rotation.x = Math.PI / 4.5    

    const textureAtlas = loadFile("land-atlas.json").then(json => JSON.parse(json))
    const tiles = generateRandomMap(mapSize, (q, r, h) => {
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