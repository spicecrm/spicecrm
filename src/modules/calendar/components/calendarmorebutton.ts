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
 * @module ModuleCalendar
 */
import {Component, ElementRef, HostListener, Injector, Input, OnDestroy} from '@angular/core';
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
 * Displays a button in a month day cell to handle displaying the overflowed events in a modal
 */
@Component({
    selector: 'calendar-more-button',
    templateUrl: './src/modules/calendar/templates/calendarmorebutton.html'

})

export class CalendarMoreButton implements OnDestroy {
    /*
    * @input moreevents: any[]
    */
    @Input("moreevents") public events: any[] = [];
    /*
    * @input ismobileview: boolean = false
    */
    @Input("ismobileview") private isMobileView: boolean = false;
    /*
    * @input sheetday: any
    */
    @Input("sheetday") private sheetDay: any = {};

    private popoverComponentRef = null;
    private showPopoverTimeout: any = {};

    constructor(private elementRef: ElementRef,
                private language: language,
                private footer: footer,
                private injector: Injector,
                private metadata: metadata) {
    }

    /*
    * @closePopover
    */
    public ngOnDestroy() {
        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover(true);
        }
    }

    /*
    * @listen mouseenter
    * @setTimeout showPopoverTimeout = 500ms
    * @renderPopover
    */
    @HostListener('mouseenter')
    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    /*
    * @listen mouseleave
    * @clearTimeout showPopoverTimeout
    * @closePopover
    */
    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }
        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover();
        }
    }

    /*
    * @addComponent CalendarMorePopover to the footer
    * @pass events
    * @sort events by start date
    * @pass isMobileView
    * @pass sheetDay
    * @pass parentElementRef
    * @set popoverComponentRef
    */
    private renderPopover() {
        this.metadata.addComponent('CalendarMorePopover', this.footer.modalcontainer, this.injector)
            .subscribe(
                popoverRef => {
                    popoverRef.instance.events = this.events.slice().sort((a, b) => a.start.isAfter(b.start) ? 1 : -1);
                    popoverRef.instance.isMobileView = this.isMobileView;
                    popoverRef.instance.sheetDay = this.sheetDay;
                    popoverRef.instance.parentElementRef = this.elementRef;
                    this.popoverComponentRef = popoverRef.instance;
                }
            );
    }
}
