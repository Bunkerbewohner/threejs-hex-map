import { Height, TileData } from "./interfaces";
import Grid from './Grid';
/**
 * Generates are square map of the given size centered at (0,0).
 * @param size
 * @param heightAt
 * @param terrainAt
 */
export declare function generateMap(size: number, tile: (q: number, r: number) => TileData): Promise<Grid<TileData>>;
export declare function generateRandomMap(size: number, tile: (q: number, r: number, height: Height) => TileData): Promise<Grid<TileData>>;
