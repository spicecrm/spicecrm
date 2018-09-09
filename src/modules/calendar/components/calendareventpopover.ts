import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-event-popover',
    templateUrl: './src/modules/calendar/templates/calendareventpopover.html'

})
export class CalendarEventPopover {

    @ViewChild('calendarcontent', {read: ViewContainerRef}) calendarcontent: ViewContainerRef;
    showPopover: boolean = false;

    constructor(private language: language, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model) {
        // set theenavigation paradigm
    }

    togglePopover(){
        this.showPopover = !this.showPopover;
    }

}