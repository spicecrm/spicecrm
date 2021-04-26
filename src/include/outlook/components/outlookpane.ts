/**
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {GroupwareService} from "../../../include/groupware/services/groupware.service";
import {session} from "../../../services/session.service";
import {broadcast} from "../../../services/broadcast.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

declare var Office: any;

/**
 * Main container for the SpiceCRM Outlook add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'outlook-pane',
    templateUrl: './src/include/outlook/templates/outlookpane.html'
})
export class OutlookPane implements OnInit {

    constructor(
        private configuration: OutlookConfiguration,
        private groupware: GroupwareService,
        private router: Router,
        private session: session,
        private model: model,
        private metadata: metadata,
        private broadcast: broadcast
    ) {
        // ToDo: implement pinned pane that relaod when item is changed
        Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
            this.itemChanged();
        });

    }

    /**
     * display the bottom bar only when we have a message with an id
     */
    get displayBottomBar() {
        return Office.context.mailbox.item.itemType == 'message' && Office.context.mailbox.item.itemId;
    }

    /**
     * Sets the ID of the currently selected email.
     */
    public ngOnInit(): void {
        this.model.module = 'Emails';
        this.model.initialize();
        this.groupware.messageId = Office.context.mailbox.item.itemId;
    }

    /**
     * set the message id and navigate to the base route
     * @private
     */
    private itemChanged() {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
        this.groupware.emailId = '';

        const config = this.metadata.getComponentConfig('OutlookPane');
        const mainRoute = !config.mainRoute ? '/groupware/details' : config.mainRoute;

        if (this.router.routerState.snapshot.url == mainRoute) {
            this.broadcast.broadcastMessage('groupware.itemchanged');
        } else {
            this.router.navigate([mainRoute]);
        }
    }
}
