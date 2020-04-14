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
declare var _;

/**
 * handel displaying a high chart with the report data
 */
@Component({
    selector: 'reporter-detail-visualization-highcharts',
    templateUrl: './src/modules/reportsmore/templates/reporterdetailvisualizationhighcharts.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualizationHighcharts implements AfterViewInit {
    /**
     * save the visualization data
     */
    private vizdata: any = {};
    /**
     * save the high chart instance
     */
    private chart: any = {};
    /**
     * save if the chart series has data or not
     */
    private noData = false;
    /**
     * save the chart element id
     */
    private chart_element_id: string;

    constructor(
        private metadata: metadata,
        private broadcast: broadcast,
        private model: model,
        private language: language,
        private backend: backend,
        private activatedRoute: ActivatedRoute,
        private navigation: navigation,
        private elementRef: ElementRef,
        private utils: modelutilities,
        private libloader: libloader,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
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
    private loadHighChart() {

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
