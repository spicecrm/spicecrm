import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2,
    AfterViewInit
} from '@angular/core';
import {view} from "../../services/view.service";

@Directive({
    selector: '[viewprovider]',
})
export class ViewProviderDirective implements AfterViewInit, OnDestroy {

    private resizeHandler: any;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private view: view
    ) {

    }

    public ngAfterViewInit() {

        // set the view size
        this.setviewSize();
        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.setviewSize())
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
