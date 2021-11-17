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
import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * A directive that can be added to an any HTML element that holds checkboxes in it. Then the user can check/uncheck multiple checkboxes simply by click/shift+click.
  */
@Directive({
    selector: '[system-multi-select-checkboxes]'
})
export class SystemMultiSelectCheckboxesDirective {

    /**
     * The last checked label element.
     */
    private lastChecked: any;

    constructor( private elementRef: ElementRef ) { }

    @HostListener('click', ['$event'])
    private onClick( event ) {

        let labelElement = null;
        if ( event.target.parentElement.classList?.contains('slds-checkbox__label')) labelElement = event.target.parentElement;
        else if ( event.target.parentElement.parentElement?.classList?.contains('slds-checkbox__label')) labelElement = event.target.parentElement.parentElement;
        else if ( event.target.classList.contains('slds-checkbox__label')) labelElement = event.target;

        if ( labelElement ) {

            // As side effect clicking on the label would select text, so prevent that:
            document.getSelection().removeAllRanges();

            // If this is the first click, lastChecked is undefined, so set it:
            if( !this.lastChecked ) {
                this.lastChecked = labelElement;
                return;
            }

            // Click with shift key pressed:
            if( event.shiftKey ) {

                let allLabels = this.getAllLabels();

                // Determine the start and the end of the range of checkboxes:
                let startTemp = allLabels.indexOf( labelElement );
                let endTemp = allLabels.indexOf( this.lastChecked );
                let start = Math.min( startTemp, endTemp );
                let end = Math.max( startTemp, endTemp );

                // Determine the value to set to all the checkboxes:
                let valueToSet = this.lastChecked.parentElement.getElementsByTagName( 'input' )[0].checked;

                // Now set the value:
                for( let i = start; i <= end; i++ ) {
                    allLabels[i].parentElement.getElementsByTagName( 'input' )[0].checked = valueToSet;
                    allLabels[i].parentElement.getElementsByTagName( 'input' )[0].dispatchEvent( new Event( 'change' ) );
                }

                // Prevent the system from handle a click so the value of the last (shift-clicked) checkbox won´t be inverted:
                event.preventDefault();
            }

            // Remember the last checked checkbox for the next shift-click:
            this.lastChecked = labelElement;

        }
    }

    /**
     * The input HTML elements (type checkbox) are not visible. So we need the labels.
     */
    private getAllLabels() {
        let allLabels = [];
        let labelElements = this.elementRef.nativeElement.getElementsByTagName( 'label' );
        for( let labelElement of labelElements ) {
            if ( labelElement.classList.contains('slds-checkbox__label') ) {
                // Collect the label (of checkbox):
                allLabels.push( labelElement );
            }
        }
        return allLabels;
    }

}
