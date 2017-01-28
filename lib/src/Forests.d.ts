/// <reference types="three" />
import { TileData } from "./interfaces";
import { Object3D, Texture } from "three";
import Grid from "./Grid";
export interface Options {
    /**
     * Scaling factor for tile size, e.g. 1.0 if the tile size is not changed.
     */
    mapScale: number;
    /**
     * Size of trees > 0.0.
     */
    treeSize: number;
    /**
     * Spritesheet with n columns and rows, where n equals the option spritesheetSubdivisions.
     */
    spritesheet: Texture;
    /**
     * Number of spritesheet subdivisions, i.e. columns and rows.
     */
    spritesheetSubdivisions: number;
    /**
     * Number of trees that are rendered per forest.
     */
    treesPerForest: number;
    /**
     * Parts of the tree sprite whose opacity is lower than this value will not be rendered,
     * i.e. the transparent background. Valid values are between 0.0 and 1.0.
     */
    alphaTest: number;
}
export default class Forests extends Object3D {
    private _forestTiles;
    private _globalGrid;
    private _options;
    private _trees;
    constructor(tiles: TileData[], globalGrid: Grid<TileData>, options: Options);
    updateTiles(tiles: TileData[]): void;
}
