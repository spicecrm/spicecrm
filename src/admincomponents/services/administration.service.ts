/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
     * the subscription to the broadfast service for laoder changes
     */
    private broadcastsubscription: any;



    /**
     * the current admin
     */
    private admincomponent: any = {
        component: 'AdministrationHomeScreen',
        componentconfig: {}
    };

    /**
     * the behaviour subject for component changes
     */
    public admincomponent$: BehaviorSubject<any>;

    /**
     * a filter string to be applied to the content
     */
    public itemfilter: string = '';

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private language: language
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
        this.loading = true;
        this.backend.getRequest('spiceui/admin/navigation').subscribe(
            nav => {
                this.adminNavigation = nav;
                this.loading = false;
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
     * returns the admin label for the item with the given id
     *
     * @param itemid
     */
    public getItemLabel(itemid: string): string {
        let adminaction;
        this.adminNavigation.some(block => {
                adminaction = block.groupcomponents.find(comp => comp.id == itemid);
                if (adminaction) {
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
            this.admincomponent$.next(this.admincomponent);
            this.opened_itemid = itemid;
        }
    }


    /**
     * returns the filtered navigation
     */
    get navigationGroups() {
        // check if we have a filter .. if not just return the complete tree
        if (this.itemfilter == '') {
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
