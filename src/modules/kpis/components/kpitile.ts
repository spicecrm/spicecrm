import {Component, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'kpi-tile',
    templateUrl: '../templates/kpitile.html'
})

export class KpiTile implements OnInit {

    /**
     * id of KPI related to KPITarget
     */
    @Input() kpi: any = {};

    /**
     * parentId the KPITarget is related to
     */
    @Input() parentId: string = '';

    /**
     * parentType the KPITarget is related to
     * i.e. Users, CompanyCodes etc.
     */
    @Input() parentType: string = '';

    /**
     * holds KPITarget's data
     */
    public kpiTarget: any = [];

    /**
     * holds KPITargetValue's data
     */
    public kpiTargetValue: any = [];

    /**
     * if tile is being loaded
     */
    public loading: boolean = false;

    /**
     * color of the trend
     */
    public kpiColor: any;

    /**
     * color of the trend
     */
    public arrowIcon: 'arrowup' | 'arrowdown' | 'sort';

    /**
     * color of the trend
     */
    public iconColor: 'slds-icon-text-success' | 'slds-icon-text-error' | 'slds-icon-text-default';

    constructor(
        public model: model,
        private backend: backend,
        private toast: toast,
        private language: language
    ) {
    }

    ngOnInit() {
        this.loadKPITargets()
    }

    /**
     * retrieves KPITargets for the User
     */
    public loadKPITargets() {
        this.loading = true;
        this.backend.getRequest('module/KPIs/' + this.kpi.id + '/' + this.parentType + '/' + this.parentId).subscribe({
            next: (data) => {
                this.kpiTarget = data.kpiTarget;
                this.kpiTargetValue = data.kpiTargetValue;
                this.getKPIColor();

                this.loading = false;
            }, error: () => {
                this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_KPITARGETS'), 'error');
                this.loading = false;
            }
        });
    }

    /**
     * calculates the current metric value
     */
    public getKPIColor() {
        let kpiValue = this.kpiTargetValue.kpi_value;

        if (this.kpiTarget.lower_boundary && kpiValue <= this.kpiTarget.lower_boundary) {
            this.iconColor = 'slds-icon-text-error';
            this.kpiColor = "slds-text-color_error";
        } else if (this.kpiTarget.upper_boundary && kpiValue >= this.kpiTarget.upper_boundary) {
            this.iconColor = 'slds-icon-text-success';
            this.kpiColor = "slds-text-color_success";
        } else {
            this.iconColor = 'slds-icon-text-default';
        }
    }

    public getTrend() {
/*            this.iconColor = 'slds-icon-text-error';
            this.arrowIcon = "arrowdown";
            this.kpiColor = "slds-text-color_error";

            this.iconColor = 'slds-icon-text-success';
            this.arrowIcon = "arrowup";
            this.kpiColor = "slds-text-color_success";
            this.iconColor = 'slds-icon-text-default';*/
    }
}