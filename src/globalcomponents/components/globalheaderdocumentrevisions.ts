/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ElementRef, Renderer2} from '@angular/core';
import {notification} from "../../services/notification.service";
import {modal} from "../../services/modal.service";
import {subscription} from "../../services/subscription.service";

/**
 * display notifications on the global header
 */
@Component({
    selector: 'global-header-document-revisions',
    templateUrl: '../templates/globalheaderdocumentrevisions.html'
})
export class GlobalHeaderDocumentRevisions {

    constructor(public notificationService: notification,
                public elementRef: ElementRef,
                public modal: modal,
                public subscription: subscription,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2) {
    }

    /**
     * toggle open popover and handle closing the popover when the click is outside the container
     */
    public openModal() {
        this.modal.openModal( '').subscribe()
    }

    /**
     * a getter to see if the user has subscriptions
     */
    get hasSubscriptions(){
        return this.subscription.subscriptions.length > 0;
    }
}
