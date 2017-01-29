/// <reference types="three" />
import { TileData, TextureAtlas, TileDataSource } from './interfaces';
import { Texture, Group, Sphere, Color } from "three";
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
    treeSpritesheet: Texture;
    /**
     * Number of horizontal and vertical spritesheet subdivisions
     */
    treeSpritesheetSubdivisions: number;
    /**
     * Default 1.0
     */
    treeSize?: number;
    /**
     * Parts of the tree sprite whose opacity is lower than this value will not be rendered,
     * i.e. the transparent background. Valid values are between 0.0 and 1.0. Default is 0.2.
     */
    treeAlphaTest?: number;
    /**
     * Default 50
     */
    treesPerForest?: number;
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
    /**
     * Color of the hex grid
     * Default: 0xffffff (white)
     */
    gridColor?: Color;
    /**
     * Width of the grid lines as a normalized scaling factor relative to the area of the tile.
     * Default: 0.02 (2%)
     */
    gridWidth?: number;
    /**
     * Opacity between 0.0 (invisible) and 1.0 (opaque).
     * Default value: 0.33 (33%)
     */
    gridOpacity?: number;
}
export interface MapMeshTile extends TileData {
    /**
     * Index of this tile in its vertex buffer
     */
    bufferIndex: number;
    isMountain: boolean;
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
     * @param tiles the tiles to actually render in this mesh
     * @param globalGrid the grid with all tiles, including the ones that are not rendered in this mesh
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
