/**
 * @module DirectivesModule
 */
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

/**
 * a directive that displays a loading spinner inside an overlay container over the parent
 */
@Directive({
    selector: '[system-overlay-loading-spinner]'
})
export class SystemOverlayLoadingSpinnerDirective {

    public overlayElement: HTMLElement;

    constructor(
        public renderer: Renderer2,
        public elementRef: ElementRef
    ) {
        this.defineOverlayElement();
    }

    @Input('system-overlay-loading-spinner') set isLoading(bool) {
        if (bool) this.renderer.appendChild(this.elementRef.nativeElement, this.overlayElement);
        else this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
    }

    /**
     * define an overlay div
     */
    public defineOverlayElement() {
        this.overlayElement = this.renderer.createElement('div');
        this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
        this.renderer.addClass(this.overlayElement, 'slds-align--absolute-center');
        this.renderer.setStyle(this.overlayElement, 'height', '100%');
        this.renderer.setStyle(this.overlayElement, 'width', '100%');
        this.renderer.setStyle(this.overlayElement, 'z-index', '999');
        this.renderer.setStyle(this.overlayElement, 'top', '0');
        this.renderer.setStyle(this.overlayElement, 'left', '0');
        this.renderer.setStyle(this.overlayElement, 'background-color', 'rgb(0,0,0,0.075)');
        let spinnerContainer = this.renderer.createElement('div');
        this.renderer.setProperty(this.overlayElement, 'innerHTML', `
            <div style="border-radius: 50%; box-shadow: 0 0 5px 0 #555; padding:.75rem; background-color:#fff; color:#080707">
                <div class="cssload-container">
                    <div class="cssload-double-torus"></div>
                </div>
            </div>
        `);

        this.renderer.appendChild(this.elementRef.nativeElement, spinnerContainer);


        // set relative position to the reference
        this.renderer.addClass(this.elementRef.nativeElement, 'slds-is-relative');
    }
}
