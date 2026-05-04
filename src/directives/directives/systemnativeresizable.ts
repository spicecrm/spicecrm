import {
    Directive,
    ElementRef,
    output,
    input,
    inject,
    Renderer2,
    DestroyRef,
    NgZone,
    AfterViewInit
} from '@angular/core';
import { ResizeConstrainFn, ResizeEvent, ResizeHandle } from "../../systemcomponents/interfaces/systemcomponents.interfaces";

@Directive({
    selector: '[system-native-resizable]',
    standalone: false,
    host: {
        '(document:keydown.escape)': 'cancelResize()'
    }
})
export class SystemNativeResizableDirective implements AfterViewInit {
    /**
     * Optional function to apply custom constraints to the resize logic
     */
    public resizeConstrainFn = input<ResizeConstrainFn>();

    /**
     * Array or single string of active resize handles.
     * Automatically transformed into an array for internal use.
     */
    public resizeHandles = input<ResizeHandle[], ResizeHandle[] | ResizeHandle | string>(['bottom-right'], {
        transform: (value: ResizeHandle[] | ResizeHandle | string) => {
            if (Array.isArray(value)) return value as ResizeHandle[];
            return [value as ResizeHandle];
        }
    });

    /**
     * Determines if the new size should be kept or reverted on mouseup
     */
    public applyChanges = input<boolean>(true);

    /**
     * Input for minimum width
     */
    public minWidth = input<number>(0);

    /**
     * Input for minimum height
     */
    public minHeight = input<number>(0);

    /**
     * The size/thickness of the invisible handle hit-area in pixels
     */
    public handleSize = input<number>(4);

    /**
     * Emits when the user starts dragging a handle
     */
    public resizeStart = output<void>();

    /**
     * Emits when the user releases the mouse button
     */
    public resizeEnd = output<ResizeEvent>();

    /**
     * Emits when the user releases the mouse button
     */
    public resizeCancel = output<void>();

    /**
     * Emits on resize change
     */
    public resized = output<ResizeEvent>();
    /**
     * stores the handle to cursor mapping
     * @private
     */
    private map: Record<ResizeHandle, string> = {
        'top': 'n-resize', 'bottom': 's-resize', 'left': 'w-resize', 'right': 'e-resize',
        'top-left': 'nw-resize', 'top-right': 'ne-resize', 'bottom-left': 'sw-resize', 'bottom-right': 'se-resize'
    };

    /**
     * reference to the host element
     * @private
     */
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    /**
     * reference to the renderer2
     * @private
     */
    private readonly renderer = inject(Renderer2);

    /**
     * reference to the destroy ref
     * @private
     */
    private readonly destroyRef = inject(DestroyRef);

    /**
     * reference to the ng zone
     * @private
     */
    private readonly ngZone = inject(NgZone);

    /**
     * Tracks if the resizing state is currently active
     * @private
     */
    private isResizing: boolean = false;

    /**
     * Stores the specific handle being dragged
     * @private
     */
    private currentHandle: ResizeHandle | null = null;

    /**
     * stores the initial mouse X position when resizing starts
     * @private
     */
    private startX: number = 0;

    /**
     * stores the initial mouse Y position when resizing starts
     * @private
     */
    private startY: number = 0;

    /**
     * stores the initial element width when resizing starts
     * @private
     */
    private startWidth: number = 0;

    /**
     * stores the initial element height when resizing starts
     * @private
     */
    private startHeight: number = 0;
    /**
     * stores the initial element top when resizing starts
     * @private
     */
    private startTop: number = 0;

    /**
     * stores the initial element left when resizing starts
     * @private
     */
    private startLeft: number = 0;

    /**
     * Caches the element's bounding rect at the start of resize to prevent expensive calculation on each mouse move
     * @private
     */
    private cachedRect?: DOMRect;

    /**
     * stores the frame id
     * @private
     */
    private frameId?: number;

    /**
     * Listeners that remain active for the lifecycle of the component
     * @private
     */
    private permanentListeners: Array<() => void> = [];

