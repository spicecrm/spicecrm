/**
 * @module DirectivesModule
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
    selector: '[system-view-provider]',
    providers:[view],
    exportAs: 'system-view-provider'
})
export class SystemViewProviderDirective implements AfterViewInit, OnDestroy {

    public resizeHandler: any;

    constructor(
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public view: view
    ) {

    }

    @Input('system-view-provider')
    set viewSettings(viewSettings: { editable?: boolean, displayLabels?: boolean, displayLinks?: boolean }) {
        if (viewSettings.editable) {
            this.view.isEditable = true;
        }

        if (viewSettings.displayLabels === false) {
            this.view.displayLabels = false;
        }
        if (viewSettings.displayLinks === false) {
            this.view.displayLinks = false;
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


    public setviewSize() {
        if (this.elementRef.nativeElement.getBoundingClientRect().width < 500) {
            this.view.size = 'small';
        } else {
            this.view.size = 'regular';
        }
    }

}
