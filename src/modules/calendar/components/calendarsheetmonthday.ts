import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month-day',
    templateUrl: './app/modules/calendar/templates/calendarsheetmonthday.html',
    host:{
        'class' : 'slds-is-absolute slds-truncate'
    }
})
export class CalendarSheetMonthDay {
    @Input() sheetday: any = {};
    @Input() events: Array<any> = [];
    @Output() navigateday: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef) {

    }

    gotoDay(){
        this.navigateday.emit(this.sheetday);
    }

    getDisplayEvents(){

    }
}