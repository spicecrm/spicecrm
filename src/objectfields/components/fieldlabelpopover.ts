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
 * @module ObjectFields
 */
import {Component, Input, OnInit, Optional, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

/**
 * renders a popover with some field specific data when rightclicked on a label
 */
@Component({
    templateUrl: './src/objectfields/templates/fieldlabelpopover.html'
})
export class fieldLabelPopover implements OnInit, OnDestroy {

    /**
     * reference to the component to be able to close itself
     */
    public self: any;

    /**
     * the event passed in from the intiating component
     */
    public event: any;

    /**
     * the click listener
     */
    private clickListener: any;
    private contextmenulistener: any;

    private fieldlabel: string = '';
    private fieldname: string = '';
    private fieldconfig: any = {};

    /**
     * the offset from the top
     */
    private top = '0px';

    /**
     * the offset from left
     */
    private left = '0px';

    constructor(
        private language: language,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        @Optional() private model: model
    ) {
    }

    /**
     * calculate the position and initiate the clicklistener
     */
    public ngOnInit(): void {
        // set the position
        this.top = this.event.pageY -22 + 'px';
        this.left = this.event.pageX + 8 + 'px';

        // initiate the click listener
        this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        // this.contextmenulistener = this.renderer.listen("document", "contextmenu", (event) => this.onClick(event));
    }

    /**
     * if we still have a listener then cancel it
     */
    public ngOnDestroy(): void {
        if(this.clickListener) this.clickListener();
        if(this.contextmenulistener) this.contextmenulistener();
    }

    /**
     * handle the document onclick event
     *
     * @param event
     */
    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if(this.clickListener) this.clickListener();
            if(this.contextmenulistener) this.contextmenulistener();
            this.close();
        }
    }

    get popoverStyle() {
        return {
            top: this.top,
            left: this.left
        };
    }

    /**
     * close the popover
     */
    private close() {
        this.self.destroy();
    }

}
