/**
 * Height between -1.0 and 1.0:
 * [-1.00,-0.25) == deep water
 * [-0.25,+0.00) == shallow water
 * [+0.00,+0.25) == flat land
 * [+0.25,+0.75) == hills
 * [+0.75,+1.00] == mountains
 */
export declare type Height = number;
export interface TileData {
    q: number;
    r: number;
    height: Height;
    fog: boolean;
    clouds: boolean;
    terrain: string;
    rivers?: {
        riverIndex: number;
        riverTileIndex: number;
    }[];
    treeIndex?: number;
}
export declare function isLand(height: Height): boolean;
export declare function isWater(height: Height): boolean;
export declare function isHill(height: Height): boolean;
export declare function isMountain(height: Height): boolean;
export interface TextureAtlas {
    textures: {
        [name: string]: Cell;
    };
    image: string;
    width: number;
    height: number;
    cellSize: number;
    cellSpacing: number;
}
export interface Cell {
    cellX: number;
    cellY: number;
}
export interface QR {
    q: number;
    r: number;
}
export interface TileDataSource {
    getTile(q: number, r: number): TileData;
    updateTiles(tiles: TileData[]): void;
}
