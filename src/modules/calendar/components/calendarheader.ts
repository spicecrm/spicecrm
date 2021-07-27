/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {modelutilities} from "../../../services/modelutilities.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-header',
    templateUrl: './src/modules/calendar/templates/calendarheader.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarHeader implements OnDestroy {
    /**
     * show/hide date picker
     */
    public openPicker: boolean = false;
    /**
     * holds schedule sheet until date
     */
    public scheduleUntilDate: any = {};
    /**
     * holds the click event listener
     */
    private clickListener: any;
    /**
     * show/hide calendar sheet type select menu
     */
    private showTypeSelector: boolean = false;
    /**
     * holds the calendar fts moduels
     */
    @Input() private modules: any[] = [];
    /**
     * emit when a calendar date is picked
     */
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private modelUtils: modelutilities,
                private calendar: calendar) {
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
    }

    /**
     * remove click listener
     */
    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * close picker and remove listener
     */
    public toggleClosed() {
        this.openPicker = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * emit date picked to parent
     * @param event
     */
    private handleDatePicked(event) {
        this.datePicked.emit(event);
    }

    /**
     * shift date forward
     */
    private shiftPlus() {
        this.calendar.shiftPlus();
    }

    /**
     * shift date backward
     */
    private shiftMinus() {
        this.calendar.shiftMinus();
    }

    /**
     * @return calendar header
     */
    private getCalendarHeader() {
        const focDate = new moment(this.calendar.calendarDate);
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

    /**
     * @return compact calendar header
     */
    private getCompactCalendarHeader() {
        const focDate = new moment(this.calendar.calendarDate);
        return focDate.format('MMM, YYYY');
    }

    /**
     * @return week number display
     */
    private getWeekNumberDisplay() {
        let focDate = new moment(this.calendar.calendarDate);
        return `${this.language.getLabel('LBL_WEEK')} ${focDate.format('w')}`;
    }

    /**
     * @return first day of week
     */
    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendar.calendarDate);
        focDate.day(this.calendar.weekStartDay);
        return focDate.format('MMM D');
    }

    /**
     * @return last day of week
     */
    private getLastDayOfWeek() {
        let focDate = new moment(this.calendar.calendarDate);
        focDate.day(this.calendar.weekDaysCount);
        return focDate.format('MMM D');
    }

    /**
     * toggle show/hide type selector
     */
    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    /**
     * set calendar sheet type
     * @param sheetType
     */
    private setType(sheetType) {
        this.calendar.sheetType = sheetType;
        this.calendar.refresh();
        this.showTypeSelector = false;
    }

    /**
     * go to today
     */
    private goToday() {
        this.calendar.calendarDate = new moment();
    }

    /**
     * zoom sheet cells in
     */
    private zoomIn() {
        this.calendar.sheetHourHeight += 10;
        this.calendar.layoutChange$.next();
    }

    /**
     * zoom sheet cells out
     */
    private zoomOut() {
        this.calendar.sheetHourHeight -= 10;
        this.calendar.layoutChange$.next();
    }

    /**
     * reset sheet cells zoom
     */
    private resetZoom() {
        this.calendar.sheetHourHeight = 80;
        this.calendar.layoutChange$.next();
    }

    /**
     * toggle open picker and add click listener to handle close
     * @param picker
     * @param button
     */
    private toggleOpenPicker(picker, button) {
        this.openPicker = !this.openPicker;
        if (this.openPicker) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event, picker, button));
        }
    }

    /**
     * handle document click to close the picker
     * @param event
     * @param picker
     * @param button
     */
    private onDocumentClick(event: MouseEvent, picker, button) {
        if (this.openPicker && !picker.contains(event.target) && !button.contains(event.target)) {
            this.openPicker = false;
            this.clickListener();
        }
    }

    /**
     * toggle visible calendar module
     * @param module
     */
    private toggleVisibleModule(module) {
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

    /**
     * get module icon style
     * @param module
     */
    private getIconStyle(module) {
        return this.calendar.otherCalendars.some(calendar => module == calendar.name && !calendar.visible) ? {'-webkit-filter': 'grayscale(1)','filter': 'grayscale(1)'} : {};
    }
}
