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
    selector: 'calendar-sheet-microsoft-event',
    templateUrl: '../templates/calendarsheetmicrosoftevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [model]
})
export class CalendarSheetMicrosoftEvent {
    /**
     * holds the google event data
     */
    @Input() public event;
    /**
     * @input event: object
     */
    @Input() public sheetContainer: any = {};
    /**
     * the popover that is rendered
     */
    public popoverComponentRef = null;
    /**
     * holds the popover hide timeout
     */
    public showPopoverTimeout: any = {};

    constructor(public calendar: calendar,
                public footer: footer,
                public metadata: metadata,
                public zone: NgZone,
                public model: model,
                public modal: modal,
                public injector: Injector,
                public elementRef: ElementRef) {
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
    public onMouseEnter() {
        this.zone.runOutsideAngular(() => {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
        });
    }

    /**
     * close the popover and clear the timeout
     */
    public onMouseLeave() {
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
    public renderPopover() {
        if (this.footer.footercontainer) {
            this.zone.run(() => {
                this.metadata.addComponent('CalendarMicrosoftEventPopover', this.footer.footercontainer, this.injector).subscribe(
                    popover => {
                        popover.instance.parentElementRef = this.elementRef;
                        popover.instance.event = this.event;
                        this.popoverComponentRef = popover.instance;
                    }
                );
            });
        }
    }

    public onActionClick() {
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
                                name: this.event.subject,
                                description: this.event.body?.content,
                                location: this.event.location?.displayName,
                                external_id: this.event.id
                            };
                            if (module.name == 'UserAbsences') {
                                presets.user_id = this.calendar.owner;
                                presets.user_name = this.calendar.ownerName;
                            }
                            this.model.addModel('', null, presets).subscribe(() => {
                                this.calendar.removeMicrosoftEvent(this.event.id);
                            });
                        }
                    });
            });
    }
}
