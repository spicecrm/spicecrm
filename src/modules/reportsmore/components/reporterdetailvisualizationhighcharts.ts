/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
