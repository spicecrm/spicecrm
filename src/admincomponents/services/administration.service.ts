/**
 * @module AdminComponentsModule
 */
import {Injectable, OnDestroy} from '@angular/core';

import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class administration implements OnDestroy {

    /**
     *  the navoigation items
     */
    public adminNavigation: any[] = [];

    /**
     * the current selected item
     */
    public opened_itemid: any = {};

    /**
     * the subscription to the broadfast service for laoder changes
     */
    private broadcastsubscription: any;

    /**
     * the current admin
     */
    private admincomponent: any = {
        component: 'AdministrationHomeScreen',
        componentconfig: {}
    }

    /**
     * the behaviour subject for component changes
     */
    public admincomponent$: BehaviorSubject<any>;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private broadcast: broadcast,
    ) {
        // initialize the beh subject
        this.admincomponent$ = new BehaviorSubject<any>(this.admincomponent);

        // load the navigation
        this.loadNavigation();

        // subscribe to broadcast
        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * make sure we unsubscribe when service is destroyed
     */
    public ngOnDestroy(): void {
        this.broadcastsubscription.unsubscribe();
    }


    /**
     * handle reload of loader to reload also admin menu since new items may have been added
     *
     * @param message
     */
    private handleMessage(message) {
        switch (message.messagetype) {
            case 'loader.reloaded':
                this.loadNavigation();
                break;
        }
    }

    /**
     * loads nav items for the admin from the backend
     */
    private loadNavigation() {
        this.backend.getRequest('spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
            }
        );

    }

    /**
     * navigate to the home screen for the admin section
     */
    public navigateHome() {
        this.opened_itemid = null;
        this.admincomponent = {
            component: 'AdministrationHomeScreen',
            componentconfig: {}
        };
        this.admincomponent$.next(this.admincomponent);
    }


    /**
     * navigate to a block and item
     *
     * @param block
     * @param item
     */
    public navigateto(block, item) {


        let adminItem: any = {};

        if (!this.adminNavigation[block]) {
            return false;
        }

        // ToDo change to find
        this.adminNavigation[block].some(blockAction => {
                if (blockAction.id == item.id) {
                    adminItem = blockAction;
                    return true;
                }
            }
        );

        if (adminItem.component) {
            this.admincomponent = adminItem;
            this.admincomponent$.next(this.admincomponent);
        }
    }



    public getNavigationBlocks(filter?: string) {
        let blocks = [];
        for (let block in this.adminNavigation) {
            blocks.push(block);
        }
        return blocks.sort();
    }


    public getNavigationItems(block) {
        let items = [];
        for (let item of this.adminNavigation[block]) {
            items.push(item);
        }
        return items;
    }
}
