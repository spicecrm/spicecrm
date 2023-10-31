import {
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from "../../services/language.service";
import {
    GoogleChartSelectedObject,
    GoogleChartDataI,
    GoogleChartOptionLegendI,
    GoogleChartOptionsI,
    GoogleChartTypeOneDimensional
} from "../interfaces/systemcomponents.interfaces";
import {SystemChartService} from "../services/systemchart.service";
import {Subscription} from "rxjs";
import {SystemChartDataRow} from "./systemchartdatarow";

@Component({
    selector: 'system-chart-one-dimensional',
    templateUrl: '../templates/systemchartonedimensional.html',
    providers: [SystemChartService]
})
export class SystemChartOneDimensional implements OnDestroy, GoogleChartOptionsI {
    /**
     * save if the chart series has data or not
     */
    public hasData = true;
    /**
     * chart container reference
     */
    @ViewChild('chartContainer', {read: ViewContainerRef}) public chartContainer: ViewContainerRef;
    /**
     * values components
     */
    @ContentChildren(SystemChartDataRow) public rowChildren: QueryList<SystemChartDataRow>;
    /**
     * google chart type
     */
    @Input() public chartType: GoogleChartTypeOneDimensional;
    /**
     * google chart legend
     */
    @Input() public legend: GoogleChartOptionLegendI;
    /**
     * google chart colors
     */
    @Input() public colors: string[];
    /**
     * google chart font size
     */
    @Input() public fontSize: number;
    /**
     * google chart is 3D boolean
     */
    @Input() public is3D: boolean = false;
    /**
     * emit the index value of the selected SystemChartOneDimensionalValue row
     */
    @Output() public onValueClick = new EventEmitter<GoogleChartSelectedObject>();
    /**
     * holds the rows retrieved from the content children
     */
    public data: GoogleChartDataI;
    /**
     * holds the rxjs subscriptions
     */
    public subscriptions = new Subscription();

    constructor(public chartService: SystemChartService, public language: language) {
    }

    /**
     * config object to be passed to the service
     */
    get options(): GoogleChartOptionsI {
        return {
            legend: this.legend,
            colors: this.colors,
            fontSize: this.fontSize,
            is3D: this.is3D,
        };
    }

    /**
     * load the Google chart library
     */
    public ngAfterViewInit() {
        this.loadChart();
    }

    /**
     * load rows from content children
     */
    public ngAfterContentInit() {
        this.loadDataFromContentChildren();
    }

    /**
     * unsubscribe from rxjs subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * load rows and columns from content children
     */
    public loadDataFromContentChildren() {

        if (this.rowChildren.length == 0) {
            return this.hasData = false;
        }

        this.data = {
            rows: [],
            cols: [{id: 'label', label: 'label', type: 'string'}, {id: 'value', label: 'value', type: 'number'}]
        };

        if (this.colors && this.chartType == 'Bar') {
            this.data.cols.push({id: 'style', type: 'string', role: 'style'});
        }

        let colorIndex = 0;

        this.rowChildren.forEach(i => {
            const entry = {
                c: [{v: this.language.getLabel(i.label)}, {v: Number(i.value)},]
            };

            if (this.colors && this.chartType == 'Bar') {
                entry.c.push({v: `color: ${this.colors[colorIndex]}`});
                colorIndex = colorIndex > this.colors.length ? 0 : colorIndex + 1;
            }

            this.data.rows.push(entry);
        });
    }

    /**
     * load chart by the service
     * @private
     */
    private loadChart() {

        this.chartService.loadChart(this.chartContainer.element.nativeElement, this.chartType, this.options, this.data);

        this.subscriptions.add(this.chartService.onValueClick$.subscribe({
            next: res => this.chartService.zone.run(() =>
                this.onValueClick.emit(res)
            )
        }));
    }
}