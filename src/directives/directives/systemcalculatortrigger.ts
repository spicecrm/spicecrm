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
import {Directive, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {modal} from "../../services/modal.service";
import {userpreferences} from "../../services/userpreferences.service";

/**
 * to be called from sibling system-calculator to handle the click event
 * PREVIOUS SIBLING MUST BE THE INPUT THAT WILL BE USED
 * example:
 * <button system-calculator-trigger>open</button>
 */
@Directive({
    selector: '[system-calculator-trigger]'
})
export class SystemCalculatorTriggerDirective {

    /**
     * a setter to set that a calculator icon should be displayed in the field
     * @param displayCalculator
     */
    @Input('system-calculator-trigger-formatted') set setCalculator(formatted: boolean){
        if (formatted === false) {
            this.formattedNumber = false;
        } else {
            this.formattedNumber = true;
        }
    }
    public formattedNumber: boolean = false;

    constructor(public modal: modal, public userpreferences: userpreferences, public elementRef: ElementRef) {
    }
    /**
     * open the calculator modal and handle emitting the response value
     */
    @HostListener('click')
    public openCalculator() {

        if (!this.elementRef.nativeElement.previousSibling || !(this.elementRef.nativeElement.previousSibling.tagName in {INPUT:1, TEXTAREA:1})) return;

        this.modal.openModal('SpiceCalculatorModal').subscribe(modalRef => {
            modalRef.instance.value = this.elementRef.nativeElement.previousSibling.value;
            modalRef.instance.trigger = true;
            modalRef.instance.value$.subscribe(val => {
                if (isNaN(val)) return;
                this.elementRef.nativeElement.previousSibling.value = this.formattedNumber ? this.userpreferences.formatMoney(val, 2) : val;
                this.elementRef.nativeElement.previousSibling.dispatchEvent(new Event('input'));
            });
        });
    }
}
