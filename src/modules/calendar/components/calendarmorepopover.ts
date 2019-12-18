/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectorRef, Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: './src/modules/calendar/templates/calendarmorepopover.html',
    providers: [calendar]
})
export class CalendarMorePopover implements AfterViewInit {
    public events: any[] = [];
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public isMobileView: boolean = false;
    public sheetDay: any = {};
    public parentElementRef: any = null;
    public self: any = null;
    private hidePopoverTimeout: any = {};
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    constructor(private metadata: metadata,
                private calendar: calendar,
                private language: language,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef) {
    }

    /*
    * @return style: object = {height, position, display}
    */
    get eventStyle() {
        return {
            height: this.calendar.multiEventHeight + 'px',
            position: 'initial',
            display: 'block'
        };
    }

    /*
    * @return moment format = "D MMM," of calendarDate
    */
    get shortDate() {
        let navigateDate = this.calendar.calendarDate;
        return navigateDate.month(this.sheetDay.month).date(this.sheetDay.day).format('D MMM,');
    }

    /*
    * @correct popover position when it overflows
    * @set popoverside: 'right' | 'left'
    * @set popoverpos: 'top' | 'bottom'
    * @correctionDistance = 30
    * @return style: object = {top, left, width?}
    */
    get popoverStyle() {
        if (this.isMobileView) {
            return {left: 0, bottom: 0, width: '100%'};
        }

        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + 30 > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        }
    }

    /*
    * @detectChanges to prevent angular change detection error
    */
    public ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    /*
    * @listen to event.relatedTarget click
    * @input force: boolean = false
    * @input event?: MouseEvent
    * @destroy self
    * @setTimeout for hidePopoverTimeout = 500ms
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

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /*
    * @clearTimeout for hidePopoverTimeout
    */
    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /*
    * @input event
    * @pass event
    * @closePopover
    */
    private onMouseOut(event) {
        this.closePopover(true, event);
    }

    /*
    * @input event
    * @pass event
    * @return class: string
    */
    private getNubbinClass() {
        return (this.popoverside == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverpos;
    }
}
