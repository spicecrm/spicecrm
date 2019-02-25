/**
 * @module directives
 */
import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2,
    Input
} from '@angular/core';

/**
 * a directive that can be added to an element and then makes this act as a dropdowntrigger in
 * the sense of lightning design. It reacts to a click and then sets the attribute slds-is-open as class to the element this is rendered to
 *
 * ```html
 * <div dropdowntrigger></div>
 * ```
 */
@Directive({
    selector: '[dropdowntrigger]'
})
export class DropdownTriggerDirective implements OnDestroy {

    private clickListener: any;
    @Input('dropdowntrigger') private dropdowntriggerdisabled: boolean = false;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) {

    }

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;

    @HostListener('click', ['$event'])
    private openDropdown(event) {
        if(!this.dropdowntriggerdisabled) {
            this.dropDownOpen = !this.dropDownOpen;

            if (this.dropDownOpen) {
                event.preventDefault();
                this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
            } else {
                this.clickListener();
            }
        }
    }

    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropDownOpen = false;
            this.clickListener();
        }
    }

    public ngOnDestroy() {
        if (this.clickListener) this.clickListener();
    }

}
