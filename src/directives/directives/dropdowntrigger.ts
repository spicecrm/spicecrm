/**
 * @module directives
 */
import {
    AfterViewChecked,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    Renderer2
} from '@angular/core';
import {footer} from "../../services/footer.service";

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
export class DropdownTriggerDirective implements OnDestroy, AfterViewChecked {

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;
    private clickListener: any;
    private previousTriggerRect: any;
    private dropdownElement: HTMLElement;

    /*
    * @input dropdowntrigger: boolean = false
    */
    @Input('dropdowntrigger') private dropdowntriggerdisabled: boolean = false;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private footer: footer
    ) {

    }

    /*
    * re position the dropdown if any scroll or resize event has been detected
    */
    public ngAfterViewChecked() {
        if (this.dropDownOpen && this.dropdownElement) {
            this.setDropdownElementPosition();
        }
    }

    public ngOnDestroy() {
        this.removeDropdownFromFooter();
        if (this.clickListener) this.clickListener();
    }

    /*
    * @move the dropdown element to the footer
    * @reset dropdown right and transform
    * @set dropdown position
    * @toggle open dropdown
    * @listen to global click event
    * @remove dropdown from footer if it is closed
    * @remove global click listener
    */
    @HostListener('click', ['$event'])
    private openDropdown(event) {

        this.setDropdownElement();

        if (this.dropdownElement) {
            this.moveDropdownToFooter();
            this.resetDropdownStyles();
            this.setDropdownElementPosition();
        }

        if (!this.dropdowntriggerdisabled) {
            this.toggleOpenDropdown();

            if (this.dropDownOpen) {
                event.preventDefault();
                this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
            } else {
                this.removeDropdownFromFooter();
                this.clickListener();
            }
        }
    }

    /*
    * @remove the dropdown element from origin
    * @append the dropdown element to the footer
    */
    private moveDropdownToFooter() {
        this.renderer.removeChild(this.elementRef.nativeElement, this.dropdownElement);
        this.renderer.appendChild(this.footer.footercontainer.element.nativeElement, this.dropdownElement);
    }

    /*
    * @remove the dropdown element from origin
    * @append the dropdown element to the footer
    */
    private removeDropdownFromFooter() {
        if (this.dropdownElement && this.footer.footercontainer.element.nativeElement.contains(this.dropdownElement)) {
            this.renderer.removeChild(this.footer.footercontainer.element.nativeElement, this.dropdownElement);
        }
    }

    /*
    * @set dropdown style.transform
    * @set dropdown style.right
    */
    private resetDropdownStyles() {
        this.renderer.setStyle(this.dropdownElement, 'transform', 'initial');
        this.renderer.setStyle(this.dropdownElement, 'right', 'initial');
    }

    /*
    * @set dropdownElement from origin children
    */
    private setDropdownElement() {
        if (!this.dropdownElement) {
            for (let child of this.elementRef.nativeElement.children) {
                if (child.classList.contains('slds-dropdown')) {
                    this.dropdownElement = child;
                    break;
                }
            }
        }
    }

    /*
    * @set dropDownOpen
    */
    private toggleOpenDropdown() {
        this.dropDownOpen = !this.dropDownOpen;
    }

    /*
    * @set previousTriggerRect
    * @set dropdown style.top
    * @set dropdown style.left
    */
    private setDropdownElementPosition() {
        let triggerRect = this.elementRef.nativeElement.getBoundingClientRect();
        let dropdownRect = this.dropdownElement.getBoundingClientRect();
        if (this.previousTriggerRect && this.previousTriggerRect.bottom == triggerRect.bottom && this.previousTriggerRect.right == triggerRect.right) return;
        this.previousTriggerRect = triggerRect;
        this.renderer.setStyle(this.dropdownElement, 'top', window.innerHeight - triggerRect.bottom < 100 ? Math.abs(triggerRect.bottom - dropdownRect.height) + 'px' : triggerRect.bottom + 'px');
        this.renderer.setStyle(this.dropdownElement, 'left', Math.abs(triggerRect.right - dropdownRect.width) + 'px');
    }

    /*
    * @set dropDownOpen
    * @remove dropdown from footer
    * @append dropdown to origin
    * @remove global click listener
    */
    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropDownOpen = false;
            this.removeDropdownFromFooter();
            // append dropdown element to it's origin
            this.renderer.appendChild(this.elementRef.nativeElement, this.dropdownElement);
            this.clickListener();
        }
    }
}
