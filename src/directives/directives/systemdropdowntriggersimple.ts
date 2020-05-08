/**
 * @module DirectivesModule
 */
import {
    Directive,
    HostListener,
    HostBinding,
    OnDestroy,
    ElementRef,
    Renderer2,
    Input, ChangeDetectorRef
} from '@angular/core';

/**
 * This directive can be added to an element to handle show/hide the dropdown element
 *
 * <div system-dropdown-trigger-simple>
 *      <button>dropdown button</button>
 *      <div class="slds-dropdown">
 *          dropdown content
 *      </div>
 * </div>
 */
@Directive({
    selector: '[system-dropdown-trigger-simple]'
})
export class SystemDropdownTriggerSimpleDirective implements OnDestroy {

    /**
     * the click lisetner that listenes to any click evbent outside of the element
     */
    private clickListener: any;

    /**
     * the input. allows disbaling the trigger if the buttopn e.g. is disabled
     */
    @Input('system-dropdown-trigger-simple') private dropdowntriggerdisabled: boolean = false;

    constructor(
        private renderer: Renderer2,
        private cdRef: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {

    }

    /**
     * bind the open class to the element if openes
     */
    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;

    /**
     * listen to the click event
     *
     * @param event
     */
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

    /**
     * handle the click event on the document
     *
     * @param event
     */
    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropDownOpen = false;
            this.cdRef.detectChanges();
            this.clickListener();
        }
    }

    /**
     * if the click listener is till active destoy it so the event is freed
     */
    public ngOnDestroy() {
        if (this.clickListener) this.clickListener();
    }

}
