/**
 * @module ServiceComponentsModule
 */
import {
    Component, ElementRef, OnDestroy, OnInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketcontactdetail.html',
    providers: [model]
})
export class ServiceTicketContactDetail implements OnDestroy, OnInit {

    /**
     * the componentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * the fieldset rendered in the header
     */
    private headerfieldset: string;

    /**
     * the componentset rendered in the body
     */
    private componentset: string;

    /**
     * any subscription the component might have that are killed on destroy
     */
    private subscriptions: Subscription = new Subscription();

    constructor(@SkipSelf() private parent: model, private model: model, private metadata: metadata, private language: language) {

        this.subscriptions.add(this.parent.data$.subscribe(ticketdata => {
            this.loadContact();
        }));

        this.model.module = 'Contacts';
    }

    public ngOnInit(): void {
        this.componentset = this.componentconfig.componentset;
        this.headerfieldset = this.componentconfig.headerfieldset;
    }

    /**
     * unsubscribe from the model on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns a contactid if one is set on the parent model (the ticket
     */
    get contactid() {
        return this.parent.getField('contact_id');
    }

    /**
     * loads the contact on change
     */
    private loadContact() {
        if (this.contactid && this.contactid != this.model.id) {
            this.model.id = this.contactid;
            this.model.getData();
        }
    }

}