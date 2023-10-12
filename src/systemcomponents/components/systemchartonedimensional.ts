import {
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    NgZone,
    Output,
    QueryList,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {libloader} from "../../services/libloader.service";
import {language} from "../../services/language.service";
import {GoogleChartTypeOneDimensional} from "../interfaces/systemcomponents.interfaces";
import {SystemChartOneDimensionalValue} from "./systemchartonedimensionalvalue";

declare var google;

@Component({
    selector: 'system-chart-one-dimensional',
    templateUrl: '../templates/systemchartonedimensional.html'
})
export class SystemChartOneDimensional {
    /**
     * save if the chart series has data or not
     */
    public hasData = true;
    /**
     * google wrapper chart instance
     */
    public wrapper: { draw: (config: any) => void; };
    /**
     * save the high chart instance
     */
    public chart: any = {};
    /**
     * chart container reference
     * @private
     */
    @ViewChild('chartContainer', {read: ViewContainerRef}) private chartContainer: ViewContainerRef;
    /**
     * values components
     * @private
     */
    @ContentChildren(SystemChartOneDimensionalValue) private values: QueryList<SystemChartOneDimensionalValue>;
    /**
     * google chart type
     * @private
     */
    @Input() private chartType: GoogleChartTypeOneDimensional;
    /**
     * google chart legend
     * @private
     */
    @Input() private legend: {position: 'right' | 'left' | 'top' | 'bottom' | 'none', alignment?: 'start' | 'center' | 'end'} = {position: 'none'};
    /**
     * google chart colors
     * @private
     */
    @Input() private colors: string[] = ["#862C7E", "#99C21C", "#EA9150", "#81789E", "#353535"];
    /**
     * google chart font size
     * @private
     */
    @Input() private fontSize: number = 11;
    /**
     * google chart is 3D boolean
     * @private
     */
    @Input() private is3D: boolean = false;
    /**
     * emit the index value of the selected SystemChartOneDimensionalValue row
     * @private
     */
    @Output() private onValueClick = new EventEmitter<number>();
    /**
     * holds the rows retrieved from the content children
     * @private
     */
    private rows: { c: { v: string | number }[] }[] = [];


    constructor(private libLoader: libloader,
                private zone: NgZone,
                private language: language) {
    }

    /**
     * load the Google chart library
     */
    public ngAfterViewInit() {
        this.loadChart();
    }

    public ngAfterContentInit() {
        this.loadRowsFromContentChildren();
    }

    /**
     * load the Google chart library
     */
    public loadChart() {

        this.libLoader.loadLib('googlecharts').subscribe(
            () => {
                this.zone.runOutsideAngular(() => {
                    google.charts.load('current', {packages: ['corechart']});
                    google.charts.setOnLoadCallback(() => this.renderChart());

                });
            });
    }

    /**
     * load the rows values from the content children
     * @private
     */
    private loadRowsFromContentChildren() {
        this.values.forEach(i => this.rows.push({
            c: [
                {v: this.language.getLabel(i.label)},
                {v: Number(i.value)}
            ]
        }));
    }

    /**
     * render chart from data
     * @private
     */
    private renderChart() {

        if (!this.chartContainer) return;

        if (this.rows.length == 0) {
            return this.hasData = false;
        }

        this.hasData = true;

        const data = this.generateWrapperConfig();

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
            getSelection: () => { row: number; }[];
        }) => {
            if (e.getSelection().length == 0) return;
            this.onValueClick.emit(e.getSelection()[0].row);
        });
    }

    /**
     * call draw on the wrapper to redraw the chart
     * @private
     */
    private drawChart() {
        this.wrapper.draw(this.chartContainer.element.nativeElement);
    }

    /**
     * generate google wrapper config
     * @private
     */
    private generateWrapperConfig() {
        return {
            chartType: this.chartType + 'Chart',
            dataTable: {
                cols: [
                    {
                        id: 'label',
                        label: 'label',
                        type: 'string',
                    },
                    {
                        id: 'value',
                        label: 'value',
                        type: 'number'
                    }
                ],
                rows: this.rows
            },
            options: {
                legend: this.legend,
                fontSize: this.fontSize,
                colors: this.colors,
                is3D: this.is3D
            },
        };
    }
}