import { QR } from './interfaces';
import {qrRange, range, isInteger} from './util';
import { Vector3 } from 'three';

export default class Grid<T extends QR> {
    private data: T[][] = []
    private halfWidth = this._width / 2
    private halfHeight = this._height / 2

    get length(): number {
        return this._width * this._height
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    constructor(private _width: number, private _height: number) {
        if (_width % 2 != 0 || _height % 2 != 0) {
            throw new Error("With and height of grid must be divisible by 2")
        }
        this.data = []
    }

    forEachQR(f: (q: number, r: number, existingItem?: T)=>void) {
        const {_width, _height} = this

        for (var i = -this.halfWidth; i < this.halfWidth; i++) {
            for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2
                const r = j

                f(q, r, this.get(q, r))
            }
        }

        return this
    }

    /**
     * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
     * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
     */
    forEachIJ(f: (i: number, j: number, q: number, r: number, item?: T)=>void) {
        const {_width, _height} = this

        for (var i = -this.halfWidth; i < this.halfWidth; i++) {
            for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2
                const r = j

                f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r))
            }
        }

        return this
    }

    init(items: T[]) {
        items.forEach(item => {
            this.add(item.q, item.r, item)
        })
        return this
    }

    initQR(f: (q: number, r: number, existingItem?: T) => T) {
        return this.forEachQR((q,r,item) => this.add(q, r, f(q, r, item)))
    }

    mapQR<R extends QR>(f: (q: number, r: number, existingItem?: T) => R) {
        const mapped = new Grid<R>(this._width, this._height)
        this.forEachQR((q,r,item) => mapped.add(q, r, f(q, r, item)))
        return mapped
    }

    toArray(): T[] {
        const arr: T[] = new Array(this._width * this._height)
        var i = 0

        for (let q in this.data) {
            for (let r in this.data[q]) {
                arr[i++] = this.data[q][r]
            }
        }

        return arr
    }

    get(q: number, r: number): T | undefined {
        const col = this.data[q]    
        if (col) {
            return col[r]
        } else {
            return undefined
        }
    }

    getOrCreate(q: number, r: number, defaultValue: T): T {
        const col = this.data[q]
        if (!col) {
            this.data[q] = []
            this.data[q][r] = defaultValue
            return defaultValue
        }

        const cell = col[r]
        if (!cell) {
            this.data[q][r] = defaultValue
            return defaultValue
        }

        return cell
    }

    add(q: number, r: number, item: T) {
        if (q in this.data) {
            this.data[q][r] = item
        } else {
            const col: T[] = this.data[q] = []
            col[r] = item
        }
    }

    static NEIGHBOR_QRS = [
        { q: 1, r: -1 }, // NE
        { q: 1, r: 0 }, // E
        { q: 0, r: 1 }, // SE
        { q: -1, r: 1 }, // SW
        { q: -1, r: 0 }, // W
        { q: 0, r: -1 } // NW
    ]

    neighbors(q: number, r: number, range: number = 1): T[] {
        return (range == 1 ? Grid.NEIGHBOR_QRS : qrRange(range)).map(qr => {
            return this.get(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }

    /**
     * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
     * Non-existing neighbors will occur as "undefined". The list is always returned
     * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
     * @param q
     * @param r
     * @returns {{q: number, r: number}[]}
     */
    surrounding(q: number, r: number): T[] {
        return Grid.NEIGHBOR_QRS.map(qr => {
            return this.get(q + qr.q, r + qr.r)
        })
    }
}