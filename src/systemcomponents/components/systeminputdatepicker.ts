/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {language} from '../../services/language.service';
import {userpreferences} from "../../services/userpreferences.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'system-input-date-picker',
    templateUrl: './src/systemcomponents/templates/systeminputdatepicker.html',
    host: {
        class: 'slds-datepicker'
    }
})
export class SystemInputDatePicker implements OnInit, OnChanges {


    public currentGrid: any[] = [];
    @Input() private setDate: any;
    @Input() private minDate: any;
    @Input() private maxDate: any;
    @Input() private weekStartDay: number = 0;
    @Input() private showTodayButton: boolean = true;
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();
    private curDate: any = new moment();

    constructor(private language: language, private userPreferences: userpreferences) {
        let preferences = this.userPreferences.unchangedPreferences.global;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
    }

    get currentYear(): number {
        return this.curDate.year();
    }

    set currentYear(value) {
        this.curDate.year(value);
        this.buildGrid();
    }

    get currentMonth(): string {
        return moment.localeData().months()[this.curDate.month()];
    }

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
        this.intializeGrid();
    }

    public ngOnChanges() {
        this.intializeGrid();
    }

    private intializeGrid() {
        if (this.setDate) {
            this.curDate = new moment(this.setDate);
        } else {
            this.curDate = new moment();
        }

        this.buildGrid();
    }

    private weekdayLong(dayIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.weekdays(dayIndex + this.weekStartDay);
    }

    private notCurrentMonth(month) {
        return month !== this.curDate.month();
    }

    private disabled(month, day) {
        if (month !== this.curDate.month()) return true;

        let thedate = new moment();
        thedate.date(day).month(month).year(this.curDate.year());
        if (this.minDate && thedate.isBefore(this.minDate)) {
            return true;
        }
        return !!(this.maxDate && thedate.isAfter(this.maxDate));
    }

    private isToday(day, month) {
        let today = new moment();
        return today.year() === this.curDate.year() && today.month() === month && today.date() == day;
    }

    private isCurrent(day, month) {
        return this.setDate && this.curDate.year() === this.setDate.year() && this.setDate.month() === month && this.setDate.date() == day;
    }

    private prevMonth() {
        this.curDate.subtract(1, 'months');
        this.buildGrid();
    }

    private nextMonth() {
        this.curDate.add(1, 'months');
        this.buildGrid();
    }

    private goToday() {
        this.curDate = new moment();
        this.buildGrid();
    }

    private pickDate(date, month) {
        let newDate = new moment().year(this.currentYear).month(month).date(date);

        if (this.minDate && newDate.isBefore(this.minDate)) {
            return false;
        }
        if (this.maxDate && newDate.isAfter(this.maxDate)) {
            return false;
        }

        this.datePicked.emit(newDate);
    }

    private buildGrid() {
        this.currentGrid = [];
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.curDate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(this.weekStartDay);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = {days: [], number: fdom.format('w')};
            while (i < 7) {
                week.days.push({day: fdom.date(), month: fdom.month()});
                fdom.add(1, 'd');
                i++;
            }
            this.currentGrid.push(week);
            j++;
        }
    }


}
