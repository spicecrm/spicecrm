/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module DirectivesModule
 */
import {
    AfterViewChecked,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    Renderer2,
    ChangeDetectorRef
} from '@angular/core';
import {footer} from "../../services/footer.service";

/**
 * This directive can be added to an element to handle show/hide the dropdown element
 * it also move the dropdown element to the footer and re position it to prevent any overflow.
 *
 * <div system-dropdown-trigger>
 *      <button>dropdown button</button>
 *      <div class="slds-dropdown">
 *          dropdown content
 *      </div>
 * </div>
 */
@Directive({
    selector: '[system-dropdown-trigger]'
})
export class SystemDropdownTriggerDirective implements OnDestroy, AfterViewChecked {

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;
    private clickListener: any;
    private previousTriggerRect: any;
    private dropdownElement: HTMLElement;

    /*
    * @input dropdowntrigger: boolean = false
    */
    @Input('system-dropdown-trigger') private dropdowntriggerdisabled: boolean = false;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private footer: footer,
        private cdRef: ChangeDetectorRef
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
    * @set dropdown style.z-index
    */
    private resetDropdownStyles() {
        this.renderer.setStyle(this.dropdownElement, 'transform', 'initial');
        this.renderer.setStyle(this.dropdownElement, 'right', 'initial');
        this.renderer.setStyle(this.dropdownElement, 'z-index', '999999');
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

        // make sure we detect changes in case we are on a push strategy
        this.cdRef.markForCheck();
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

            // make sure we detect changes in case we are on a push strategy
            this.cdRef.markForCheck();
        }
    }
}
