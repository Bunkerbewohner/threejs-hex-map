/// <reference types="three" />
import { Vector2 } from "three";
import { BoundingBox } from "./BoundingBox";
export default class QuadTree<T> {
    private northWest;
    private northEast;
    private southWest;
    private southEast;
    private bounds;
    private data;
    private readonly capacity;
    private readonly pos;
    constructor(data: T[], capacity: number, pos: (item: T) => Vector2, bounds?: BoundingBox);
    private isLeaf();
    private insert(item);
    private subdivide();
    /**
     * Returns a list of items within the given bounding box.
     */
    queryRange(range: BoundingBox): T[];
    mapReduce<R>(f: (data: T[]) => R): QuadTree<R>;
}
