/**
 * @module ModuleKPIs
 */

import {Component, OnInit} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {layout} from "../../../services/layout.service";

@Component({
    selector: 'kpis-dashlet',
    templateUrl: '../templates/kpisdashlet.html'
})

export class KPIsDashlet implements OnInit {

    /**
     * indicates that we are loading
     */
    public loading: boolean = true;

    /**
     * holds kpis for logged in User
     */
    public kpiTargets: any[] = [];

    /**
     * parentId the KPITarget is related to
     */
    parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    parentType: string = 'Users';

    /**
     * the selected item
     */
    public selectedItem: any;

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal
    ) {
    }

    ngOnInit() {
        this.parentId = this.session.authData.user.id;
        this.selectedItem = {
            id: this.session.authData.user.id,
            summary_text: this.session.authData.user.full_name,
            module: 'Users',
            data: this.session.authData.user
        };
        this.loadKPIs();
    }

    get isAdmin(){
        return this.session.authData.admin;
    }

    /**
     * load KPIs for logged-in User
     * @private
     */
    public loadKPIs() {
        this.kpiTargets = [];
        this.loading = true;
        this.backend.getRequest(`module/KPIs/byparent/${this.parentType}/${this.parentId}`).subscribe({
            next: (data) => {
                this.kpiTargets = data;
                this.loading = false;
            }, error: () => {
                this.toast.sendToast('LBL_ERR_LOADING_KPIS', 'error');
                this.loading = false;
            }
        })
    }

    /**
     * calculate amount of tiles displayed
     * depending on screen width
     */
    get getTileWidthClass() {
        if (this.layout.screenwidth == 'small') {
            return 'slds-size--1-of-1';
        } else if (this.layout.screenwidth == 'medium') {
            return 'slds-size--1-of-2';
        } else {
            return 'slds-size--1-of-3';
        }
    }

    public clearField() {
        this.selectedItem = undefined;
        this.parentId = undefined;
        this.kpiTargets = [];
    }

    /**
     * opens a model search modal
     */
    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = 'Users'
            selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.selectedItem = {
                            id: items[0].id,
                            summary_text: items[0].summary_text,
                            module: 'Users',
                            data: items[0]
                        };
                        this.parentId = this.selectedItem.id;
                        this.loadKPIs();
                    }
                });
        });
    }
}