/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {Subscription} from "rxjs";

/**
 * renders a tab panel with open and closed tickets summary
 */
@Component({
    selector: 'service-ticket-related-tickets-tiles',
    templateUrl: '../templates/serviceticketrelatedticketstiles.html',
    providers: [relatedmodels]
})
export class ServiceTicketRelatedTicketsTiles implements OnInit {

    /**
     * the fieldset to be rendered
     */
    @Input() public fieldset: string = 'df917124-b071-6f6c-22f5-4a2b3257a050';

    /**
     * the module filter to be used
     */
    @Input() public modulefilter: string;

    @Output() public count: EventEmitter<number> = new EventEmitter<number>();

    /**
     * defines the current scope opf the tabes shwoing the open or the closed items
     */
    public scope: 'open' | 'closed' = 'open';

    /**
     * all subscriptions for the component to be unsubscribed on destroy
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public model: model, public relatedmodels: relatedmodels, public metadata: metadata, public language: language) {

    }

    public ngOnInit(): void {

        // iniaitlize the relatedmodels service
        this.relatedmodels.module = 'Contacts';
        this.relatedmodels.relatedModule = 'ServiceTickets';
        this.relatedmodels.modulefilter = this.modulefilter;
        this.relatedmodels.loaditems = 10;


        // subscribe to model changes
        this.subscriptions.add(this.model.data$.subscribe(data => {
            this.loadrelated();
        }));
    }

    /**
     * gets the contact id
     *
     * ToDo: check if this makes sense to either check the contact the account or a parent
     */
    get contactid() {
        return this.model.getField('contact_id');
    }

    /**
     * checks on change and if changed loads the related models
     */
    public loadrelated() {
        if (this.contactid && this.contactid != this.relatedmodels.id) {
            this.relatedmodels.id = this.contactid;
            this.relatedmodels.getData().subscribe(loaded => {
                this.count.emit(this.relatedmodels.count);
            });
        } else if (!this.contactid || this.contactid == '') {
            this.relatedmodels.resetData();
            this.count.emit(0);
        }
    }

}
