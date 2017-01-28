/// <reference types="three" />
import { Height, TileData } from "./interfaces";
import Grid from './Grid';
import { Vector3 } from "three";
/**
 * Generates are square map of the given size centered at (0,0).
 * @param size
 * @param heightAt
 * @param terrainAt
 */
export declare function generateMap(size: number, tile: (q: number, r: number) => TileData): Promise<Grid<TileData>>;
export declare function generateRandomMap(size: number, tile: (q: number, r: number, height: Height) => TileData): Promise<Grid<TileData>>;
/**
 * Indicates in which directions there is water from NE (North East) to NW (North West).
 */
export interface WaterAdjacency {
    NE: boolean;
    E: boolean;
    SE: boolean;
    SW: boolean;
    W: boolean;
    NW: boolean;
}
/**
 * Computes the water adjecency for the given tile.
 * @param grid grid with all tiles to be searched
 * @param tile tile to look at
 */
export declare function waterAdjacency(grid: Grid<TileData>, tile: TileData): WaterAdjacency;
/**
 * Returns a random point on a hex tile considering adjacent water, i.e. avoiding points on the beach.
 * @param water water adjacency of the tile
 * @param scale coordinate scale
 * @returns {THREE.Vector3} local position
 */
export declare function randomPointOnCoastTile(water: WaterAdjacency, scale?: number): Vector3;
