import MapView from '../../src/MapView';
import { loadFile, loadJSON } from '../../src/util';
import { TextureAtlas, isMountain, isWater } from '../../src/interfaces';
import {generateRandomMap} from "../../src/map-generator"
import { varying } from './util';

async function loadTextureAtlas() {
    return loadJSON<TextureAtlas>("land-atlas.json")
}

async function generateMap(mapSize: number) {        
    return generateRandomMap(mapSize, (q, r, height) => {            
        const terrain = (height < 0 && "water") || (height > 0.75 && "mountain") || varying("grass", "plains")
        const trees = !isMountain(height) && !isWater(height) && varying(true, false)
        return {q, r, height, terrain, trees, river: null, fog: false, clouds: false }
    })
}

export async function initView(mapSize: number, initialZoom: number): Promise<MapView> {
    const [map, atlas] = await Promise.all([generateMap(mapSize), loadTextureAtlas()])
    const mapView = new MapView()
    mapView.setZoom(initialZoom)
    mapView.load(map, atlas)

    return mapView
}