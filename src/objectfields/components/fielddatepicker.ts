import {Component, Input, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

declare var moment: any;

@Component({
    selector: 'field-date-picker',
    templateUrl: './app/objectfields/templates/fielddatepicker.html'
})
export class fieldDatePicker implements OnInit {

    @Input() setdate: any = new moment();
    @Output() setdateChange: EventEmitter<Date> = new EventEmitter<Date>();
    @Input() posclass: string = 'slds-dropdown--bottom';

    curDate: any = new moment();

    get currentYear(): number {
        return this.curDate.year();
    };

    set currentYear(value) {
        this.curDate.year(value);
        this.buildGrid();
    };

    get currentMonth(): string {
        return moment.months()[this.curDate.month()]
    }

    currentGrid: Array<any> = [];

    constructor(private model: model, private view: view, private language: language, private metadata: metadata, private popup: popup, private elementRef: ElementRef) {
    }

    get posStyle(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();

        return{
            position: 'fixed',
            top: rect.top - 40 + 'px',
            left: rect.left + 16 + 'px'
        }
    }

    weekdays(){
        return moment.weekdaysShort();
    }

    ngOnInit() {
        this.curDate = new moment(this.setdate);
        this.buildGrid();
    }

    notCurrentMonth(month) {
        return month !== this.curDate.month();
    }

    isToday(day, month){
        let today = new moment();
        if(today.year() === this.curDate.year() && today.month() === month && today.date() == day)
            return true;
        else
            return false;
    }

    isCurrent(day, month){
        if(this.setdate && this.curDate.year() === this.setdate.year() && this.setdate.month() === month && this.setdate.date() == day)
            return true;
        else
            return false;
    }

    prevMonth() {
        this.curDate.subtract(1, 'months');
        this.buildGrid();
    }

    nextMonth() {
        this.curDate.add(1, 'months');
        this.buildGrid();
    }

    goToday() {
        this.curDate = new moment();
        this.setdateChange.emit(this.curDate);
        this.popup.close();
    }

    pickDate(day, month){
        // if no date ws passed in and a date is picked create a new object
        if(!this.setdate) this.setdate = new moment();

        // update the set date and emit it
        this.setdate.year(this.curDate.year());
        this.setdate.month(month);
        this.setdate.date(day);
        this.setdateChange.emit(this.setdate);

        // close the popup
        this.popup.close();
    }

    buildGrid(){
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