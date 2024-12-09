import {Component, Injector, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {KpiTile} from "./kpitile";

@Component({
    selector: 'kpi-tile-gauge',
    templateUrl: '../templates/kpitilegauge.html',
    providers: [model]
})

export class KpiTileGauge extends KpiTile implements OnInit {

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
     * added kpi target values
     */
    public addValues: any[] = [];

    constructor(
        public model: model,
        public modal: modal,
        public backend: backend,
        public injector: Injector
    ) {
        super(model, modal, backend, injector)
    }

    get maxValue(){
        let max = this.kpiTarget.max_value ?? 0;

        // see if we have a kpi value
        if(this.kpiTargetValue.kpi_value > max) max = this.kpiTargetValue.kpi_value;

        // see if we have an upper boundary
        if(this.kpiTarget.upper_boundary > max) max = this.kpiTarget.upper_boundary;

        return max;
    }

    public valueToPercentage(value){
        return this.kpiTarget.target ? Math.round(value / this.kpiTarget.target * 100) : 0;
    }

    public getRange(color: 'green'|'yellow'|'red'){
        let from = 0;
        let to = 0;

        switch(color){
            case 'red':
                if(this.kpiTarget.lower_boundary != 0){
                    from = this.valueToPercentage(this.kpiTarget.min_value) ?? 0;
                    to = this.valueToPercentage(this.kpiTarget.lower_boundary);
                }
                break;
            case 'yellow':
                if(this.kpiTarget.upper_boundary != 0){
                    from = this.valueToPercentage(this.kpiTarget.lower_boundary) ?? this.valueToPercentage(this.kpiTarget.min_value) ?? 0;
                    to = this.valueToPercentage(this.kpiTarget.upper_boundary);
                }
                break;
            case 'green':
                if(this.kpiTarget.upper_boundary != 0){
                    from = this.valueToPercentage(this.kpiTarget.upper_boundary);
                    to = this.valueToPercentage(this.maxValue) ? this.valueToPercentage(this.maxValue) : undefined;
                }
                break;
        }


        return {from, to};

    }

}