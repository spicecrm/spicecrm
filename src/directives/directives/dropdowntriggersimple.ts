import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2,
    Input
} from '@angular/core';

@Directive({
    selector: '[dropdowntriggersimple]'
})
export class DropdownTriggerSimpleDirective implements OnDestroy {

    private clickListener: any;
    @Input('dropdowntriggersimple') private dropdowntriggerdisabled: boolean = false;

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
