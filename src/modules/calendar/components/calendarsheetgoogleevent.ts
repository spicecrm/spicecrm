/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, Input, NgZone, Output} from '@angular/core';
import {calendar} from "../services/calendar.service";
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";

/**
 * Display a calendar google event
 */
@Component({
    selector: 'calendar-sheet-google-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetgoogleevent.html',
    changeDetection: ChangeDetectionStrategy.OnPush
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
}
