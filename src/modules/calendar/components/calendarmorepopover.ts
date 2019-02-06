import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

declare var moment: any;

@Component({
    templateUrl: './src/modules/calendar/templates/calendarmorepopover.html',
    providers: [calendar]
})
export class CalendarMorePopover implements OnInit {
    public events: any[] = [];
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public styles = null;
    public isMobileView: boolean = false;
    public sheetDay: any = {};
    public parentElementRef: any = null;
    public self: any = null;
    private hidePopoverTimeout: any = {};
    @ViewChild('popover', {read: ViewContainerRef}) private popover: ViewContainerRef;
    private heightcorrection = 30;
    private widthcorrection = 30;

    constructor(private metadata: metadata, private calendar: calendar, private language: language) {
    }

    get shortDate() {
        let navigateDate = moment(this.calendar.calendarDate);
        return navigateDate.month(this.sheetDay.month).date(this.sheetDay.day).format('D MMM,');
    }

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

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + this.heightcorrection > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        }
    }

    public ngOnInit() {
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    public closePopover(force = false) {
        if (force) {
            this.self.destroy();
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }

    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    private onMouseOut() {
        this.closePopover(true);
    }

    private getNubbinClass() {
        return (this.popoverside == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverpos;
    }
}
