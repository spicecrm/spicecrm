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

@Component({
    selector: 'kpis-dashlet',
    templateUrl: '../templates/kpisdashlet.html'
})

export class KPIsDashlet implements OnInit {

    /**
     * holds kpis for logged in User
     */
    public kpis: any[] = [];

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
        public model: model,
        public language: language,
        private metadata: metadata,
        private backend: backend,
        private toast: toast,
        private view: view
    ) {
    }

    ngOnInit() {
        this.parentId = this.metadata.session.authData.user.id;
        this.model._module = 'KPIs';
        this.loadKPIs();
    }

    /**
     * load KPIs for logged-in User
     * @private
     */
    private loadKPIs() {
        this.backend.getRequest('module/KPIs/' + this.parentType + '/' + this.parentId).subscribe({
            next: (data) => {
                this.kpis = [...data];
            }, error: () => {
                this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_KPIS'), 'error');
            }
        })
    }

    /**
     * calcualate amount of tiles displayed
     * depending on screen width
     */
    get getTileWidthClass() {
        if (this.view.layout.screenwidth == 'small') {
            return 'slds-size--1-of-1';
        } else if (this.view.layout.screenwidth == 'medium') {
            return 'slds-size--1-of-2';
        } else {
            return 'slds-size--1-of-3';
        }
    }
}