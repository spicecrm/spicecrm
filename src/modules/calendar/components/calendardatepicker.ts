import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

declare var moment: any;

@Component({
    selector: 'calendar-date-picker',
    templateUrl: './src/modules/calendar/templates/calendardatepicker.html',
})
export class CalendarDatePicker implements OnInit, OnChanges {

    @Input() private setdate: any = new moment();
    @Output() private setdateChange: EventEmitter<any> = new EventEmitter<any>();

    private curDate: any = new moment();
    private currentGrid: Array<any> = [];

    constructor(private language: language, private metadata: metadata) {
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
        return moment.weekdaysShort();
    }

    public ngOnInit() {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    private notCurrentMonth(month) {
        return month !== this.curDate.month();
    }

    private isToday(day, month) {
        let today = new moment();
        if (today.year() === this.curDate.year() && today.month() === month && today.date() == day) {
            return true;
        } else {
            return false;
        }
    }

    private isCurrent(day, month) {
        if (this.setdate && this.curDate.year() === this.setdate.year() && this.setdate.month() === month && this.setdate.date() == day) {
            return true;
        } else {
            return false;
        }
    }

    private isCurrentWeek(week) {
        let firstDay = new moment();
        firstDay.date(week[0].day);
        firstDay.month(week[0].month);

        if (this.setdate.year() === this.curDate.year() && this.setdate.week() === firstDay.week()) {
            return true;
        } else {
            return false;
        }
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
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.curDate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(0);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            while (i < 7) {
                week.push({day: fdom.date(), month: fdom.month()});

                fdom.add(1, 'd');
                i++;
            }
            this.currentGrid.push(week);
            j++;
        }
    };
}
