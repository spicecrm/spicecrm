/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {language} from '../../services/language.service';
import {userpreferences} from "../../services/userpreferences.service";

/* @ignore */
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
    public secondGrid: any[] = [];
    public yearsList: any[] = [];
    /*
    * @input setDate: moment
    */
    @Input() private setDate: any;
    /*
    * @input dual: boolean
    */
    @Input() private dual: boolean = false;
    /*
    * @input minDate: moment
    */
    @Input() private minDate: any;
    /*
    * @input maxDate: moment
    */
    @Input() private maxDate: any;
    /*
    * @input weekStartDay: number
    */
    @Input() private weekStartDay: number = 0;
    /*
    * @input showTodayButton: boolean
    */
    @Input() private showTodayButton: boolean = true;
    /*
    * @output datePicked: moment
    */
    @Output() private datePicked: EventEmitter<any> = new EventEmitter<any>();

    private curDate: any = new moment();
    private secondDate: any = new moment();

    constructor(private language: language, private userPreferences: userpreferences) {
        let preferences = this.userPreferences.unchangedPreferences.global;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0 || this.weekStartDay;
    }

    get currentYear(): any {
        return {
            id: this.curDate.year(),
            name: this.curDate.year()
        };
    }

    set currentYear(value) {
        this.curDate.year(value.length ? value : value.name);
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
        this.initializeGrid();
    }

    public ngOnChanges() {
        this.initializeGrid();
    }

    /*
    * @initialize grid
    * @set curDate
    * @add 1 month to secondDate
    * @buildYearsList
    * @buildGrids
    */
    private initializeGrid() {
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
    }

    /*
    * @build yearsList
    * @set yearsList
    */
    private buildYearsList() {
        this.yearsList = new Array(11).fill('').map((e, i) => {
            let year = i - 5 + +this.curDate.year();
            return {id: year.toString(), name: year.toString()};
        });
    }

    /*
    * @param dayIndex: number
    * @return weekdayLong: string
    */
    private weekdayLong(dayIndex) {
        let lang = this.language.currentlanguage.substring(0, 2);
        moment.locale(lang);
        return moment.weekdays(dayIndex + this.weekStartDay);
    }

    /*
    * @check is disabled
    * @param date: moment
    * @return boolean
    */
    private disabled(date) {
        if (!date) return false;
        if (date.isBefore(this.curDate, 'month') || (!this.dual && date.isAfter(this.curDate, 'month')) || (this.dual && date.isAfter(this.secondDate, 'month'))) return true;

        let thedate = new moment(date.format());
        if (this.minDate && thedate.isBefore(this.minDate, 'month')) {
            return true;
        }
        return !!(this.maxDate && thedate.isAfter(this.maxDate, 'month'));
    }

    /*
    * @check is today
    * @param date: moment
    * @return boolean
    */
    private isToday(date) {
        if (!date) return false;
        let today = new moment();
        return today.isSame(date, 'year') && today.isSame(date, 'month') && today.isSame(date, 'day');
    }

    /*
    * @check is current
    * @param date: moment
    * @return boolean
    */
    private isCurrent(date) {
        if (!date) return false;
        return this.setDate && this.setDate.isSame(date, 'year') && this.setDate.isSame(date, 'month') && this.setDate.isSame(date, 'day');
    }

    /*
    * @subtract 1 month to curDate
    * @subtract? 1 month to secondDate
    * @buildGrids
    */
    private prevMonth() {
        this.curDate.subtract(1, 'months');
        if (this.dual) this.secondDate.subtract(1, 'months');
        this.buildGrids();
    }

    /*
    * @add 1 month to curDate
    * @add? 1 month to secondDate
    * @buildGrids
    */
    private nextMonth() {
        this.curDate.add(1, 'months');
        if (this.dual) this.secondDate.add(1, 'months');
        this.buildGrids();
    }

    /*
    * @set curDate to today
    * @buildGrids
    */
    private goToday() {
        this.curDate = new moment();
        this.buildGrids();
    }

    /*
    * @param date
    * @emit newDate: moment by datePicked
    */
    private pickDate(date) {
        if (!date) return;
        let newDate = new moment(date.format());

        if (this.minDate && newDate.isBefore(this.minDate)) {
            return false;
        }
        if (this.maxDate && newDate.isAfter(this.maxDate)) {
            return false;
        }

        this.datePicked.emit(newDate);
    }

    /*
    * @buildGridWeeks
    * @reset currentGrid
    * @reset secondGrid
    */
    private buildGrids() {
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
    private buildGridWeeks(grid, date) {
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
