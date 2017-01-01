import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
export default class Controller implements MapViewController {
    private controls;
    private pickingCamera;
    private mouseDownPos;
    private dragStartCameraPos;
    private lastDrag;
    private debugText;
    private selectedQR;
    init(controls: MapViewControls, canvas: HTMLCanvasElement): void;
    onKeyDown: (e: KeyboardEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseEnter: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseOut: (e: MouseEvent) => void;
    showDebugInfo(): void;
}
