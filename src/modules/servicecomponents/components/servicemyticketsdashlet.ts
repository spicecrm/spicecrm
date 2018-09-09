import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {reminder} from '../../../services/reminder.service';
import {toast} from '../../../services/toast.service';

declare var moment: any;

@Component({
    selector: 'service-my-tickets-dashlet',
    templateUrl: './app/modules/servicecomponents/templates/servicemyticketsdashlet.html'
})
export class ServiceMyTicketsDashlet implements OnInit{

    @ViewChild('ticketcontainer', {read: ViewContainerRef}) ticketcontainer: ViewContainerRef;

    tickets: Array<any> = [];
    totalcount: number = 0;
    isLoading: boolean = false;

    constructor(private language: language, private metadata: metadata, private backend: backend, private router: Router, private elementref: ElementRef) {

    }

    ngOnInit(){
        this.backend.getRequest('modules/ServiceTickets/myopenitems').subscribe(tickets => {
            this.tickets = tickets.tickets;
            this.totalcount = tickets.totalcount;
        });
    }

    get containerStyle(){
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.ticketcontainer.element.nativeElement.offsetTop + 'px)'
        }
    }

}