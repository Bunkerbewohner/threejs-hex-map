/// <reference types="three" />
import { TileData, TextureAtlas, TileDataSource } from './interfaces';
import { Texture, Group, Sphere } from "three";
import Grid from "./Grid";
export interface MapMeshOptions {
    /**
     * Texture containing the sub textures referenced in the terrain texture atlas.
     */
    terrainAtlasTexture: Texture;
    /**
     * Texture atlas describing the sub textures for each terrain type.
     */
    terrainAtlas: TextureAtlas;
    /**
     * Texture with blend masks for transitions between terrains
     */
    transitionTexture: Texture;
    /**
     * River tile atlas texture containing parts for each possible river variation.
     * Use /tools/river-atlas.py to generate.
     */
    riverAtlasTexture: Texture;
    /**
     * Coast tile atlas texture containg parts for each possible coast variation.
     * Use /tools/coast-atlas.py to generate.
     */
    coastAtlasTexture: Texture;
    /**
     * The texture used for undiscovered tiles
     */
    undiscoveredTexture: Texture;
    /**
     * Normal map for hills
     */
    hillsNormalTexture: Texture;
    /**
     * Diffuse map for tree sprites
     */
    treeTextures: Texture[];
    /**
     * Default 1.0
     */
    treeSize?: number;
    /**
     * Overall scale of the geometry. Default 1.0
     */
    scale?: number;
    /**
     * GLSL code of the land fragment shader. For default see /src/shaders/land.fragment.ts.
     */
    landFragmentShader?: string;
    /**
     * GLSL code of the land vertex shader. For default see /src/shaders/land.vertex.ts.
     */
    landVertexShader?: string;
    /**
     * GLSL code of the mountain fragment shader. For default see /src/shaders/mountains.fragment.ts.
     */
    mountainsFragmentShader?: string;
    /**
     * GLSL code of the mountain vertex shader. For default see /src/shaders/mountains.vertex.ts.
     */
    mountainsVertexShader?: string;
}
export interface TextureReplacements {
    terrainAtlasTexture?: Texture;
    riverAtlasTexture?: Texture;
    coastAtlasTexture?: Texture;
    undiscoveredTexture?: Texture;
    treeTexture?: Texture;
}
export default class MapMesh extends Group implements TileDataSource {
    private options;
    /**
     * List of tiles displayed in this mesh
     */
    private tiles;
    /**
     * Grid of the tiles displayed in this mesh containing the same elements as this.tiles
     */
    private localGrid;
    /**
     * Global grid of all tiles, even the ones not displayed in this mesh
     */
    private globalGrid;
    private land;
    private mountains;
    private trees;
    boundingSphere: Sphere;
    readonly loaded: Promise<void>;
    private _showGrid;
    showGrid: boolean;
    /**
     * @param _tiles the tiles to actually render in this mesh
     * @param grid the grid with all tiles, including the ones that are not rendered in this mesh
     * @param options map mesh configuration options
     */
    constructor(tiles: TileData[], options: MapMeshOptions, globalGrid?: Grid<TileData>);
    /**
     * "Hot-swaps" the given textures.
     * @param textures
     */
    replaceTextures(textures: TextureReplacements): void;
    updateTiles(tiles: TileData[]): void;
    getTile(q: number, r: number): TileData;
    /**
     * Updates only fog and clouds visualization of existing tiles.
     * @param tiles changed tiles
     */
    updateFogAndClouds(tiles: TileData[]): void;
    private updateFogStyle(attr, index, fog, clouds);
    private createTrees();
    private createLandMesh(tiles);
    private createMountainMesh(tiles);
}
