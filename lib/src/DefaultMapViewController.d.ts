import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { QR } from './interfaces';
export default class Controller implements MapViewController {
    private controls;
    private pickingCamera;
    private mouseDownPos;
    private dragStartCameraPos;
    private lastDrag;
    private debugText;
    private selectedQR;
    private animations;
    debugOutput: HTMLElement | null;
    init(controls: MapViewControls, canvas: HTMLCanvasElement): void;
    onAnimate: (dtS: number) => void;
    private addAnimation(animation);
    onKeyDown: (e: KeyboardEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseEnter: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseOut: (e: MouseEvent) => void;
    showDebugInfo(): void;
    panCameraTo(qr: QR, durationMs: number): void;
}
