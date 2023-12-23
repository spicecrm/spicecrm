/**
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {language} from '../../services/language.service';
import {userpreferences} from "../../services/userpreferences.service";
import {layout} from "../../services/layout.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {config} from "rxjs";

/* @ignore */
declare var moment: any;

@Component({
    selector: 'system-input-date-picker',
    templateUrl: '../templates/systeminputdatepicker.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'slds-datepicker'
    }
})
export class SystemInputDatePicker implements OnInit, OnChanges {

    public currentGrid: any[] = [];
    public secondGrid: any[] = [];
    public yearsList: any[] = [];
    /*
    * @input setDate: moment
    */
    @Input() public setDate: any;
    /*
    * @input dual: boolean
    */
    @Input() public dual: boolean = false;
    /*
    * @input minDate: moment
    */
    @Input() public minDate: any;
    /*
    * @input maxDate: moment
    */
    @Input() public maxDate: any;
    /*
    * @input weekStartDay: number
    */
    @Input() public weekStartDay: number = 0;
    /*
    * @input showTodayButton: boolean
    */
    @Input() public showTodayButton: boolean = true;
    /**
     * an array with the ensbled weekdays, 0 equals sunday
     */
    @Input() public enabledDays: number[] = [0, 1, 2, 3, 4, 5, 6];
    /**
     * an optional holiday calendar that displays holidays
     */
    @Input() public holidayCalendarId: string;
    /**
     * set to true by default to disable picking of holidays
     */
    @Input() public holidaysDisabled: boolean = true;

    /**
     * holds holidays loaded
     */
    private holidays: any[] = [];

    /*
    * @output datePicked: moment
    */
    @Output() public datePicked: EventEmitter<any> = new EventEmitter<any>();
    public curDate: any = new moment();
    public secondDate: any = new moment();

    constructor(public language: language,
                public layout: layout,
                public userPreferences: userpreferences,
                public backend: backend,
                public config: configurationService,
                public cdRef: ChangeDetectorRef) {
        let preferences = this.userPreferences.unchangedPreferences.global;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
    }

    public _currentYear: { id: string, name: string, group?: string };

    /**
     * return the current year
     */
    get currentYear(): { id: string, name: string } {
        return this._currentYear;
    }

    /**
     * set the current year and rebuild the grid
     * @param value
     */
    set currentYear(value: { id: string, name: string }) {
        this._currentYear = value;
        this.curDate.year(value.name);
        this.buildGrids();
    }

    set secondYear(value) {
        this.curDate.year(value.length ? value : value.name);
        this.buildGrids();
    }

    get secondYearDisplay(): any {
        return this.secondDate.year();
    }

    get currentMonth(): string {
        return moment.localeData().months()[this.curDate.month()];
    }

    get secondMonth(): string {
        return moment.localeData().months()[this.secondDate.month()];
    }

    /*
    * @return weekDays: string[]
    */
    get weekdays() {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        let weekDays = moment.weekdaysMin();
        switch (this.weekStartDay) {
            case 1:
                let sun = weekDays.shift();
                weekDays.push(sun);
                return weekDays;
            default:
                return weekDays;
        }
    }

    public ngOnInit() {
        // load the holidays
        this.loadHolidays();

        // initialize the grid
        this.initializeGrid();
    }

    public ngOnChanges() {
        this.initializeGrid();
    }

    public loadHolidays(){
        if(this.holidayCalendarId){
            let cachedHolidays = this.config.getData('holidays');
            if(cachedHolidays && cachedHolidays[this.holidayCalendarId]){
                this.holidays = cachedHolidays[this.holidayCalendarId]
            } else {
                this.backend.getRequest(`module/SystemHolidayCalendars/${this.holidayCalendarId}/holidays`).subscribe({
                    next: (holidays) => {
                        if(!cachedHolidays) cachedHolidays = [];
                        cachedHolidays[this.holidayCalendarId] = holidays;
                        this.config.setData('holidays', cachedHolidays)
                        this.holidays = holidays;
                        this.cdRef.detectChanges();
                    }
                })
            }
        }
    }


    /*
    * @initialize grid
    * @set curDate
    * @add 1 month to secondDate
    * @buildYearsList
    * @buildGrids
    */
    public initializeGrid() {
        if (this.setDate) {
            this.curDate = new moment(this.setDate);
            this.secondDate = new moment(this.setDate);
        } else {
            this.curDate = new moment();
            this.secondDate = new moment();
        }
        this.secondDate.add(1, 'month');
        this.buildYearsList();
        this.buildGrids();

        // set the current year
        this._currentYear = {id: this.curDate.year(), name: this.curDate.year()};
    }

    /*
    * @build yearsList
    * @set yearsList
    */
    public buildYearsList() {
        this.yearsList = new Array(11).fill('').map((e, i) => {
            let year = i - 5 + +this.curDate.year();
            return {id: year.toString(), name: year.toString()};
        });
    }

    /*
    * @param dayIndex: number
    * @return weekdayLong: string
    */
    public weekdayLong(dayIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.weekdays(dayIndex + this.weekStartDay);
    }

