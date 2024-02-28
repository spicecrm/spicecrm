import {Injectable, NgZone} from '@angular/core';
import {libloader} from "../../services/libloader.service";
import {
    GoogleChartSelectedObject,
    GoogleChartDataI,
    GoogleChartOptionsI,
    GoogleChartTypeMultiDimensional,
    GoogleChartTypeOneDimensional
} from "../interfaces/systemcomponents.interfaces";
import {Subject} from "rxjs";

declare var google;

@Injectable()
export class SystemChartService {
    /**
     * emit the index value of the selected SystemChartOneDimensionalValue row
     * @private
     */
    public onValueClick$ = new Subject<{ row: number, column: number }>();
    /**
     * google wrapper chart instance
     */
    private wrapper: {
        draw: (config: any) => void;
        setDataTable:(data: any) => void;
        setChartType:(type:string)=> void;
        setOption:(key , value) => void};
    /**
     * holds the chart container
     * @private
     */
    private options: GoogleChartOptionsI;
    /**
     * google chart type
     */
    private chartType: GoogleChartTypeOneDimensional | GoogleChartTypeMultiDimensional;
    /**
     * holds the chart container
     * @private
     */
    private chartContainer: HTMLElement;
    /**
     * holds the data retrieved from the content children
     * @private
     */
    private data: GoogleChartDataI;

    constructor(private libLoader: libloader,
                public zone: NgZone) {
    }

    /**
     * load the Google chart library
     */
    public loadChart(chartContainer: HTMLElement, chartType: GoogleChartTypeOneDimensional | GoogleChartTypeMultiDimensional, options: GoogleChartOptionsI, data: GoogleChartDataI) {

        this.chartContainer = chartContainer;
        this.options = {
            legend: options.legend ?? {position: 'none'},
            colors: options.colors,
            fontSize: options.fontSize ?? 11,
            isStacked: options.isStacked,
            is3D: options.is3D,
            animation: {startup: true, duration: 1000}
        };
        this.chartType = chartType;
        this.data = data;

        this.libLoader.loadLib('googlecharts').subscribe(
            () => {
                this.zone.runOutsideAngular(() => {
                    google.charts.load('current', {packages: ['corechart']});
                    google.charts.setOnLoadCallback(() => this.renderChart());

                });
            });
    }

    public setData(data: GoogleChartDataI){
        this.data = data;
        this.wrapper.setDataTable(data);
        this.drawChart();
    }
    
    public setChartType(type: GoogleChartTypeOneDimensional){
        this.chartType = type;
        if(type == "Donut"){
            this.wrapper.setChartType("PieChart");
            this.wrapper.setOption('pieHole', 0.4);
            this.drawChart();
        } else {
            this.wrapper.setChartType(type + 'Chart');
            this.drawChart();
        }

    } 

    /**
     * render chart from data
     * @private
     */
    private renderChart() {

        const data = {
            chartType: this.chartType + 'Chart',
            dataTable: this.data,
            options: this.options,
        };

        this.wrapper = new google.visualization.ChartWrapper(data);

        this.drawChart();
        this.addValueClickListener();

    }

    /**
     * add select listener on values and emit the selected SystemChartOneDimensionalValue index
     * @private
     */
    private addValueClickListener() {

        google.visualization.events.addListener(this.wrapper, 'select', (e: {
            getSelection: () => GoogleChartSelectedObject[];
        }) => {
            const selection = e.getSelection();
            this.onValueClick$.next(selection.length == 0 ? undefined : selection[0]);
        });
    }

    /**
     * call draw on the wrapper to redraw the chart
     * @private
     */
    private drawChart() {
        this.wrapper.draw(this.chartContainer);
    }
}