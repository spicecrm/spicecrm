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
     * parentId the KPITarget is related to
     */
    public parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    public parentType: string = 'Users';

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
    }

    get isAdmin(){
        return this.session.authData.admin;
    }

    public clearField() {
        this.selectedItem = undefined;
        this.parentId = undefined;
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
                    }
                });
        });
    }
}