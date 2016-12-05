export interface XY {
    x: number;
    y: number;
}

export interface AABB {
    center: XY;
    halfDimension: number;
    containsPoint(point: XY): boolean;
    intersectsAABB(other: AABB): boolean;
}

export class BoundingBox implements AABB {
    center: XY;
    halfDimension: number;

    constructor(center: XY, halfDimension: number) {
        this.center = center;
        this.halfDimension = halfDimension;
    }

    containsPoint(point: XY): boolean{
        if(point.x < (this.center.x - this.halfDimension)) {
            return false;
        }
        if(point.y < (this.center.y - this.halfDimension)) {
            return false;
        }
        if(point.x > (this.center.x + this.halfDimension)) {
            return false;
        }
        if(point.y > (this.center.y + this.halfDimension)) {
            return false;
        }
        return true;
    }

    intersectsAABB(other: AABB): boolean{
        if(other.center.x + other.halfDimension < this.center.x - this.halfDimension) {
            return false;
        }
        if(other.center.y + other.halfDimension < this.center.y - this.halfDimension) {
            return false;
        }
        if(other.center.x - other.halfDimension > this.center.x + this.halfDimension) {
            return false;
        }
        if(other.center.y - other.halfDimension > this.center.y + this.halfDimension) {
            return false;
        }
        return true;
    }
}