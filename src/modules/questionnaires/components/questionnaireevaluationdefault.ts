/**
 * @module ModuleQuestionnaires
 */
import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {metadata} from "../../../services/metadata.service";

declare var Highcharts: any;

@Component({
    selector: 'questionnaire-evaluation-default',
    templateUrl: './src/modules/questionnaires/templates/questionnaireevaluationdefault.html',
})
export class QuestionnaireEvaluationDefault implements AfterViewInit, OnInit {

    @Input() public values: any[];
    private valuesForChart: any[] = [];
    private readonly chartid: string = '';
    @Input() public evaluationType: string;
    @Input() public usagePrint = false;
    private _individualHeight: number;
    private defaultHeight = 50;
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
                        type: 'column',
                        height: ( this.usagePrint ? this.height+'%':null )
                    },
                    title: null,
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -90,
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
                        name: 'Points',
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
