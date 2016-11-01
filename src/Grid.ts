import { QR } from './interfaces';
import { qrRange, range } from './util';

export interface GridItem extends QR {
}

export default class Grid<T extends GridItem> {
    private data: T[][] = []
    private halfWidth = this.width / 2
    private halfHeight = this.height / 2

    get length(): number {
        return this.width * this.height
    }

    constructor(private width: number, private height: number) {
        if (width % 2 != 0 || height % 2 != 0) {
            throw new Error("With and height of grid must be divisible by 2")
        }
        this.data = []
    }

    forEach(f: (existingItem: T) => void) {
        for (let row of this.data) {
            for (let item of row) {
                f(item)
            }
        }
    }

    forEachQR(f: (q: number, r: number, existingItem?: T)=>void) {
        const {width, height} = this

        for (var i = -this.halfWidth; i < Math.ceil(width/2); i++) {
            for (var j = -this.halfHeight; j < Math.ceil(height/2); j++) {
                const q = i - j / 2 + ((-height / 2 + j) % 2) / 2
                const r = j

                f(q, r, this.get(q, r))
            }
        }
    }

    map(f: (existingItem: T) => T) {
        this.data = this.data.map(row => {
            return row.map(item => f(item))
        })
    }

    mapQR(f: (q: number, r: number, existingItem?: T) => T) {
        const {width, height} = this

        for (var i = -this.halfWidth; i < Math.ceil(width/2); i++) {
            for (var j = -this.halfHeight; j < Math.ceil(height/2); j++) {
                const q = i - j / 2 + ((-this.halfHeight + j) % 2) / 2
                const r = j

                this.add(f(q, r, this.get(q, r)))
            }
        }

        return this
    }

    setQR(f: (q: number, r: number) => T) {
        const {width, height} = this        

        for (var i = -this.halfWidth; i < width/2; i++) {
            for (var j = -this.halfHeight; j < height/2; j++) {
                const q = i - j / 2 + ((-this.halfHeight + j) % 2) / 2
                const r = j

                this.add(f(q, r))
            }
        }

        return this
    }

    toArray(): T[] {
        const arr: T[] = new Array(this.width * this.height)
        var i = 0

        for (let q in this.data) {
            for (let r in this.data[q]) {
                arr[i++] = this.data[q][r]
            }
        }

        return arr
    }

    get(q: number, r: number): T | undefined {
        return this.data[q][r]
    }

    getGuarded(q: number, r: number): T | undefined {
        if (q in this.data) {
            return this.data[q][r]
        } else {
            return undefined
        }
    }

    add(item: T) {
        if (item.q in this.data) {
            this.data[item.q][item.r] = item
        } else {
            const col: T[] = this.data[item.q] = []
            col[item.r] = item
        }
    }

    neighbors(q: number, r: number, range: number = 1): T[] {
        return qrRange(range).map(qr => {            
            return this.getGuarded(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }
}