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
export declare class BoundingBox implements AABB {
    center: XY;
    halfDimension: number;
    constructor(center: XY, halfDimension: number);
    containsPoint(point: XY): boolean;
    intersectsAABB(other: AABB): boolean;
}
