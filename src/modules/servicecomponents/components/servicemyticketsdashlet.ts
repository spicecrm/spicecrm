/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit,  ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


@Component({
    selector: 'service-my-tickets-dashlet',
    templateUrl: '../templates/servicemyticketsdashlet.html'
})
export class ServiceMyTicketsDashlet implements OnInit{

    @ViewChild('ticketcontainer', {read: ViewContainerRef, static: true}) ticketcontainer: ViewContainerRef;

    tickets: Array<any> = [];
    totalcount: number = 0;
    isLoading: boolean = false;

    constructor(public language: language, public metadata: metadata, public backend: backend, public router: Router, public elementref: ElementRef) {

    }

    ngOnInit(){
        this.backend.getRequest('module/ServiceTickets/myopenitems').subscribe(tickets => {
            this.tickets = tickets.tickets;
            this.totalcount = tickets.totalcount;
        });
    }

    get containerStyle(){
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.ticketcontainer.element.nativeElement.offsetTop + 'px)'
        };
    }

}
