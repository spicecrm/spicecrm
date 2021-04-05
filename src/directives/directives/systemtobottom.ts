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
    Directive,
    Input,
    HostBinding,
    ElementRef,
    Renderer2,
    DoCheck, AfterViewInit, HostListener, Output, EventEmitter
} from '@angular/core';

import {footer} from "../../services/footer.service";

/**
 * a directive that sets the height of an element to the bottom ov the vioewable viewport, renders the element as scrollable anbd also emits
 * an event when the content is close to the bottom so an infinite list can reload automatically
 */
@Directive({
    selector: '[system-to-bottom]',
})
export class SystemToBottomDirective implements DoCheck {

    /**
     * an emitter that fires if the scrollable item is approaching the end of the list
     * this should trigger loading more
     */
    @Output('system-to-bottom') private more: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a margin in pixels fromt he bottom
     * @private
     */
    @Input() private marginBottom = 0;

    constructor(private element: ElementRef, private renderer: Renderer2, private footer: footer) {
    }

    /**
     * set the scrollable class
     */
    @HostBinding('class.slds-scrollable--y') private elementClass = true;

    /**
     * triggering when the element is resized
     */
    public ngDoCheck() {
        let rect = this.element.nativeElement.getBoundingClientRect();
        let height = Math.floor(window.innerHeight - rect.top - this.marginBottom - parseInt( getComputedStyle(this.element.nativeElement).marginBottom, 10 ) - parseInt( getComputedStyle(this.element.nativeElement).paddingBottom, 10 ) - this.footer.visibleFooterHeight);
        this.renderer.setStyle(this.element.nativeElement, 'height',  height + 'px');
    }

    /**
     * bind to the scroll event and if we reach the end trigger the more emitter
     *
     * @param event
     */
    @HostListener('scroll', ['$event'])
    private onScroll(event) {
        let element = this.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.more.emit(true);
        }
    }
}
