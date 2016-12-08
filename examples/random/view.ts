import MapView from '../../src/MapView';
import { loadFile, loadJSON, loadTexture } from '../../src/util';
import { TextureAtlas, isMountain, isWater, TileData } from '../../src/interfaces';
import {generateRandomMap} from "../../src/map-generator"
import { varying } from './util';
import { TextureLoader } from 'three'
import { MapMeshOptions } from '../../src/MapMesh';

function asset(relativePath: string): string {
    return "../../assets/" + relativePath
}

async function loadTextureAtlas() {
    return loadJSON<TextureAtlas>(asset("land-atlas.json"))
}

async function generateMap(mapSize: number) {        
    return generateRandomMap(mapSize, (q, r, height) => {            
        const terrain = (height < 0 && "water") || (height > 0.75 && "mountain") || varying("grass", "plains")
        const trees = !isMountain(height) && !isWater(height) && varying(true, false)
        return {q, r, height, terrain, trees, river: null, fog: true, clouds: true }
    })
}

export async function initView(mapSize: number, initialZoom: number): Promise<MapView> {
    const textureLoader = new TextureLoader()
    const loadTexture = (name: string) => textureLoader.load(asset(name))    
    const options: MapMeshOptions = {
        terrainAtlas: null,
        terrainAtlasTexture: loadTexture("terrain-diffuse.png"),
        hillsNormalTexture: loadTexture("hills-normal.png"),
        coastAtlasTexture: loadTexture("coast-diffuse.png"),
        riverAtlasTexture: loadTexture("river-diffuse.png"),
        undiscoveredTexture: loadTexture("paper.jpg"),
        treeTexture: loadTexture("tree.png")
    }
    const [map, atlas] = await Promise.all([generateMap(mapSize), loadTextureAtlas()])
    options.terrainAtlas = atlas

    const mapView = new MapView()
    mapView.setZoom(initialZoom)
    mapView.load(map, options)

    mapView.onLoaded = () => {
        setFogAround(mapView, mapView.selectedTile, 6, true, false)
        setFogAround(mapView, mapView.selectedTile, 2, false, false)
    }

    mapView.onTileSelected = (tile: TileData) => {
        setFogAround(mapView, tile, 2, false, false)
    }

    return mapView
}

function setFogAround(mapView: MapView, tile: TileData, range: number, fog: boolean, clouds: boolean) {
    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range)

    const updated = tiles.map(t => {
        t.fog = fog
        t.clouds= clouds
        return t
    })

    mapView.updateTiles(updated)
}