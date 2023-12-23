/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

/**
 * display a list of the overflowed events from month view
 */
@Component({
    templateUrl: '../templates/calendarmorepopover.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMorePopover implements AfterViewInit {
    /**
     * holds the calendar events
     */
    public events: any[] = [];
    /**
     * holds the nubbin class
     */
    public nubbinClass: string = '';
    /**
     * holds the popover style
     */
    public popoverStyle: any = {};
    /**
     * the sheet day comes from parent to read the date from
     */
    public sheetDay: any = {};
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
    public hidePopoverTimeout: any = {};
    /**
     * element reference of the popover container to handle its style
     */
    @ViewChild('popoverContainer', {read: ViewContainerRef, static: true}) public popoverContainer: ViewContainerRef;

    constructor(public metadata: metadata,
                public calendar: calendar,
                public language: language,
                public renderer: Renderer2,
                public cdr: ChangeDetectorRef) {
    }

    /**
     * @return day short date
     */
    get shortDate() {
        let navigateDate = this.calendar.calendarDate;
        return navigateDate.month(this.sheetDay.month).date(this.sheetDay.day).format('D MMM,');
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
    public setPopoverPosition() {

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

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * clear hide timeout
     */
    public onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
     * call to force closing the popover
     */
    public onMouseOut(event) {
        this.closePopover(true, event);
    }
}