    /**
     * Listeners that are only active during a resize drag (window level)
     * @private
     */
    private windowListeners: Array<() => void> = [];

    constructor() {
        this.destroyRef.onDestroy(() => this.cleanup(true));
    }

    /**
     * Angular lifecycle hook to initialize handles after view is ready
     */
    public ngAfterViewInit(): void {
        this.ensurePositioned();
        this.createHandles();
    }

    /**
     * Checks if the host element is 'static' and sets to 'relative' to contain handles
     * @private
     */
    private ensurePositioned(): void {
        const el = this.elementRef.nativeElement;
        const position = window.getComputedStyle(el).position;
        if (position === 'static') {
            this.renderer.setStyle(el, 'position', 'relative');
        }
        this.renderer.setStyle(el, 'touch-action', 'none');
        this.renderer.setStyle(el, 'user-select', 'none');
    }

    /**
     * create resize handles and append them to the element
     * @private
     */
    private createHandles(): void {
        const el = this.elementRef.nativeElement;
        const size = this.handleSize();

        this.resizeHandles().forEach((handle: ResizeHandle) => {
            const handleElement = this.renderer.createElement('div');

            const styles: any = {
                'cursor': this.getCursorForHandle(handle)
            };

            // Calculate handle placement based on type
            if (handle.includes('top')) styles['top'] = `-${size / 2}px`;
            if (handle.includes('bottom')) styles['bottom'] = `-${size / 2}px`;
            if (handle.includes('left')) styles['left'] = `-${size / 2}px`;
            if (handle.includes('right')) styles['right'] = `-${size / 2}px`;

            // Hit area sizing
            if (handle === 'top' || handle === 'bottom') {
                styles['left'] = '0'; styles['right'] = '0'; styles['height'] = `${size}px`;
            } else if (handle === 'left' || handle === 'right') {
                styles['top'] = '0'; styles['bottom'] = '0'; styles['width'] = `${size}px`;
            } else {
                styles['width'] = `${size}px`; styles['height'] = `${size}px`;
            }

            Object.keys(styles).forEach(property =>
                this.renderer.setStyle(handleElement, property, styles[property])
            );

            this.renderer.addClass(handleElement, 'system-native-resizable-handle');

            this.permanentListeners.push(
                this.renderer.listen(handleElement, 'mousedown', (e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.startResizing(e, handle);
                })
            );

            this.renderer.appendChild(el, handleElement);
        });
    }

    /**
     * Initializes the resize state and attaches window-level listeners
     * @private
     */
    private startResizing(event: MouseEvent, handle: ResizeHandle): void {
        this.isResizing = true;
        this.currentHandle = handle;
        this.startX = event.clientX;
        this.startY = event.clientY;

        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.startLeft = this.elementRef.nativeElement.offsetLeft;
        this.startWidth = rect.width;
        this.startTop = this.elementRef.nativeElement.offsetTop;
        this.startHeight = rect.height;
        this.cachedRect = rect;

        this.renderer.setStyle(document.body, 'cursor', this.getCursorForHandle(handle));
        this.resizeStart.emit();

        this.ngZone.runOutsideAngular(() => {
            this.windowListeners = [
                this.renderer.listen('window', 'mousemove', (e: MouseEvent) => this.onMouseMove(e)),
                this.renderer.listen('window', 'mouseup', () => this.onMouseUp())
            ];
        });
    }

