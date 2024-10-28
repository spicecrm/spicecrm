import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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
    public kpiTargetData: any = [];

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

    /**
     * deviation in percentage
     */
    public percentage: string = '';

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
                this.kpiTargetData = data;
                this.kpiTargetValue = data.kpiTargetValue;
                this.getKPIColor();
                this.getTrend();

                this.loading = false;
            }, error: () => {
                this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_KPITARGETS'), 'error');
                this.loading = false;
            }
        });
    }

    /**
     * gets text color for the KPIValue
     */
    public getKPIColor() {
        let kpiValue = this.kpiTargetValue.kpi_value;
        let kpiTargetDataLow = this.kpiTargetData.kpiTarget?.lower_boundary;
        let kpiTargetDataUp = this.kpiTargetData.kpiTarget?.upper_boundary;

        if (kpiTargetDataLow && kpiValue <= kpiTargetDataLow) {
            this.kpiColor = "slds-text-color_error";
        } else if (kpiTargetDataUp && kpiValue >= kpiTargetDataUp) {
            this.kpiColor = "slds-text-color_success";
        } else {
            this.kpiColor = 'slds-icon-text-default';
        }
    }

    /**
     *
     */
    public getTrend() {
        switch (this.kpiTargetData.trendData.trend) {
            case 'positive':
                this.arrowIcon = "arrowup";
                this.iconColor = 'slds-icon-text-success';
                this.percentage = this.kpiTargetData.trendData.percentage + '% ' + this.language.getLabel('LBL_KPI_BETTER');
                break;
            case 'negative':
                this.arrowIcon = "arrowdown";
                this.iconColor = "slds-icon-text-error";
                this.percentage = this.kpiTargetData.trendData.percentage + '% ' + this.language.getLabel('LBL_KPI_WORSE');
                break;
            default:
                this.arrowIcon = "sort";
                this.iconColor = "slds-icon-text-default";
                this.percentage = this.kpiTargetData.trendData.percentage + '% ' + this.language.getLabel('LBL_KPI_UNCHANGED');
        }
    }
}