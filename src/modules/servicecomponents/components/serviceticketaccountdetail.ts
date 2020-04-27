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
    templateUrl: './src/modules/servicecomponents/templates/serviceticketaccountdetail.html',
    providers: [model]
})
export class ServiceTicketAccountDetail implements OnDestroy, OnInit {

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

        this.model.module = 'Accounts';
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
    get accountid() {
        return this.parent.getField('account_id');
    }

    /**
     * loads the contact on change
     */
    private loadContact() {
        if (this.accountid && this.accountid != this.model.id) {
            this.model.id = this.accountid;
            this.model.getData();
        }
    }

}