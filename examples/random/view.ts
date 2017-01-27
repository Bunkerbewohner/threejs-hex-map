import MapView from '../../src/MapView';
import { loadFile, loadJSON, loadTexture } from '../../src/util';
import { TextureAtlas, isMountain, isWater, TileData } from '../../src/interfaces';
import {generateRandomMap} from "../../src/map-generator"
import { varying } from './util';
import { TextureLoader } from 'three'
import { MapMeshOptions } from '../../src/MapMesh';
import DefaultMapViewController from "../../src/DefaultMapViewController"

function asset(relativePath: string): string {
    return "../../assets/" + relativePath
}

async function loadTextureAtlas() {
    return loadJSON<TextureAtlas>(asset("land-atlas.json"))
}

async function generateMap(mapSize: number) {
    function coldZone(q: number, r: number, height: number): string {
        if (Math.abs(r) > mapSize * (0.44 + Math.random() * 0.03)) return "snow"
        else return "tundra"
    }

    function warmZone(q: number, r: number, height: number): string {
        return varying("grass", "grass", "grass", "plains", "plains", "desert")
    }

    function terrainAt(q: number, r: number, height: number): string {
        if (height < 0) return "water"
        else if (height > 0.75) return "mountain"
        else if (Math.abs(r) > mapSize * 0.4) return coldZone(q, r, height)
        else return warmZone(q, r, height)
    }

    function treeAt(q: number, r: number, terrain: string): number | undefined {
        if (terrain == "snow") return 3
        else if (terrain == "tundra") return 2
        else if (Math.abs(r) < mapSize * 0.1) return 0 // tropical
        else return 1
    }

    return generateRandomMap(mapSize, (q, r, height): TileData => {
        const terrain = terrainAt(q, r, height)
        const trees = isMountain(height) || isWater(height) || terrain == "desert" ? undefined :
            varying(true, false) && treeAt(q, r, terrain)
        return {q, r, height, terrain, treeIndex: trees, river: null, fog: false, clouds: false }
    })
}

export async function initView(mapSize: number, initialZoom: number): Promise<MapView> {
    const textureLoader = new TextureLoader()
    const loadTexture = (name: string) => textureLoader.load(asset(name))    
    const options: MapMeshOptions = {
        terrainAtlas: null,
        terrainAtlasTexture: loadTexture("terrain.png"),
        hillsNormalTexture: loadTexture("hills-normal-2.png"),
        coastAtlasTexture: loadTexture("coast-diffuse.png"),
        riverAtlasTexture: loadTexture("river-diffuse.png"),
        undiscoveredTexture: loadTexture("paper.jpg"),
        treeTextures: ["1", "2", "3", "4"].map(nr => loadTexture(`tree${nr}.png`)),
        transitionTexture: loadTexture("transitions.png")
    }
    const [map, atlas] = await Promise.all([generateMap(mapSize), loadTextureAtlas()])
    options.terrainAtlas = atlas

    const mapView = new MapView()
    mapView.zoom = initialZoom
    mapView.load(map, options)

    const controller = mapView.controller as DefaultMapViewController
    controller.debugOutput = document.getElementById("debug") as HTMLElement

    mapView.onLoaded = () => {
        // uncover tiles around initial selection
        //setFogAround(mapView, mapView.selectedTile, 10, true, false)
        //setFogAround(mapView, mapView.selectedTile, 5, false, false)
    }

    mapView.onTileSelected = (tile: TileData) => {
        // uncover tiles around selection
        setFogAround(mapView, tile, 2, false, false)
    }

    return mapView
}

/**
 * @param fog whether there should be fog on this tile making it appear darker
 * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
 * @param range number of tiles around the given tile that should be updated
 * @param tile tile around which fog should be updated
 */
function setFogAround(mapView: MapView, tile: TileData, range: number, fog: boolean, clouds: boolean) {
    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range)

    const updated = tiles.map(t => {
        t.fog = fog
        t.clouds= clouds
        return t
    })

    mapView.updateTiles(updated)
}