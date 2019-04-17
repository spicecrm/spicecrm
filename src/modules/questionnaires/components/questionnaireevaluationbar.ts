/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {metadata} from "../../../services/metadata.service";

declare var Highcharts: any;

@Component({
    selector: 'questionnaire-evaluation-bar',
    templateUrl: './src/modules/questionnaires/templates/questionnaireevaluationbar.html',
})
export class QuestionnaireEvaluationBar implements AfterViewInit {

    values: Array<any>;
    valuesForChart: Array<any> = [];
    chartid: string = '';
    usagePrint = false;
    _individualHeight: number;
    defaultHeight = 70;
    chart: any;

    @Input() set individualHeight(val) {
        let dummy: number;
        if ( this.usagePrint && !isNaN( val ) && ( dummy = Number(val) ) !== 0 && this.chart && this._individualHeight !== dummy ) {
            this._individualHeight = dummy;
            this.chart.update( { chart: { height: val + '%' } } );
            this.chart.reflow();
        }
    }

    get height() {
        if ( this._individualHeight ) return this._individualHeight;
        else return this.defaultHeight;
    }

    constructor( private language: language , private modelutilities: modelutilities, private metadata: metadata) {
        this.chartid = this.modelutilities.generateGuid();
    }

    get divid(){
        return 'questionnaire-eval-chart' + this.chartid;
    }

    ngOnInit() {

        for ( let i=0; i < this.values.length; i++ )
            this.valuesForChart[i] = [ this.values[i].name, this.values[i].points ];

    }

    get chartDivStyles() {
        if ( this.usagePrint ) {
            return { 'max-width': '650px', margin: 'auto' };
        } else return null;
    }

    ngAfterViewInit() {

        this.metadata.loadLibs('highcharts').subscribe(
            (next) => {
                this.chart = Highcharts.chart(this.divid, {
                    credits: false,
                    chart: {
                        type: 'bar',
                        height: ( this.usagePrint ? this.height+'%':null )
                    },
                    title: null,
                    xAxis: {
                        type: 'category',
                        labels: {
                            style: {
                                fontSize: this.usagePrint ? '13px':'12px',
                                fontFamily: 'Titillium Web, Verdana, sans-serif',
                                whiteSpace: 'normal'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: this.language.getLabel('LBL_POINTS'),
                            style: {
                                fontSize: this.usagePrint ? '13px':'12px',
                                fontFamily: 'Titillium Web, Verdana, sans-serif'
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
                            fontSize: this.usagePrint ? '13px':'12px',
                            fontFamily: 'Titillium Web, Verdana, sans-serif',
                            whiteSpace: 'normal'
                        }
                    }
                });
            }
        );

    }

}