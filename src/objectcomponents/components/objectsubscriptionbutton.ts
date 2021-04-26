/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {SubscriptionService} from "../../services/subscription.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders a button to toggle subscription on a specific bean
 * requires provided model.service
 */
@Component({
    selector: 'object-subscription-button',
    templateUrl: './src/objectcomponents/templates/objectsubscriptionbutton.html'
})
export class ObjectSubscriptionButton {

    /**
     * indicator that we are subscribging or uinsubscribing currently
     *
     * @private
     */
    private inProcess: boolean = false;

    constructor(private subscriptionService: SubscriptionService,
                private metadata: metadata,
                private model: model) {
    }

    /**
     * toggle add/remove subscription for a record
     * called from parent
     */
    public toggleSubscribe() {
        this.inProcess = true;
        if (this.subscriptionService.hasSubscription(this.model.id)) {
            this.subscriptionService.unsubscribeBean(this.model.id, this.model.module).subscribe(
                res => this.inProcess = false,
                err => this.inProcess = false
            );
        } else {
            this.subscriptionService.subscribeBean(this.model.id, this.model.module).subscribe(
                res => this.inProcess = false,
                err => this.inProcess = false
            );
        }
    }
}
