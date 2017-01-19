import { initView } from "view"
import { initInput } from "input"
import { paramInt, paramFloat } from './util';
import { qrRange, range } from '../../src/util';
import MapView from "../../src/MapView";

const mapSize = paramInt("size", 96)
const zoom = paramFloat("zoom", 25)

async function init() {
    const mapView = await initView(mapSize, zoom)
    initInput(mapView)

    // texture swap
    const containers = document.querySelectorAll("#textures div")
    console.log(containers)
    for (let i = 0; i < containers.length; i++) {
        const container = containers.item(i)
        const name = container.id

        container.addEventListener("dragenter", noop, false)
        container.addEventListener("dragexit", noop, false)
        container.addEventListener("dragover", noop, false)
        container.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault()
            replaceTexture(mapView, name, e.dataTransfer.files[0])
        }, false)
    }
}


function noop(e: DragEvent) {
    e.preventDefault()
}

function replaceTexture(mapView: MapView, name: string, image: File) {
    const img = document.createElement("img")
    img.onload = () => {
        console.log("Replacing texture " + name + "...")
        const texture = new THREE.Texture(img)
        mapView.mapMesh.replaceTextures({[name]: texture})
    }

    const reader = new FileReader()
    reader.onload = (e: any) => {
        img.src = e.target.result
    }

    reader.readAsDataURL(image)
}

init()

