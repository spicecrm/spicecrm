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
    templateUrl: './src/modules/servicecomponents/templates/serviceticketconsumerdetail.html',
    providers: [model]
})
export class ServiceTicketConsumerDetail implements OnDestroy, OnInit {

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
        this.model.module = 'Consumers';
        this.subscriptions.add(this.parent.data$.subscribe(ticketdata => {
            this.loadConsumer();
        }));
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
    get consumerid() {
        return this.parent.getField('parent_type') == 'Consumers' ? this.parent.getField('parent_id') : this.parent.getField('consumer_id');
    }

    /**
     * loads the contact on change
     */
    private loadConsumer() {
        if (this.consumerid && this.consumerid != this.model.id) {
            this.model.id = this.consumerid;
            this.model.getData();
        }
    }

}
