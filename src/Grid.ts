import { QR } from './interfaces';
import {qrRange, range, isInteger} from './util';

export default class Grid<T> {
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

    initQR(f: (q: number, r: number, existingItem?: T) => T) {
        return this.forEachQR((q,r,item) => this.add(q, r, f(q, r, item)))
    }

    mapQR<R>(f: (q: number, r: number, existingItem?: T) => R) {
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

    neighbors(q: number, r: number, range: number = 1): T[] {
        return qrRange(range).map(qr => {            
            return this.get(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }
}