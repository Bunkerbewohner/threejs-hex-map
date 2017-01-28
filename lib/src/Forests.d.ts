/// <reference types="three" />
import { TileData } from "./interfaces";
import { Object3D, Texture } from "three";
import Grid from "./Grid";
export interface Options {
    mapScale: number;
    treeSize: number;
    spritesheet: Texture;
    spritesheetSubdivisions: number;
    treesPerForest: number;
}
export default class Forests extends Object3D {
    private _forestTiles;
    private _globalGrid;
    private _options;
    private _trees;
    constructor(tiles: TileData[], globalGrid: Grid<TileData>, options: Options);
    updateTiles(tiles: TileData[]): void;
}
