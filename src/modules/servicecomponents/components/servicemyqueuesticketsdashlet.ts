/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


@Component({
    selector: 'service-myqueues-tickets-dashlet',
    templateUrl: './src/modules/servicecomponents/templates/servicemyqueuesticketsdashlet.html'
})
export class ServiceMyQueuesTicketsDashlet implements OnInit{

    @ViewChild('ticketcontainer', {read: ViewContainerRef, static: true}) ticketcontainer: ViewContainerRef;

    tickets: Array<any> = [];
    totalcount: number = 0;
    isLoading: boolean = true;

    constructor(private language: language, private metadata: metadata, private backend: backend, private router: Router, private elementref: ElementRef) {

    }

    ngOnInit(){
        this.backend.getRequest('module/ServiceTickets/openinmyqueues').subscribe(tickets => {
            this.tickets = tickets.tickets;
            this.totalcount = tickets.totalcount;
            this.isLoading = false;
        });
    }

    get containerStyle(){
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(' + rect.height + 'px - ' + this.ticketcontainer.element.nativeElement.offsetTop + 'px)'
        }
    }

}