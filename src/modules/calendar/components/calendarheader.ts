/**
 * @module ModuleCalendar
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {modelutilities} from "../../../services/modelutilities.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-header',
    templateUrl: '../templates/calendarheader.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarHeader implements OnDestroy {
    /**
     * show/hide date picker
     */
    public openPicker: boolean = false;
    /**
     * indicates if the entered searchterms woudl provoke any error
     * dues to the min and max engram restrictions and thus
     * would certainly not pfind any results
     * @private
     */
    public searchTermError: boolean = false;
    /**
     * the search timeout triggered by the keyup in the search box
     */
    public searchTimeOut: any;
    /**
     * holds schedule sheet until date
     */
    public scheduleUntilDate: any = {};
    /**
     * holds the click event listener
     */
    public clickListener: any;
    /**
     * show/hide calendar sheet type select menu
     */
    public showTypeSelector: boolean = false;
    /**
     * holds the calendar fts moduels
     */
    @Input() public modules: any[] = [];
    /**
     * emit when a calendar date is picked
     */
    @Output() public datePicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language,
                public navigation: navigation,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modelUtils: modelutilities,
                public configuration: configurationService,
                public calendar: calendar) {
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
    public handleDatePicked(event) {
        this.datePicked.emit(event);
    }

    /**
     * shift date forward
     */
    public shiftPlus() {
        this.calendar.shiftPlus();
    }

    /**
     * shift date backward
     */
    public shiftMinus() {
        this.calendar.shiftMinus();
    }

    /**
     * @return calendar header
     */
    get calendarHeader() {
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
     * @return string compact calendar header
     */
    get compactCalendarHeader() {
        const focDate = new moment(this.calendar.calendarDate);
        return focDate.format('MMM, YYYY');
    }

    /**
     * @return string week number display
     */
    get weekNumberDisplay() {
        let focDate = new moment(this.calendar.calendarDate);
        return `${this.language.getLabel('LBL_WEEK')} ${focDate.format('w')}`;
    }

    /**
     * @return first day of week
     */
    public getFirstDayOfWeek() {
        let focDate = new moment(this.calendar.calendarDate);
        focDate.day(this.calendar.weekStartDay);
        return focDate.format('MMM D');
    }

    /**
     * @return last day of week
     */
    public getLastDayOfWeek() {
        let focDate = new moment(this.calendar.calendarDate);
        focDate.day(this.calendar.weekDaysCount);
        return focDate.format('MMM D');
    }

    /**
     * toggle show/hide type selector
     */
    public toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    /**
     * set calendar sheet type
     * @param sheetType
     */
    public setType(sheetType) {
        this.calendar.sheetType = sheetType;
        this.calendar.refresh();
        this.showTypeSelector = false;
    }

    /**
     * go to today
     */
    public goToday() {
        this.calendar.calendarDate = new moment();
    }

    /**
     * zoom sheet cells in
     */
    public zoomIn() {
        this.calendar.sheetHourHeight += 10;
        this.calendar.layoutChange$.next();
    }

    /**
     * zoom sheet cells out
     */
    public zoomOut() {
        this.calendar.sheetHourHeight -= 10;
        this.calendar.layoutChange$.next();
    }

    /**
     * reset sheet cells zoom
     */
    public resetZoom() {
        this.calendar.sheetHourHeight = 80;
        this.calendar.layoutChange$.next();
    }

    /**
     * toggle open picker and add click listener to handle close
     * @param picker
     * @param button
     */
    public toggleOpenPicker(picker, button) {
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
    public onDocumentClick(event: MouseEvent, picker, button) {
        if (this.openPicker && !picker.contains(event.target) && !button.contains(event.target)) {
            this.openPicker = false;
            this.clickListener();
        }
    }

    /**
     * toggle visible calendar module
     * @param module
     */
    public toggleVisibleModule(module) {
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
    public getIconStyle(module) {
        return this.calendar.otherCalendars.some(calendar => module == calendar.name && !calendar.visible) ? {'-webkit-filter': 'grayscale(1)','filter': 'grayscale(1)'} : {};
    }

    get searchTerm(): string {
        return this.calendar.searchTerm;
    }

    set searchTerm(value: string) {
        if (value == this.calendar.searchTerm) return;

        this.calendar.searchTerm = value;
        this.reloadList();
    }

    /**
     * clears the searchterm
     * @private
     */
    public clearSearchTerm() {
        this.searchTerm = '';
    }

    /**
     * reload the model list on 1 second timeout
     * @private
     */
    public reloadList() {
        this.calendar.refresh();
        this.calendar.cdRef.detectChanges();
    }
}
