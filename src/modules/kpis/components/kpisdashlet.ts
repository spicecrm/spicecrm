/**
 * @module ModuleKPIs
 */

import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
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

    constructor(
        public session: session,
        public backend: backend,
        public toast: toast,
        public layout: layout
    ) {
    }

    ngOnInit() {
        this.parentId = this.session.authData.user.id;
        this.loadKPIs();
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
}