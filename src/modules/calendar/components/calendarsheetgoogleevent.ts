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
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, Input, NgZone, Output} from '@angular/core';
import {calendar} from "../services/calendar.service";
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";
import {take} from "rxjs/operators";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";

/** @ignore */
declare var moment: any;

/**
 * Display a calendar google event
 */
@Component({
    selector: 'calendar-sheet-google-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetgoogleevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model]
})
export class CalendarSheetGoogleEvent {
    /**
     * holds the google event data
     */
    @Input() private event;
    /**
     * @input event: object
     */
    @Input() private sheetContainer: any = {};
    /**
     * the popover that is rendered
     */
    private popoverComponentRef = null;
    /**
     * holds the popover hide timeout
     */
    private showPopoverTimeout: any = {};

    constructor(private calendar: calendar,
                private footer: footer,
                private metadata: metadata,
                private zone: NgZone,
                private model: model,
                private modal: modal,
                private injector: Injector,
                private elementRef: ElementRef) {
    }

    /**
     * clear the timeout and close the popover
     */
    public ngOnDestroy() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover(true);
        }
    }

    /**
     * set a timeout to render the popover
     */
    private onMouseEnter() {
        this.zone.runOutsideAngular(() => {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
        });
    }

    /**
     * close the popover and clear the timeout
     */
    private onMouseLeave() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover();
        }
    }

    /**
     * renders the popover if a footer container if in the footer service
     */
    private renderPopover() {
        if (this.footer.footercontainer) {
            this.zone.run(() => {
                this.metadata.addComponent('CalendarGoogleEventPopover', this.footer.footercontainer, this.injector).subscribe(
                    popover => {
                        popover.instance.parentElementRef = this.elementRef;
                        popover.instance.event = this.event;
                        this.popoverComponentRef = popover.instance;
                    }
                );
            });
        }
    }

    private onActionClick() {
        this.model.reset();
        this.modal.openModal('CalendarAddModulesModal', true, this.injector)
            .subscribe(modalRef => {
                modalRef.instance.module$
                    .pipe(take(1))
                    .subscribe(module => {
                        if (module) {
                            this.model.module = module.name;
                            const diffMinutes = this.event.end.diff(this.event.start, 'minutes');
                            const durationHours = Math.floor(diffMinutes / 60);
                            const durationMinutes = diffMinutes - durationHours * 60;

                            let presets: any = {
                                [module.dateStartFieldName]: this.event.start,
                                [module.dateEndFieldName]: this.event.end,
                                duration_minutes: durationMinutes,
                                duration_hours: durationHours,
                                name: this.event.summary,
                                description: this.event.description,
                                location: this.event.location,
                                external_id: this.event.id
                            };
                            if (module.name == 'UserAbsences') {
                                presets.user_id = this.calendar.owner;
                                presets.user_name = this.calendar.ownerName;
                            }
                            this.model.addModel('', null, presets).subscribe(() => {
                                this.calendar.removeGoogleEvent(this.event.id);
                            });
                        }
                    });
            });
    }
}
