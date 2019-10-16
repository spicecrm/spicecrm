/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, EventEmitter, OnDestroy, Output, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {modelutilities} from "../../../services/modelutilities.service";

/**
 * @ignore
 */
declare var moment: any;
/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'calendar-header',
    templateUrl: './src/modules/calendar/templates/calendarheader.html',
})

export class CalendarHeader implements OnDestroy {
    public openPicker: boolean = false;
    public scheduleUntilDate: any = {};
    private clickListener: any;
    private showTypeSelector: boolean = false;
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private modelUtils: modelutilities,
                private calendar: calendar) {
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
    }

    get modules() {
        return this.calendar.modules;
    }

    get sheetType() {
        return this.calendar.sheetType;
    }

    get isMobileView() {
        return this.calendar.isMobileView;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    set calendarDate(value) {
        this.calendar.calendarDate = new moment(value);
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    get pickerClass() {
        return !this.openPicker || !this.isMobileView ? 'slds-hidden' : '';
    }

    get titleClass() {
        return this.isMobileView ? 'slds-m-bottom--xx-small' : '';
    }

    get headerClass() {
        return this.isMobileView ? 'slds-p-around--x-small' : '';
    }

    get typeDropdownClass() {
        return this.showTypeSelector ? 'slds-is-open' : '';
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    public toggleClosed() {
        this.openPicker = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private handleDatePicked(event) {
        this.datePicked.emit(event);
    }

    private shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.calendar.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.calendar.sheetType == 'Three_Days' ? 3 : 1, this.calendar.duration[this.calendar.sheetType])));
    }

    private shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.calendar.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.calendar.sheetType == 'Three_Days' ? 3 : 1, this.calendar.duration[this.calendar.sheetType])));
    }

    private addOtherCalendar() {
        this.calendar.addOtherCalendar();
    }

    private getCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        switch (this.calendar.sheetType) {
            case 'Week':
                return `${this.getFirstDayOfWeek()} - ${this.getLastDayOfWeek()}`;
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D');
            case 'Schedule':
                return focDate.format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
            case 'Three_Days':
                return focDate.format("MMM D") + ' - ' + moment(focDate.add(2, 'd')).format("MMM D");
        }
    }

    private getCompactCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        return focDate.format('MMM, YYYY');
    }

    private getWeekNumberDisplay() {
        let focDate = new moment(this.calendarDate);
        return `${this.language.getLabel('LBL_WEEK')} ${focDate.format('w')}`;
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekStartDay);
        return focDate.format('MMM D');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekDaysCount);
        return focDate.format('MMM D');
    }

    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    private setType(sheetType) {
        this.calendar.sheetType = sheetType;
        this.calendar.refresh();
        this.showTypeSelector = false;
    }

    private goToday() {
        this.calendarDate = new moment();
    }

    private zoomin() {
        this.calendar.sheetHourHeight += 10;
    }

    private zoomout() {
        this.calendar.sheetHourHeight -= 10;
    }

    private resetzoom() {
        this.calendar.sheetHourHeight = 80;
    }

    private toggleOpen(picker, button) {
        this.openPicker = !this.openPicker;
        if (this.openPicker) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event, picker, button));
        }
    }

    private onDocumentClick(event: MouseEvent, picker, button) {
        if (this.openPicker && !picker.contains(event.target) && !button.contains(event.target)) {
            this.openPicker = false;
            this.clickListener();
        }
    }

    private toggleVisibleModules(module) {
        let found = this.calendar.otherCalendars.some(calendar => {
            if (calendar.name == module) {
                calendar.visible = !calendar.visible;
                this.calendar.setOtherCalendars(this.calendar.otherCalendars.slice());
                return true;
            }
        });
        if (!found) {
            this.calendar.otherCalendars.push({
                id: this.modelUtils.generateGuid(),
                name: module,
                visible: false
            });
            this.calendar.setOtherCalendars(this.calendar.otherCalendars.slice());
        }
    }

    private getIconStyle(module) {
        return this.calendar.otherCalendars.some(calendar => module == calendar.name && !calendar.visible) ? {'-webkit-filter': 'grayscale(1)','filter': 'grayscale(1)'} : {};
    }
}