    /**
     * Throttled resize calculations via requestAnimationFrame
     * @private
     */
    private onMouseMove(event: MouseEvent): void {
        // Optimized check: skip if frame is already scheduled or no active resize
        if (!this.isResizing || !this.currentHandle || this.frameId) return;

        this.frameId = window.requestAnimationFrame(() => {
            this.frameId = undefined;
            if (!this.isResizing || !this.currentHandle) return;

            const moveDiffX = event.clientX - this.startX;
            const moveDiffY = event.clientY - this.startY;
            let newWidth = this.startWidth;
            let newHeight = this.startHeight;
            let newLeft = this.startLeft;
            let newTop = this.startTop;

            const handle = this.currentHandle;
            if (handle.includes('right')) newWidth += moveDiffX;
            if (handle.includes('left')) {
                const clampedDiffX = Math.min(moveDiffX, this.startWidth - this.minWidth());
                newLeft = this.startLeft + clampedDiffX;
                newWidth = this.startWidth - clampedDiffX;
            }
            if (handle.includes('bottom')) newHeight += moveDiffY;
            if (handle.includes('top')) {
                newTop += moveDiffY;
                newHeight -= moveDiffY;
            }

            newWidth = Math.max(this.minWidth(), newWidth);
            newHeight = Math.max(this.minHeight(), newHeight);

            const constrain = this.resizeConstrainFn();

            if (constrain && this.cachedRect) {
                const userSize = {width: newWidth, height: newHeight, top: newTop, left: newLeft};
                const ConstrainRes = constrain(userSize, this.currentHandle, this.elementRef, this.cachedRect, { x: this.startX, y: this.startY });
                newLeft = ConstrainRes.left;
                newWidth = ConstrainRes.width;
                newTop = ConstrainRes.top;
                newHeight = ConstrainRes.height;
            }

            if (handle.includes('left')) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${newLeft}px`);
            }
            if (handle.includes('left') || handle.includes('right')) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${newWidth}px`);
            }
            if (handle.includes('top')) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${newTop}px`);
            }
            if (handle.includes('top') || handle.includes('bottom')) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${newHeight}px`);
            }

            this.ngZone.run(() => {
                this.resized.emit({
                    width: newWidth,
                    height: newHeight,
                    left: newLeft,
                    top: newTop,
                    deltaWidth: newWidth - this.startWidth,
                    deltaHeight: newHeight - this.startHeight,
                    handle
                });
            });
        });
    }

    /**
     * Stops resizing and cleans up window-level event listeners
     * @private
     */
    private onMouseUp(): void {

        const rect = this.elementRef.nativeElement.getBoundingClientRect();

        const finalEvent: ResizeEvent = {
            left: this.startLeft,
            width: rect.width,
            top: this.startTop,
            height: rect.height,
            deltaWidth: rect.width - this.startWidth,
            deltaHeight: rect.height - this.startHeight,
            handle: this.currentHandle
        };

        if (!this.applyChanges()) {
            this.resetElementStyles();
        }

        this.cleanup();

        // Emit final event inside NgZone to ensure parent components can react

        this.ngZone.run(() => {
            this.resizeEnd.emit(finalEvent);
        });
    }

    /**
     * reset element styles
     * @private
     */
    private resetElementStyles() {
        const el = this.elementRef.nativeElement;
        this.renderer.setStyle(el, 'left', `${this.startLeft}px`);
        this.renderer.setStyle(el, 'width', `${this.startWidth}px`);
        this.renderer.setStyle(el, 'top', `${this.startTop}px`);
        this.renderer.setStyle(el, 'height', `${this.startHeight}px`);
    }

    /**
     * Maps a resize handle type to the appropriate CSS cursor
     * @private
     */
    private getCursorForHandle(handle: ResizeHandle): string {
        return this.map[handle];
    }

    /**
     * Removes global window listeners and cancels pending animation frames
     * @private
     */
    private clearWindowListeners(): void {
        this.windowListeners.forEach(unsub => unsub());
        this.windowListeners = [];
        if (this.frameId) {
            window.cancelAnimationFrame(this.frameId);
            this.frameId = undefined;
        }
    }

    /**
     * Final cleanup on component destruction
     * @private
     */
    private cleanup(permanent?: boolean): void {
        this.isResizing = false;
        this.currentHandle = null;
        this.clearWindowListeners();
        this.renderer.setStyle(document.body, 'cursor', '');

        if (permanent) {
            this.permanentListeners.forEach(unsub => unsub());
        }
    }

    /**
     * cancel the resize can be called from a parent component
     */
    public cancelResize() {
        this.cleanup();
        this.resetElementStyles();
        this.resizeCancel.emit();
    }
}