    public notCurrentMonth(date) {
        if (!date) return false;
        return (date.isBefore(this.curDate, 'month') || (!this.dual && date.isAfter(this.curDate, 'month')) || (this.dual && date.isAfter(this.secondDate, 'month')));
    }

    /*
    * @check is disabled
    * @param date: moment
    * @return boolean
    */
    public disabled(date) {
        if (!date) return false;
        // if (date.isBefore(this.curDate, 'month') || (!this.dual && date.isAfter(this.curDate, 'month')) || (this.dual && date.isAfter(this.secondDate, 'month'))) return true;

        // check mindate if set
        let thedate = new moment(date.format());
        if (this.minDate && thedate.isBefore(this.minDate, 'day')) {
            return true;
        }

        // check mindate if set
        if (this.maxDate && thedate.isAfter(this.maxDate, 'day')) {
            return true;
        }

        // check if this is a holiday and holidays are disabled
        if(this.holidaysDisabled && this.isHoliday(date)){
            return true;
        }

        return this.enabledDays.indexOf(parseInt(date.format('d'), 10)) < 0;
    }

    /**
     * gets addtional styles for the date
     *  - cursor not allowed if date is disabled
     *
     * @param date
     */
    public getDayStyle(date){
        // cursor style
        let style: any = {
            cursor: this.disabled(date) ? 'default' : 'pointer'
        }
         // holiday style
        if(this.isHoliday(date)){
            style.border = '1px solid';
            style['border-radius'] = '2px';

        }

        // return the style
        return style;
    }

    /**
     * checks if the date is a holiday
     * @param date
     */
    public isHoliday(date){
        let df = date.format('YYYY-MM-DD');
        return !!this.holidays.find(h => h.holiday_date.substr(0, 10) == df)
    }

    /*
    * @check is today
    * @param date: moment
    * @return boolean
    */
    public isToday(date) {
        if (!date) return false;
        let today = new moment();
        return today.isSame(date, 'year') && today.isSame(date, 'month') && today.isSame(date, 'day');
    }

    /*
    * @check is current
    * @param date: moment
    * @return boolean
    */
    public isCurrent(date) {
        if (!date) return false;
        return this.setDate && this.setDate.isSame(date, 'year') && this.setDate.isSame(date, 'month') && this.setDate.isSame(date, 'day');
    }

    /*
    * @subtract 1 month to curDate
    * @subtract? 1 month to secondDate
    * @buildGrids
    */
    public prevMonth(e: MouseEvent) {
        e.stopPropagation();
        this.curDate.subtract(1, 'months');
        if (this.dual) this.secondDate.subtract(1, 'months');
        this.buildGrids();
    }

    /*
    * @add 1 month to curDate
    * @add? 1 month to secondDate
    * @buildGrids
    */
    public nextMonth(e: MouseEvent) {
        e.stopPropagation();
        this.curDate.add(1, 'months');
        if (this.dual) this.secondDate.add(1, 'months');
        this.buildGrids();
    }

    /*
    * @set curDate to today
    * @buildGrids
    */
    public goToday(e: MouseEvent) {
        e.stopPropagation();
        this.curDate = new moment();
        this.buildGrids();
    }

    /*
    * @param date
    * @emit newDate: moment by datePicked
    */
    public pickDate(date, e: MouseEvent) {
        if(this.disabled(date)) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            // emit the date
            let newDate = new moment(date.format());
            this.datePicked.emit(newDate);
        }
    }

    /*
    * @buildGridWeeks
    * @reset currentGrid
    * @reset secondGrid
    */
    public buildGrids() {
        this.currentGrid = [];
        this.secondGrid = [];

        this.buildGridWeeks(this.currentGrid, this.curDate);
        if (this.dual) {
            this.buildGridWeeks(this.secondGrid, this.secondDate);
        }
    }

    /*
    * @build weeks and their days
    * @push week: moment[] to grid
    * @param grid: any[]
    * @param date: moment
    */
    public buildGridWeeks(grid, date) {
        let fdom = new moment(date);
        // move to first day of month
        fdom.date(1);
        // go the the previous week if the month starts on sunday and the week starts on monday
        if (fdom.day() == 0 && this.weekStartDay == 1) fdom.subtract(7, 'd');
        // move to week start day
        fdom.day(this.weekStartDay);
        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = {days: [], number: fdom.format('w')};
            while (i < 7) {
                // push the day only if we are in currentGrid and the date is the same or before the current date
                // or if we are not i dual mode and the date is after the current date
                // or if we are in dual mode and in the secondGrid and the date is the same or after the second date
                if ((date.isSame(this.curDate, 'month') && fdom.isSameOrBefore(this.curDate, 'month')) || (!this.dual && fdom.isAfter(this.curDate, 'month')) ||
                    (this.dual && date.isSame(this.secondDate, 'month') && fdom.isSameOrAfter(this.secondDate, 'month'))) {
                    week.days[i] = moment(fdom.format());
                }

                // get the week number based on the thursday in that week
                if(fdom.format('d') == 5) week.number = fdom.format('w');

                fdom.add(1, 'd');
                i++;
            }
            grid.push(week);
            // prevent adding the last week if it is out of the current months range
            if (fdom.isAfter(date, 'month') || fdom.isAfter(date, 'year')) break;
            j++;
        }
    }


}
