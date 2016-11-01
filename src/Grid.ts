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
        this.data = range(0, width*2).map(x => [])
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

                this.set(f(q, r, this.get(q, r)))
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

                this.set(f(q, r))
            }
        }

        return this
    }

    toArray(): T[] {
        return [].concat(...this.data)
    }

    add(item: T) {        
        if (typeof this.get(item.q, item.r) != "undefined") {
            throw new Error(`Grid already contains item at (${item.q},${item.r})`)
        }

        this.set(item)
    }

    get(q: number, r: number): T | undefined {
        const indexR = r + this.halfHeight
        const indexQ = q + this.halfWidth + indexR / 2 + ((-this.halfHeight + indexR) % 2) / 2
        return this.data[indexQ][indexR]
    }

    getGuarded(q: number, r: number): T | undefined {
        const indexR = r + this.halfHeight
        const indexQ = q + this.halfWidth + indexR / 2 + ((-this.halfHeight + indexR) % 2) / 2
        if (indexQ in this.data) {
            return this.data[indexQ][indexR]
        } else {
            return undefined
        }
    }

    set(item: T) {
        const indexR = item.r + this.halfHeight
        const indexQ = item.q + this.halfWidth + indexR / 2 + ((-this.halfHeight + indexR) % 2) / 2        
        this.data[indexQ][indexR] = item
    }

    neighbors(q: number, r: number, range: number = 1): T[] {
        return qrRange(range).map(qr => {            
            return this.getGuarded(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }
}