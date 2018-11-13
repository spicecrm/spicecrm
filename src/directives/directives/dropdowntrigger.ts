import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2
} from '@angular/core';

@Directive({
    selector: '[dropdowntrigger]',
})
export class DropdownTriggerDirective implements OnDestroy {

    private clickListener: any;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) {

    }

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;

    @HostListener('click', ['$event'])
    private openDropdown(event) {
        this.dropDownOpen = !this.dropDownOpen;

        if (this.dropDownOpen) {
            event.preventDefault();
            this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        } else {
            this.clickListener();
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
