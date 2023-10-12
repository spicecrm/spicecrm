/**
 * @module DirectivesModule
 */
import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";

/**
 * highlights the wrapped element to notify that this element is draggable and emit the dropped files
 */
@Directive({
    selector: '[system-drop-url]' // spiceDropFileArea
})
export class SystemDropUrl {

    @Output('system-drop-url') public urlsDrop: EventEmitter<FileList> = new EventEmitter<FileList>();
    @Input() public dropMessage: string;

    public overlayElement: HTMLElement;
    public dragStartListener: any;
    public dragEnterListener: any;
    public dragOverListener: any;
    public dragLeaveListener: any;
    public dragEndListener: any;
    public dragDropListener: any;
    public dragGlobalDropListener: any;
    public dragDepth: number = 0;

    constructor(
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public language: language,
        public toast: toast,
    ) {
        this.defineOverlayElement();
        this.listenWindowEvents();
    }

    /**
     * reset the drop message if it is defined as input
     */
    public ngOnChanges() {
        this.renderer.setProperty(this.overlayElement, 'textContent', this.dropMessage);
    }

    public ngOnDestroy() {
        this.dragStartListener();
        this.dragEnterListener();
        this.dragOverListener();
        this.dragLeaveListener();
        this.dragEndListener();
        this.dragDropListener();
        this.dragGlobalDropListener();
    }

    /**
     * define an overlay div
     */
    public defineOverlayElement() {
        this.overlayElement = this.renderer.createElement('div');
        this.renderer.setStyle(this.overlayElement, 'height', '100%');
        this.renderer.setStyle(this.overlayElement, 'width', '100%');
        this.renderer.setStyle(this.overlayElement, 'top', '0');
        this.renderer.setStyle(this.overlayElement, 'left', '0');
        this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
        this.renderer.setStyle(this.overlayElement, 'background', 'rgba(135,135,135,0.8)');
        this.renderer.setStyle(this.overlayElement, 'color', '#fff');
        this.renderer.setStyle(this.overlayElement, 'border', 'dashed 2px #fff');
        this.renderer.setProperty(this.overlayElement, 'textContent', this.language.getLabel('LBL_DROP_URLS'));
        this.renderer.addClass(this.overlayElement, 'slds-align--absolute-center');

        // set relative position to the reference
        this.renderer.addClass(this.elementRef.nativeElement, 'slds-is-relative');
    }

    public listenWindowEvents() {

        /**
         * catch drag start as this is heppening when the drag is initiated within the application
         */
        this.dragStartListener = this.renderer.listen('window', 'dragstart', () => {
            this.dragDepth = -10;
        });

        /**
         * listen to dragenter, increase counter and on one emit boracast so the resp directive canm catch this
         */
        this.dragEnterListener = this.renderer.listen('window', 'dragenter', (dragenter) => {
            this.dragDepth++;

            // enable upload only for urls
            if (this.dragDepth == 1 && dragenter.dataTransfer.types.indexOf('Files') == -1) {
                this.renderer.appendChild(this.elementRef.nativeElement, this.overlayElement);
            }
        });

        /**
         * listen to drag over event and allow dropping.
         */
        this.dragOverListener = this.renderer.listen(this.overlayElement, 'dragover', (dragOver) => {
            dragOver.preventDefault();
            dragOver.stopPropagation();
            dragOver.dataTransfer.dropEffect = 'copy';
        });

        /**
         * listen to dragleave, decrease counter and on one emit broadcast so the resp directive can catch this
         */
        this.dragLeaveListener = this.renderer.listen('window', 'dragleave', () => {
            this.dragDepth--;
            if (this.dragDepth == 0) {
                this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
            }
        });

        /**
         * reset the depth to 0 when the drag is ending
         */
        this.dragEndListener = this.renderer.listen('window', 'dragend', () => {
            this.dragDepth = 0;
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });

        /**
         * listen to drop event and emit the url
         */
        this.dragDropListener = this.renderer.listen(this.overlayElement, 'drop', (drop) => {
            this.dragDepth = 0;
            if (drop.dataTransfer.items.length > 0) {
                this.urlsDrop.emit(drop.dataTransfer);
            } else {
                this.toast.sendToast('LBL_ERROR', 'error');
            }
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });

        /**
         * listen to global drop and remove the overlay element
         */
        this.dragGlobalDropListener = this.renderer.listen('window', 'drop', (drop) => {
            this.dragDepth = 0;
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });
    }

    /**
     * helper to check if all elements of the drag over event are urls
     *
     * @param items the items from the event
     */
    public hasOneItemsUrls(items) {
        for (let item of items) {
            if (item.kind == 'string') {
                return true;
            }
        }
        return false;
    }
}
