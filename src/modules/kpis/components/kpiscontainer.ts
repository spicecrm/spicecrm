/**
 * @module ModuleKPIs
 */

import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";
import {layout} from "../../../services/layout.service";

@Component({
    selector: 'kpis-container',
    templateUrl: '../templates/kpiscontainer.html'
})

export class KPIsContainer implements OnChanges {

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
    @Input() public parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    @Input() public parentType: string = 'Users';

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout,
        public modal: modal
    ) {
    }

    ngOnChanges() {
        this.loadKPIs();
    }

    /**
     * load KPIs for logged-in User
     * @private
     */
    public loadKPIs() {
        this.kpiTargets = [];
        if(this.parentId && this.parentType) {
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
}