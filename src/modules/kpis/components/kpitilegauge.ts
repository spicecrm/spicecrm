import {Component, Injector, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import moment from "moment";
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
        super(model, modal, backend, injector)
    }

}