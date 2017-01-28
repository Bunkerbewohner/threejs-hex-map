export declare const KEY_CODES: {
    LEFT_ARROW: number;
    UP_ARROW: number;
    RIGHT_ARROW: number;
    DOWN_ARROW: number;
    SHIFT: number;
    Q: number;
    E: number;
    G: number;
};
export interface KeyActions {
    [keyCode: number]: KeyAction;
}
export interface KeyAction {
    down?: () => void;
    up?: () => void;
}
export declare function paramString(name: string, defaultValue: string): string;
export declare function paramInt(name: string, defaultValue: number): number;
export declare function paramFloat(name: string, defaultValue: number): number;
export declare function varying<T>(...values: T[]): T;
