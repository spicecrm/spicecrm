/**
 * @module AdminComponentsModule
 */
import {Injectable, OnDestroy} from '@angular/core';

import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class administration implements OnDestroy {

    /**
     * indicates that we are loading
     */
    public loading: boolean = false;

    /**
     *  the navoigation items
     */
    public adminNavigation: any[] = [];

    /**
     * the current selected item
     */
    public opened_itemid: any = {};

    /**
     * keep the open block
     */
    public opened_block: any;

    /**
     * the subscription to the broadfast service for laoder changes
     */
    public broadcastsubscription: any;

    /**
     * when the admin menu is minimized
     */
    public minimized: boolean = false;

    /**
     * the current admin
     */
    public admincomponent: any = {
        component: 'AdministrationHomeScreen',
        componentconfig: {}
    };

    /**
     * the behaviour subject for component changes
     */
    public admincomponent$: BehaviorSubject<any>;

    public loaded$: BehaviorSubject<boolean>;

    /**
     * a filter string to be applied to the content
     */
    public itemfilter: string = '';

    constructor(
        public backend: backend,
        public broadcast: broadcast,
        public language: language
    ) {
        // initialize the beh subject
        this.admincomponent$ = new BehaviorSubject<any>(this.admincomponent);

        // load the navigation
        this.loaded$ = new BehaviorSubject<boolean>(false);
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
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'loader.reloaded':
                this.loadNavigation();
                break;
        }
    }

    /**
     * loads nav items for the admin from the backend
     */
    public loadNavigation() {
        this.loading = true;
        this.backend.getRequest('system/spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
                this.loading = false;
                this.loaded$.next(true);
            }
        );

    }

    /**
     * toggles the minimized flag
     */
    public toggleMinimized(){
        this.minimized = !this.minimized;
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
     * returns the admin label for the item with the given id
     *
     * @param itemid
     */
    public getItemLabel(itemid: string): string {
        let adminaction;
        this.opened_block = undefined;
        this.adminNavigation.some(block => {
                adminaction = block.groupcomponents.find(comp => comp.id == itemid);
                if (adminaction) {
                    this.opened_block = block;
                    return true;
                }
            }
        );

        return adminaction.admin_label;
    }

    /**
     * navigate to a block and item
     *
     * @param block
     * @param item
     */
    public navigateto(itemid) {

        let adminaction;
        this.adminNavigation.some(block => {
                adminaction = block.groupcomponents.find(comp => comp.id == itemid);
                if (adminaction) {
                    return true;
                }
            }
        );

        if (adminaction.component) {
            this.admincomponent = adminaction;
            if ( !this.admincomponent.componentconfig.label ) this.admincomponent.componentconfig.label = this.admincomponent.admin_label;
            this.admincomponent$.next(this.admincomponent);
            this.opened_itemid = itemid;
        }
    }


    /**
     * returns the filtered navigation
     */
    get navigationGroups() {
        // check if we have a filter .. if not just return the complete tree
        if (this.itemfilter == '' || this.minimized) {
            return this.adminNavigation;
        }

        // filter the tree
        let groups = [];
        for (let group of this.adminNavigation) {
            // check if the group mnatches .. if yes return the complete group
            if (
                (group.label && this.language.getLabel(group.label).toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0) ||
                (group.label && this.language.getLabel(group.label, '', 'long').toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0)
            ) {
                groups.push(group);
            } else {
                // search if we find any component that matches
                let filteredcompopnents = [];
                for (let groupcomponent of group.groupcomponents) {
                    if (
                        groupcomponent.adminaction.toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0 ||
                        (groupcomponent.admin_label && this.language.getLabel(groupcomponent.admin_label).toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0) ||
                        (groupcomponent.admin_label && this.language.getLabel(groupcomponent.admin_label, '', 'long').toLowerCase().indexOf(this.itemfilter.toLowerCase()) >= 0)
                    ) {
                        filteredcompopnents.push(groupcomponent);
                    }
                }
                // if we did find at least one component ... add the group with the filtered components
                if (filteredcompopnents.length > 0) {
                    groups.push({
                        id: group.id,
                        name: group.name,
                        label: group.label,
                        groupcomponents: filteredcompopnents
                    });
                }
            }
        }

        return groups;
    }

}
