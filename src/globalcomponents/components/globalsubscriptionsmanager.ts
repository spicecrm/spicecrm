/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {subscription} from "../../services/subscription.service";


/**
 * renders a modal allowing the user to see all active subscriptions
 */
@Component({
    selector: 'global-subscriptions-manager',
    templateUrl: '../templates/globalsubscriptionsmanager.html'
})
export class GlobalSubscriptionsManager {

    /**
     * reference to the modal itself
     */
    public self: any;

    public loading: boolean = false;


    constructor(public subscriptions: subscription) {

    }

    /**
     * removes the subscription
     *
     * @param subscription
     */
    public deleteSubscription(subscription) {
        this.loading = true;
        this.subscriptions.unsubscribeBean(subscription.bean_id, subscription.bean_module).subscribe(
            () => {
                this.loading = false;
                // check if there are still subscriptions .. otherwise close the modal
                if (this.subscriptions.subscriptions.length == 0) this.close();
            },
            () => {
                this.loading = false;
            }
        );
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

}
