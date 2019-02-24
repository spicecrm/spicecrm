import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[spiceuiautofocus]'
})
export class SpiceUIAutofocusDirective implements AfterViewInit {


    constructor(
        private elementRef: ElementRef
    ) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            if (!this.elementRef.nativeElement.tabIndex) this.elementRef.nativeElement.tabIndex = '-1';
            this.elementRef.nativeElement.focus();
        });
    }

}