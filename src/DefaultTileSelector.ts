import { createHexagon } from './hexagon';
import { RingGeometry, MeshBasicMaterial, Mesh } from "three"

const geometry = new RingGeometry(0.85, 1, 6, 2)
const material = new MeshBasicMaterial({
    color: 0xffff00
})
const selector = new Mesh(geometry, material)
selector.rotateZ(Math.PI/2)

export default selector