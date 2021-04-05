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
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer2, OnDestroy, Input
} from '@angular/core';

/**
 * a resizer directive that reacts on mopuse down and mouseup
 */
@Directive({
    selector: '[system-resize]'
})
export class SystemResizeDirective implements OnDestroy {

    /**
     * an optional resized id so we can identify what has been resized
     */
    @Input() public resizeid: any;

    /**
     * the emitter with the name of the directive emitting the dimensions if they changed
     */
    @Output('system-resize') private resizeemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the widht of the element when mouse went down
     */
    private elementWidth: any;

    /**
     * the hwight of teh element when the mouse was down
     */
    private elementHeight: any;

    /**
     * a listener to all mouseup events. Need to listen on document since in case of limited horiz or vertical resize the event might no occur in the element
     */
    private mouseListener: any;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {

    }

    public ngOnDestroy(): void {
        if (this.mouseListener) this.mouseListener();
    }

    /**
     * register the mouse doan event
     *
     * @param event
     */
    @HostListener('mousedown', ['$event'])
    private onMouseDown(event) {
        // get the current dimensions
        let rect = this.elementRef.nativeElement.getClientRects()[0]
        this.elementWidth = rect.width;
        this.elementHeight = rect.height;

        // register the mouse up event
        this.mouseListener = this.renderer.listen('document', 'mouseup', event => {
            this.onMouseup();
        });

    }

    /**
     * react to the mouse up event
     */
    private onMouseup() {
        if (!this.elementWidth || !this.elementWidth) return;
        let currentrect = this.elementRef.nativeElement.getClientRects()[0];
        if ((this.elementWidth && currentrect.width != this.elementWidth) || (this.elementHeight && currentrect.height != this.elementHeight)) {
            this.resizeemitter.emit({
                width: currentrect.width,
                height: currentrect.height,
                id: this.resizeid
            });
        }
        this.elementWidth = undefined;
        this.elementHeight = undefined;

        // unset the listener
        this.mouseListener();
        this.mouseListener = undefined;
    }

    /**
     * returns the width of the element
     */
    public getElementWidth() {
        return this.elementRef.nativeElement.getClientRects()[0].width;
    }
}
