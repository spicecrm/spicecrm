import {Injectable, NgZone} from '@angular/core';
import {libloader} from "../../services/libloader.service";
import {
    GoogleChartSelectedObject,
    GoogleChartDataI,
    GoogleChartOptionsI,
    GoogleChartTypeMultiDimensional,
    GoogleChartTypeOneDimensional, ChartJSTypeOneDimensional
} from "../interfaces/systemcomponents.interfaces";
import {Subject} from "rxjs";
import {Chart, ChartConfiguration, ChartData, ChartOptions, ChartType} from "chart.js/auto";

declare var google;

@Injectable()
export class SystemChartJSService {
    /**
     * emit the index value of the selected SystemChartOneDimensionalValue row
     * @private
     */
    public onValueClick$ = new Subject<{ row: number, column: number }>();

    /**
     * holds the chart container
     * @private
     */
    private options: ChartOptions;
    /**
     * google chart type
     */
    private chartType: ChartType;
    /**
     * holds the chart container
     * @private
     */
    private chartContainer: HTMLCanvasElement;
    /**
     * holds the data retrieved from the content children
     * @private
     */
    private data: ChartData;

    private chart: any;

    constructor(public zone: NgZone) {
        this.options = {
            aspectRatio: 1,
            plugins: {
                legend: {
                    display: false,
                    position: 'bottom'
                }
            }
        }
    }

    /**
     * load the Google chart library
     */
    public loadChart(chartContainer: HTMLCanvasElement, chartType: ChartJSTypeOneDimensional, data: ChartData) {

        this.chartContainer = chartContainer;
        this.transFormChartType(chartType);
        this.data = data;
        this.renderChart();
    }

    public setData(data: ChartData) {
        if(JSON.stringify(this.data) != JSON.stringify(data)) {
            this.data = data;
            this.chart.data = this.transformChartData(this.chartType, this.data),
            this.chart.update('active');
        }
    }

    private transFormChartType(type: ChartJSTypeOneDimensional){
        switch(type){
            case 'Bar':
                this.chartType = 'bar';
                this.options.indexAxis = 'x';
                this.options.plugins.legend.display = false;
                break;
            case 'Column':
                this.chartType = 'bar';
                this.options.indexAxis = 'y';
                this.options.plugins.legend.display = false;
                break;
            case 'Pie':
                this.chartType = 'pie';
                this.options.plugins.legend.display = true;
                this.options.indexAxis = 'x';
                break;
            case 'Doughnut':
                this.chartType = 'doughnut';
                this.options.plugins.legend.display = true;
                this.options.indexAxis = 'x';
                break;
            case 'Line':
                this.chartType = 'line';
                this.options.plugins.legend.display = false;
                this.options.indexAxis = 'x';
                break;
        }
    }

    private transformChartData(type,data){
        let chartData = JSON.parse(JSON.stringify(data));
        let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary')
        switch(type){
            case 'bar':
            case 'line':
                for(let dataset of chartData.datasets){
                    dataset.backgroundColor = backgroundColor;
                }
                break;
            case 'pie':
            case 'doughnut':
                break;
        }
        return chartData

    }

    public setChartType(type: ChartJSTypeOneDimensional) {
        this.transFormChartType(type);
        this.chart.destroy();
        this.renderChart();
    }

    /**
     * render chart from data
     * @private
     */
    private renderChart() {
        this.chart = new Chart(this.chartContainer, {
            type: this.chartType,
            data: this.transformChartData(this.chartType, this.data),
            options: JSON.parse(JSON.stringify(this.options))
        });
    }
}

