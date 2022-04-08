/**
 * @module DirectivesModule
 */
import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

/**
 * a directive that can be added to an input element and then will ensure when it is rendered it is focused automatically
 *
 * ```html
 * <input system-autofocus type="search" class="slds-input" [(ngModel)]="searchTerm" [placeholder]="language.getLabel('LBL_SEARCH')">
 * ```
 */
@Directive({
    selector: '[system-autofocus]'
})
export class SystemAutofocusDirective implements AfterViewInit {

    /**
     * @ignore
     */
    constructor(
        public elementRef: ElementRef
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
