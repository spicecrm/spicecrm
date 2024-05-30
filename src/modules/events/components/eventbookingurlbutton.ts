import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { toast } from '../../../services/toast.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'event-booking-url-button',
    templateUrl: '../templates/eventbookingurlbutton.html',
})
export class EventBookingUrlButton implements OnInit {

    public disabled = true;

    constructor( public language: language, public model: model, public toast: toast, public clipboard: Clipboard ) { }

    public ngOnInit() {
        this.handleDisabled();
        this.model.data$.subscribe(() => this.handleDisabled());
    }

    public execute() {
        const id = this.model.getField('booking_url');
        this.clipboard.copy( id )
        this.toast.sendToast('The booking URL has been copied to the clipboard: '+this.model.getField('booking_url'), 'success');
    }

    public handleDisabled() {
        this.disabled = !this.model.getField('booking_url');
    }
}
