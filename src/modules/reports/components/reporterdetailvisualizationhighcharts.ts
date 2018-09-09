import {
    Component, Input, AfterViewInit, OnInit,
    OnDestroy, ElementRef
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {modelutilities} from "../../../services/modelutilities.service";

declare var Highcharts: any;

@Component({
    selector: 'reporter-detail-visualization-highcharts',
    templateUrl: './app/modules/reports/templates/reporterdetailvisualizationhighcharts.html',
    providers: [model]
})
export class ReporterDetailVisualizationHighcharts implements AfterViewInit, OnInit, OnDestroy {

    vizdata: any = {};
    chart: any = {};
    chart_element_id:string;

    constructor(
        private metadata: metadata,
        private broadcast: broadcast,
        private model: model,
        private backend: backend,
        private activatedRoute: ActivatedRoute,
        private navigation: navigation,
        private elementRef: ElementRef,
        private utils: modelutilities,
    ) {
        // don't use the vizdata.uid in case the same report is rendered multiple times...
        this.chart_element_id = 'high-charts-'+this.utils.generateGuid();
    }

    handleMessage(message: any) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

        if (!this.vizdata.data.chart.height)
            this.vizdata.data.chart.height = this.elementRef.nativeElement.height;

        //this.chart = new Highcharts.Chart(this.vizdata.data);
        this.metadata.loadLibs('highcharts').subscribe(
            (next) => {
                if (Highcharts.chart) {
                    this.chart = Highcharts.chart(this.chart_element_id, this.vizdata.data);
                }
            });
    }

    ngOnDestroy() {

    }

    getVizStyle() {
        return this.vizdata['layout'];
    }

}