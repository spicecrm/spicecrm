/**
 * @module directives
 */
import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

/**
 * a directive that can be added to an input element and then will ensure when it is rendered it is focused automatically
 *
 * ```html
 * <input spiceuiautofocus type="search" class="slds-input" [(ngModel)]="searchTerm" [placeholder]="language.getLabel('LBL_SEARCH')">
 * ```
 */
@Directive({
    selector: '[spiceuiautofocus]'
})
export class SpiceUIAutofocusDirective implements AfterViewInit {

    /**
     * @ignore
     */
    constructor(
        private elementRef: ElementRef
    ) {
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        setTimeout(() => {
            if (!this.elementRef.nativeElement.tabIndex) this.elementRef.nativeElement.tabIndex = '-1';
            this.elementRef.nativeElement.focus();
        });
    }
}
