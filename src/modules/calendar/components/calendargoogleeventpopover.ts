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
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

/**
 * Display a popover to list the google event details
 */
@Component({
    templateUrl: './src/modules/calendar/templates/calendargoogleeventpopover.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGoogleEventPopover implements AfterViewInit {
    /**
     * holds the google event data
     */
    public event: any = {};
    /**
     * holds the nubbin class
     */
    public nubbinClass: string = '';
    /**
     * holds the popover style
     */
    public popoverStyle: any = {};
    /**
     * mobile view boolean to fix the display position on active
     */
    public isMobileView: boolean = false;
    /**
     * reference of the parent element to handle the positioning
     */
    public parentElementRef;
    /**
     * reference of self for destroy purpose
     */
    public self: any;
    /**
     * holds the popover hide timeout
     */
    private hidePopoverTimeout: any = {};
    /**
     * element reference of the popover container to handle its style
     */
    @ViewChild('popoverContainer', {read: ViewContainerRef, static: true}) private popoverContainer: ViewContainerRef;

    constructor(private metadata: metadata,
                private calendar: calendar,
                private language: language,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef) {
    }

    /**
     * detectChanges to prevent angular change detection error
     * set popover position
     */
    public ngAfterViewInit() {
        this.setPopoverPosition();
        this.cdr.detectChanges();
    }

    /**
     * handle closing the popover
     */
    public closePopover(force = false, event?) {
        if (force) {
            if (event && event.relatedTarget.classList.contains('slds-dropdown')) {
                let dropdownListener = this.renderer.listen(event.relatedTarget, 'click', () => {
                    dropdownListener();
                    this.self.destroy();
                });
            } else {
                this.self.destroy();
            }
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }

    /**
     * set popover style and the popover sides and position
     */
    private setPopoverPosition() {

        if (this.isMobileView) {
            return {left: 0, bottom: 0, width: '100%'};
        }

        let popoverSide: string;
        let popoverPosition: string;

        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popoverContainer.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            popoverSide = 'right';
        } else {
            popoverSide = 'left';
        }

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + 30 > 0) {
            popoverPosition = 'bottom';
            this.popoverStyle = {
                top: (rect.top - poprect.height + 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        } else {
            popoverPosition = 'top';
            this.popoverStyle = {
                top: (rect.top - 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        }

        this.nubbinClass = (popoverSide == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + popoverPosition;
    }

    /**
     * clear hide timeout
     */
    private onMouseEnter() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
     * call to force closing the popover
     */
    private onMouseLeave(event) {
        this.closePopover(true, event);
    }
}
