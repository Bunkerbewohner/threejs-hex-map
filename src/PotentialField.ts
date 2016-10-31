import { qrRange, range, flatMap, sum, qrEquals, minBy } from './util';
import { qrDistance } from './coords';
import { QR } from './interfaces';

export class PotentialField {
    private start: QR;
    private goal: QR;
    private isObstacle: (pos: QR) => boolean;
    private maxDist: number;
    private stepSize: number;
    private steps: QR[];

    constructor(start: QR, goal: QR, isObstacle: (pos: QR) => boolean, maxDist: number, stepSize = 3) {
        this.start = start
        this.goal = goal
        this.isObstacle = isObstacle
        this.maxDist = maxDist
        this.stepSize = stepSize
        this.steps = []
    }

    findGoal(limit?: number) {
        if (!limit) {
            limit = qrDistance(this.start, this.goal) * 10
        }

        while (limit-- > 0 && !this.isGoalRached) {
            this.step()
        }
    }

    private step() {
        if (this.isGoalRached) {
            return
        }

        const samples = this.sensorSamples()
        const best = minBy(samples, s => s.value)
        const currentPos = this.position
        const nextPos = samplePoints(currentPos, this.stepSize)[best.sampleIndex]

        const goalDist = qrDistance(currentPos, this.goal)
        const nextPosDist = qrDistance(currentPos, nextPos)  
        const next = goalDist <= nextPosDist ? this.goal : nextPos

        this.steps.push(next)
    }

    get position() {
        if (this.steps.length == 0) {
            return this.start
        } else {
            return this.steps[this.steps.length-1]
        }
    }

    get isGoalRached() {
        return qrEquals(this.position, this.goal)
    }

    private sensorSamples(): Potential[] {
        return potentials(this.position, this.goal, this.maxDist, this.isObstacle)
    }

    get path(): QR[] {
        return [].concat([this.start], this.steps)
    }
}

class Potential {
    readonly pos: QR
    readonly goal: number
    readonly obstacle: number
    readonly sampleIndex: number

    constructor(pos: QR, goal: number, obstacle: number, sampleIndex: number) {
        this.pos = pos
        this.goal = goal
        this.obstacle = obstacle
        this.sampleIndex
    }

    get value(): number {
        return this.goal + this.obstacle
    }
}

function potentials(pos: QR, goal: QR, maxDist: number, isObstacle: (pos: QR) => boolean): Potential[] {
    const samples = samplePoints(pos, maxDist)
    const hits = hitPoints(pos, maxDist, isObstacle)

    return samples.map((p, i) => {
        const op = sum(hits.map(hitPoint => obstaclePotential(p, hitPoint, maxDist)))
        return new Potential(p, goalPotential(p, goal) / 1000.0, op, i)
    })
}

function obstaclePotential(pos: QR, hitPoint: QR, maxDist: number): number {
    const dist = qrDistance(pos, hitPoint)
    const a = maxDist - dist

    if (dist > maxDist) return 0
    else if (dist == 0) return Number.MAX_VALUE
    else return Math.pow(Math.E, -1 / (a + 1)) / dist
}

function hitPoints(pos: QR, maxDist: number, isObstacle: (pos: QR) => boolean): QR[] {
    return qrRange(maxDist).map(p => QR(pos.q + p.q, pos.r + p.r)).filter(isObstacle)
}

function samplePoints(pos: QR, distance: number): QR[] {
    const {q, r} = pos
    const topLeft = QR(q, r - distance)
    const topRight = QR(q + distance, r - distance)
    const right = QR(q + distance, r)
    const bottomRight = QR(q, r + distance)
    const bottomLeft = QR(q - distance, r + distance)
    const left = QR(q - distance, r)
    
    return [topLeft, topRight, right, bottomRight, bottomLeft, left]
}

function goalPotential(pos: QR, goal: QR): number {
    return qrDistance(pos, goal)
}

function QR(q: number, r: number) {
    return {q, r}
}