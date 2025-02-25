/**
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GroupwareService} from "../../groupware/services/groupware.service";
import {session} from "../../../services/session.service";
import {broadcast} from "../../../services/broadcast.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {OutlookGroupware} from "../services/outlookgroupware.service";
import {OutlookLoginPane} from "./outlookloginpane";
import {SystemDynamicRouteInterceptor} from "../../../systemcomponents/components/systemdynamicrouteinterceptor";
import {loginCheck, loginService} from "../../../services/login.service";

declare var Office: any;

/**
 * Main container for the SpiceCRM Outlook add-in. This gets rendered by the loader.
 * The pane intializes the mailbox and the groupware services. Then it loads the UI and starts the config process
 * if no user and password is set in the store it loads the settings route
 */
@Component({
    selector: 'outlook-pane',
    templateUrl: '../templates/outlookpane.html',
    providers: [
        {provide: GroupwareService, useClass: OutlookGroupware},
        model],
    host: {class: 'slds-height_full'}
})
export class OutlookPane implements OnInit {

    constructor(
        public groupware: GroupwareService,
        public router: Router,
        public session: session,
        public model: model,
        public metadata: metadata,
        public broadcast: broadcast,
        private loginService: loginService
    ) {
        this.adjustRoutes();
        // ToDo: implement pinned pane that relaod when item is changed
        Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, () => {
            this.itemChanged();
        });

        this.broadcast.message$.subscribe((message: any) => {
            if (message.messagetype === 'loader.completed' && message.messagedata === 'loadRepository') {
                this.itemChanged();
            }
        });
    }

    /**
     * adjust the login and empty route to match gsuite module
     * @private
     */
    private adjustRoutes() {

        this.router.config.some(route => {

            if (route.path == 'login') {
                route.component = OutlookLoginPane;
            }
            if (!route.path) {
                route.redirectTo = undefined;
                route.component = SystemDynamicRouteInterceptor;
                route.canActivate = [loginCheck];
            }
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
    public itemChanged() {
        this.groupware.messageId = Office.context.mailbox.item.itemId;
        this.groupware.emailId = '';

        const config = this.metadata.getComponentConfig('OutlookPane');
        const mainRoute = !config.mainRoute ? '/groupware/details' : config.mainRoute;
        this.loginService.redirectUrl = config.mainRoute;

        if (this.router.routerState.snapshot.url == mainRoute) {
            this.broadcast.broadcastMessage('groupware.itemchanged');
        } else {
            this.router.navigate([mainRoute]);
        }
    }
}
