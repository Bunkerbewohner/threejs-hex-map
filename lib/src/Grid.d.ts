import { QR } from './interfaces';
export default class Grid<T extends QR> {
    private _width;
    private _height;
    private data;
    private halfWidth;
    private halfHeight;
    readonly length: number;
    readonly width: number;
    readonly height: number;
    constructor(_width: number, _height: number);
    forEachQR(f: (q: number, r: number, existingItem?: T) => void): this;
    /**
     * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
     * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
     */
    forEachIJ(f: (i: number, j: number, q: number, r: number, item?: T) => void): this;
    init(items: T[]): this;
    initQR(f: (q: number, r: number, existingItem?: T) => T): this;
    mapQR<R extends QR>(f: (q: number, r: number, existingItem?: T) => R): Grid<R>;
    toArray(): T[];
    get(q: number, r: number): T | undefined;
    getOrCreate(q: number, r: number, defaultValue: T): T;
    add(q: number, r: number, item: T): void;
    static NEIGHBOR_QRS: {
        q: number;
        r: number;
    }[];
    neighbors(q: number, r: number, range?: number): T[];
    /**
     * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
     * Non-existing neighbors will occur as "undefined". The list is always returned
     * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
     * @param q
     * @param r
     * @returns {{q: number, r: number}[]}
     */
    surrounding(q: number, r: number): T[];
}
