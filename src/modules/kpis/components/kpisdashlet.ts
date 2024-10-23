/**
 * @module ModuleKPIs
 */

import {Component, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";

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
    ) {
    }

    ngOnInit() {
        this.parentId = this.metadata.session.authData.user.id;
        this.model._module = 'KPIs';
        this.loadKPIs();
    }

    /**
     * the size class
     */
    get sizeClass() {
        return 'slds-size--1-of-' + this.kpis.length;
    }

    /**
     *
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

}