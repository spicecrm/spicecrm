/*
SpiceUI 2018.10.001

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
