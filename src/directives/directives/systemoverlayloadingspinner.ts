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
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

/**
 * a directive that displays a loading spinner inside an overlay container over the parent
 */
@Directive({
    selector: '[system-overlay-loading-spinner]'
})
export class SystemOverlayLoadingSpinnerDirective {

    private overlayElement: HTMLElement;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) {
        this.defineOverlayElement();
    }

    @Input('system-overlay-loading-spinner') set isLoading(bool) {
        if (bool) this.renderer.appendChild(this.elementRef.nativeElement, this.overlayElement);
        else this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
    }

    /**
     * define an overlay div
     */
    private defineOverlayElement() {
        this.overlayElement = this.renderer.createElement('div');
        this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
        this.renderer.addClass(this.overlayElement, 'slds-align--absolute-center');
        this.renderer.setStyle(this.overlayElement, 'height', '100%');
        this.renderer.setStyle(this.overlayElement, 'width', '100%');
        this.renderer.setStyle(this.overlayElement, 'z-index', '999');
        this.renderer.setStyle(this.overlayElement, 'top', '0');
        this.renderer.setStyle(this.overlayElement, 'left', '0');
        let spinnerContainer = this.renderer.createElement('div');
        this.renderer.setProperty(this.overlayElement, 'innerHTML', `
            <div style="border-radius: 50%; box-shadow: 0 0 5px 0 #555; padding:.75rem; background-color:#fff; color:#080707">
                <div class="cssload-container">
                    <div class="cssload-double-torus"></div>
                </div>
            </div>
        `);

        this.renderer.appendChild(this.elementRef.nativeElement, spinnerContainer);


        // set relative position to the reference
        this.renderer.addClass(this.elementRef.nativeElement, 'slds-is-relative');
    }
}
