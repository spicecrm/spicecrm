import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-date-picker',
    templateUrl: './src/modules/calendar/templates/calendardatepicker.html',
})
export class CalendarDatePicker implements OnInit, OnChanges {

    @Input() private setdate: any = new moment();
    @Output() private setdateChange: EventEmitter<any> = new EventEmitter<any>();

    private curDate: any = new moment();
    public currentGrid: Array<any> = [];

    constructor(private language: language, private calendar: calendar) {
    }

    public ngOnInit() {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get currentYear(): number {
        return this.curDate.year();
    };

    set currentYear(value) {
        this.curDate.year(value);
        this.buildGrid();
    };

    get currentMonth(): string {
        return moment.months()[this.curDate.month()];
    }

    private weekdays() {
        let weekDays = moment.weekdaysShort();
        switch (this.weekStartDay) {
            case 1:
                let sun = weekDays.shift();
                weekDays.push(sun);
                weekDays.length = this.weekDaysCount;
                return weekDays;
            default:
                weekDays.length = this.weekDaysCount;
                return weekDays;
        }
    }
    private weekdayLong(dayIndex) {
        return moment.weekdays(dayIndex + this.weekStartDay);
    }

    private notCurrentMonth(month) {
        return month !== this.curDate.month();
    }

    private isToday(day, month) {
        let today = new moment();
        return today.year() === this.curDate.year() && today.month() === month && today.date() == day;
    }

    private isCurrent(day, month) {
        return this.setdate && this.curDate.year() === this.setdate.year() && this.setdate.month() === month && this.setdate.date() == day;
    }

    private isCurrentWeek(week) {
        let firstDay = new moment();
        firstDay.date(week[0].day);
        firstDay.month(week[0].month);
        return this.setdate.year() === this.curDate.year() && this.setdate.week() === firstDay.week();
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

    private pickDate(day, month) {

        if (this.setdate.date() == day && this.setdate.month() == month) {return}

        // if no date ws passed in and a date is picked create a new object
        if (!this.setdate) {
            this.setdate = new moment();

        }

        // update the set date and emit it
        this.setdate.year(this.curDate.year());
        this.setdate.month(month);
        this.setdate.date(day);
        this.setdateChange.emit(this.setdate);

    }

    private buildGrid() {
        this.currentGrid = [];
        let fdom = new moment(this.curDate);

        // move to first day of month
        fdom.date(1);
        // Set week day start
        fdom.day(this.weekStartDay);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            while (i < this.weekDaysCount) {
                week.push({day: fdom.date(), month: fdom.month()});
                let weekDaysOffset = 7 - this.weekDaysCount;
                if (i == (this.weekDaysCount - 1) && this.weekDaysCount < 7) {fdom.add(weekDaysOffset, 'd')}
                fdom.add(1, 'd');
                i++;
            }
            this.currentGrid.push(week);
            j++;
        }
    };
}
