import {Component, Injector, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import moment from "moment";

@Component({
    selector: 'kpi-tile',
    templateUrl: '../templates/kpitile.html',
    providers: [model]
})

export class KpiTile implements OnInit {

    /**
     * id of KPI related to KPITarget
     */
    @Input() kpiTarget: any = {};

    /**
     * holds KPITargetValue's data
     */
    public kpiTargetValue: any = {};

    /**
     * holds the tend data
     */
    public kpiTrendData: any = {};

    /**
     * if tile is being loaded
     */
    public loading: boolean = false;

    /**
     * color of the trend
     */
    public kpiColor: any;

    /**
     * deviation in percentage
     */
    public percentage: string = '';

    /**
     * a now moment object
     */
    public now = moment();

    /**
     * added kpi target values
     */
    public addValues: any[] = [];

    constructor(
        public model: model,
        public modal: modal,
        public backend: backend,
        public injector: Injector
    ) {
    }

    ngOnInit() {
        // set the model data
        this.model.module = 'KPITargets';
        this.model.id = this.kpiTarget.id;
        this.model.setData(this.kpiTarget, true);

        // get the add values
        this.getAddValues();

        // load the targetvalues
        this.loadKPITargets()
    }

    get targetAchievement(){
        return this.kpiTargetValue?.kpi_value ?  Math.round(this.kpiTargetValue.kpi_value / parseFloat(this.kpiTarget.target) * 100) : 0
    }

    /**
     * retrieves KPITargets for the User
     */
    public loadKPITargets() {
        this.loading = true;
        this.backend.getRequest(`module/KPITargets/${this.kpiTarget.id}/getvalues`).subscribe({
            next: (data) => {
                this.kpiTargetValue = data.kpiTargetValue;
                this.kpiTrendData = data.kpiTrendData;

                this.addValues.forEach(a => {
                    switch(a.addKey) {
                        case 'kpi_target_achievement':
                            a.kpiValueAdd = this.targetAchievement;
                            break;
                        default:
                            a.kpiValueAdd = data.kpiTargetValue ? data.kpiTargetValue[a.addKey] : 0;
                            break;
                    }
                });

                this.getKPIColor();
                this.loading = false;
            }, error: () => {
                // this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_KPITARGETS'), 'error');
                this.kpiTargetValue = undefined;
                this.loading = false;
            }
        });
    }

    /**
     * gets text color for the KPIValue
     */
    public getKPIColor() {
        if(!this.kpiTargetValue) return;
        let kpiValue = this.kpiTargetValue.kpi_value;
        let kpiTargetDataLow = this.kpiTarget.kpiTarget?.lower_boundary;
        let kpiTargetDataUp = this.kpiTarget.kpiTarget?.upper_boundary;

        if (kpiTargetDataLow && kpiValue <= kpiTargetDataLow) {
            this.kpiColor = "slds-text-color_error";
        } else if (kpiTargetDataUp && kpiValue >= kpiTargetDataUp) {
            this.kpiColor = "slds-text-color_success";
        } else {
            this.kpiColor = 'slds-icon-text-default';
        }
    }

    /**
     * returns the display precision
     */
    get precision(){
        return  this.kpiTarget?.kpi?.display_precision ? parseInt(this.kpiTarget.kpi.display_precision, 10) : 0;
    }

    get slope(){
        return this.kpiTrendData?.trend?.slope ?? 0;
    }

    get slopeIcon (){
        if(this.slope > 0) return 'arrowup';
        if(this.slope < 0) return 'arrowdown';
        return 'sort'
    }

    get slopeColor(){
        if(this.slope > 0) return 'slds-icon-text-success';
        if(this.slope < 0) return 'slds-icon-text-error';
        return 'slds-icon-text-default'
    }

    get textColor(){
        if(this.slope > 0) return 'slds-text-color_success';
        if(this.slope < 0) return 'slds-text-color_error';
        return 'slds-text-color_default'
    }

    get trendValue(){
        return this.kpiTrendData.percentage;
    }

    public openHistoryModal(){
        this.modal.openModal('KPIHistoryModal', true, this.injector)
    }

    /**
     * check if the current item is the last one
     */
    public isLast(index: number): boolean {
        return index === this.addValues.length - 1;
    }

    /**
     * creates an array with values from KPITargetValue
     */
    public getAddValues() {

        this.addValues = [];

        // check if we have a target
        if(this.kpiTarget.target){
            this.addValues.push({
                addKey: 'kpi_target_achievement',
                kpiValueAdd: undefined,
                valueLabel: 'LBL_KPI_TARGET_ACHIEVEMENT',
                valueMetric: '%'
            });
        }

        // iterate over the range of possible kpi_value_label_? (from 1 to 5)
        for (let i = 1; i <= 5; i++) {
            const labelKey = `kpi_value_label_${i}`;
            const addKey = `kpi_value_add_${i}`;
            const metricKey = `kpi_value_metric_${i}`;
            const precisionKey = `kpi_value_precision_${i}`;

            // check if the kpi_value_label_? exists in kpiTarget.kpi
            if (this.kpiTarget.kpi?.[labelKey]) {
                this.addValues.push({
                    addKey: addKey,
                    kpiValueAdd: this.kpiTargetValue[addKey],
                    valueLabel: this.kpiTarget.kpi[labelKey],
                    valueMetric: this.kpiTarget.kpi[metricKey],
                    valuePrecision: this.kpiTarget.kpi[precisionKey] ?? 0,
                });
            }
        }
    }

    public addValueClasses(index){
        let classes = 'slds-size--1-of-' +this.addValues.length;

        if(index > 0) classes += ' slds-border--left'

        return classes;
    }

}