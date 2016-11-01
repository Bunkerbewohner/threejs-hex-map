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

    forEachQR(f: (q: number, r: number, existingItem?: T)=>void) {
        const {width, height} = this

        for (var i = -this.halfWidth; i < Math.ceil(width/2); i++) {
            for (var j = -this.halfHeight; j < Math.ceil(height/2); j++) {
                const q = i - j / 2 + ((-height / 2 + j) % 2) / 2
                const r = j

                f(q, r, this.get(q, r))
            }
        }

        return this
    }

    mapQR(f: (q: number, r: number, existingItem?: T) => T) {
        return this.forEachQR((q,r,item) => this.add(f(q, r, item)))
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
        const col = this.data[q]    
        if (col) {
            return col[r]
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
            return this.get(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }
}