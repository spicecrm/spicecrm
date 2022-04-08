/**
 * @module ModuleReportsMore
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {libloader} from '../../../services/libloader.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {modelutilities} from "../../../services/modelutilities.service";

/** @ignore */
declare var Highcharts: any;
/** @ignore */
declare var _: any;

/**
 * handel displaying a high chart with the report data
 */
@Component({
    selector: 'reporter-detail-visualization-highcharts',
    templateUrl: '../templates/reporterdetailvisualizationhighcharts.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualizationHighcharts implements AfterViewInit {
    /**
     * save the visualization data
     */
    public vizdata: any = {};
    /**
     * save the high chart instance
     */
    public chart: any = {};
    /**
     * save if the chart series has data or not
     */
    public noData = false;
    /**
     * save the chart element id
     */
    public chart_element_id: string;

    constructor(
        public metadata: metadata,
        public broadcast: broadcast,
        public model: model,
        public language: language,
        public backend: backend,
        public activatedRoute: ActivatedRoute,
        public navigation: navigation,
        public elementRef: ElementRef,
        public utils: modelutilities,
        public libloader: libloader,
        public zone: NgZone,
        public cdRef: ChangeDetectorRef
    ) {
        // don't use the vizdata.uid in case the same report is rendered multiple times...
        this.chart_element_id = 'high-charts-' + this.utils.generateGuid();
    }

    /**
     * call load high chart
     */
    public ngAfterViewInit() {
        this.loadHighChart();
    }

    /**
     * load the high chart library and pass the report data to it
     */
    public loadHighChart() {

        if (!this.vizdata.data.chart.height) {
            this.vizdata.data.chart.height = this.elementRef.nativeElement.height;
        }

        this.libloader.loadLib('highcharts').subscribe(
            (next) => {
                if (Highcharts.chart) {

                    let hasData = false;
                    for (let series of this.vizdata.data.series) {
                        // translate the name as this might be a label
                        series.name = this.language.getLabel(series.name);

                        if (series.data) {
                            hasData = true;
                        }
                    }
                    if (hasData) {
                        this.zone.runOutsideAngular(() => {
                            this.chart = Highcharts.chart(this.chart_element_id, this.vizdata.data);
                        });
                    } else {
                        this.noData = true;
                        this.cdRef.detectChanges();
                    }
                }
            });
    }
}
