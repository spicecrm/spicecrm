/**
 * @module directives
 */
import {
    Directive,
    OnDestroy,
    ElementRef,
    Renderer2,
    AfterViewInit, Input
} from '@angular/core';
import {view} from "../../services/view.service";

/**
 * asimple directive that provides a view service for the dom element
 *
 * parameters are editable to make the view editbale and displayLabels to show or display labels in the view
 */
@Directive({
    selector: '[viewprovider]',
    providers:[view]
})
export class ViewProviderDirective implements AfterViewInit, OnDestroy {

    private resizeHandler: any;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private view: view
    ) {

    }

    @Input('viewprovider')
    set viewSettings(viewSettings: { editable: boolean, displayLabels: boolean }) {
        if (viewSettings.editable) {
            this.view.isEditable = true;
        }

        if (viewSettings.displayLabels === false) {
            this.view.displayLabels = false;
        }
    }

    public ngAfterViewInit() {
        // set the view size
        this.setviewSize();
        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.setviewSize());
    }

    public ngOnDestroy(): void {
        if (this.resizeHandler) this.resizeHandler();
    }


    private setviewSize() {
        if (this.elementRef.nativeElement.getBoundingClientRect().width < 500) {
            this.view.size = 'small';
        } else {
            this.view.size = 'regular';
        }
    }

}
