/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit,
    OnDestroy, ElementRef
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {modelutilities} from "../../../services/modelutilities.service";

declare var Highcharts: any;

@Component({
    selector: 'reporter-detail-visualization-highcharts',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualizationhighcharts.html',
})
export class ReporterDetailVisualizationHighcharts implements AfterViewInit {

    private vizdata: any = {};
    private chart: any = {};
    private chart_element_id: string;
    private noData = false;

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
    ) {
        // don't use the vizdata.uid in case the same report is rendered multiple times...
        this.chart_element_id = 'high-charts-'+this.utils.generateGuid();
    }

    public ngAfterViewInit() {

        if (!this.vizdata.data.chart.height) {
            this.vizdata.data.chart.height = this.elementRef.nativeElement.height;
        }

        this.metadata.loadLibs('highcharts').subscribe(
            (next) => {
                if (Highcharts.chart) {

                    let hasData = false;
                    for(let series of this.vizdata.data.series){
                        if(series.data) {
                            hasData = true;
                        }
                    }
                    if(hasData) {
                        this.chart = Highcharts.chart(this.chart_element_id, this.vizdata.data);
                    } else {
                        this.noData = true;
                    }
                }
            });
    }

    get reportName(){
        return this.model.getFieldValue('name');
    }

    private getVizStyle() {
        return this.vizdata.layout;
    }

}
