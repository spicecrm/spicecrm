import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    forwardRef,
    OnChanges
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {SystemInputTime} from "./systeminputtime";

declare var moment: any;

@Component({
    selector: 'system-input-date-picker',
    templateUrl: './src/systemcomponents/templates/systeminputdatepicker.html'
})
export class SystemInputDatePicker implements OnInit, OnChanges {


    @Input() private setDate: any;
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();

    private curDate: any = new moment();
    private currentGrid: Array<any> = [];

    constructor(private language: language) {
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


    get weekdays() {
        return moment.weekdaysShort();
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
        if (this.setDate && this.curDate.year() === this.setDate.year() && this.setDate.month() === month && this.setDate.date() == day) {
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
    }

    private pickDate(date, month) {
        this.datePicked.emit(new moment().year(this.currentYear).month(month).date(date))
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
