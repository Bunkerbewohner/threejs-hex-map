import { initView } from "view"
import { initInput } from "input"
import { paramInt, paramFloat } from './util';
import { qrRange, range } from '../../src/util';

const mapSize = paramInt("size", 96)
const zoom = paramFloat("zoom", 25)

async function init() {
    const mapView = await initView(mapSize, zoom)
    initInput(mapView)
}

init()

