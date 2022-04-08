/**
 * @module DirectivesModule
 */
import {
    Directive,
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer2, OnDestroy, Input
} from '@angular/core';

/**
 * a resizer directive that reacts on mopuse down and mouseup
 */
@Directive({
    selector: '[system-resize]'
})
export class SystemResizeDirective implements OnDestroy {

    /**
     * an optional resized id so we can identify what has been resized
     */
    @Input() public resizeid: any;

    /**
     * the emitter with the name of the directive emitting the dimensions if they changed
     */
    @Output('system-resize') public resizeemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the widht of the element when mouse went down
     */
    public elementWidth: any;

    /**
     * the hwight of teh element when the mouse was down
     */
    public elementHeight: any;

    /**
     * a listener to all mouseup events. Need to listen on document since in case of limited horiz or vertical resize the event might no occur in the element
     */
    public mouseListener: any;

    constructor(
        public elementRef: ElementRef,
        public renderer: Renderer2,
    ) {

    }

    public ngOnDestroy(): void {
        if (this.mouseListener) this.mouseListener();
    }

    /**
     * register the mouse doan event
     *
     * @param event
     */
    @HostListener('mousedown', ['$event'])
    public onMouseDown(event) {
        // get the current dimensions
        let rect = this.elementRef.nativeElement.getClientRects()[0];
        this.elementWidth = rect.width;
        this.elementHeight = rect.height;

        // register the mouse up event
        this.mouseListener = this.renderer.listen('document', 'mouseup', event => {
            this.onMouseup();
        });

    }

    /**
     * react to the mouse up event
     */
    public onMouseup() {
        if (!this.elementWidth || !this.elementWidth) return;
        let currentrect = this.elementRef.nativeElement.getClientRects()[0];
        if ((this.elementWidth && currentrect.width != this.elementWidth) || (this.elementHeight && currentrect.height != this.elementHeight)) {
            this.resizeemitter.emit({
                width: currentrect.width,
                height: currentrect.height,
                id: this.resizeid
            });
        }
        this.elementWidth = undefined;
        this.elementHeight = undefined;

        // unset the listener
        this.mouseListener();
        this.mouseListener = undefined;
    }

    /**
     * returns the width of the element
     */
    public getElementWidth() {
        return this.elementRef.nativeElement.getClientRects()[0].width;
    }
}
