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
 * @module ModuleQuestionnaires
 */
import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {metadata} from "../../../services/metadata.service";

declare var Highcharts: any;

@Component({
    selector: 'questionnaire-evaluation-spiderweb',
    templateUrl: './src/modules/questionnaires/templates/questionnaireevaluationspiderweb.html',
})
export class QuestionnaireEvaluationSpiderweb implements AfterViewInit, OnInit {

    @Input() public values: any[];
    private valuesForChart: any[] = [];
    private readonly chartid: string = '';
    @Input() public usagePrint = false;
    private _individualHeight: number;
    private defaultHeight = 70;
    private chart: any;

    constructor( private language: language , private modelutilities: modelutilities, private metadata: metadata) {
        this.chartid = this.modelutilities.generateGuid();
    }

    @Input() public set individualHeight( val: number ) {
        let dummy: number;
        if ( this.usagePrint && !isNaN( val ) && ( dummy = Number(val) ) !== 0 && this.chart && this._individualHeight !== dummy ) {
            this._individualHeight = dummy;
            this.chart.update( { chart: { height: val + '%' } } );
            this.chart.reflow();
        }
    }

    private get height(): number {
        if ( this._individualHeight ) return this._individualHeight;
        else return this.defaultHeight;
    }

    private get divid(): string {
        return 'questionnaire-eval-chart' + this.chartid;
    }

    public ngOnInit(): void {
        for ( let i=0; i < this.values.length; i++ ) this.valuesForChart[i] = [ this.values[i].name, this.values[i].points ];
    }

    private get chartDivStyles(): object {
        if ( this.usagePrint ) {
            return { 'max-width': '650px', 'margin': 'auto' };
        } else return null;
    }

    public ngAfterViewInit(): void {

        this.metadata.loadLibs('highcharts').subscribe(
            () => {

                this.chart = Highcharts.chart(this.divid, {
                    credits: false,
                    chart: {
                        type: 'line',
                        polar: true,
                        height: ( this.usagePrint ? this.height+'%':null )
                    },
                    title: null,
                    xAxis: {
                        type: 'category',
                        labels: {
                            style: {
                                fontSize: this.usagePrint ? '12px':'12px',
                                fontFamily: '"Libre Franklin", sans-serif',
                                whiteSpace: 'normal'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: this.language.getLabel('LBL_POINTS'),
                            style: {
                                fontSize: this.usagePrint ? '12px':'12px',
                                fontFamily: '"Libre Franklin", sans-serif'
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    series: [{
                        color: '#002F60',
                        name: 'Population',
                        data: this.valuesForChart
                    }],
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: this.usagePrint ? '12px':'12px',
                            fontFamily: '"Libre Franklin", sans-serif',
                            whiteSpace: 'normal'
                        }
                    }
                });
            }
        );
    }

}
