import {
    AfterContentInit, AfterViewInit,
    Component,
    ContentChildren,
    Input,
    QueryList,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from "../../services/language.service";
import {
    GoogleChartDataI,
    GoogleChartOptionsI,
} from "../interfaces/systemcomponents.interfaces";
import {SystemChartService} from "../services/systemchart.service";
import {SystemChartDataRow} from "./systemchartdatarow";

@Component({
    selector: 'system-chart-gauge',
    templateUrl: '../templates/systemchartgauge.html',
    providers: [SystemChartService]
})
export class SystemChartGauge implements AfterViewInit, AfterContentInit {
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
    @ContentChildren(SystemChartDataRow, {emitDistinctChangesOnly: true}) public rowChildren: QueryList<SystemChartDataRow>;
    /**
     * an optional padding parameter
     */
    @Input() public padding: 'none'|'small'|'medium'|'x-small'|'xx-small' = 'small';

    /**
     * inputs for the chart Options
     */
    // the max value of the chart
    @Input() public max: number;
    // the min value of the chart
    @Input() public min: number;
    // the number of minor ticks in between
    @Input() public minorTicks: number;
    // the range that is highlighted green
    @Input() public green: {from:number, to:number, color?: string};
    // the range that is highlighted yellow
    @Input() public yellow: {from:number, to:number, color?: string};
    // the range that is highlighted red
    @Input() public red: {from:number, to:number, color?: string};

    /**
     * holds the rows retrieved from the content children
     */
    public data: GoogleChartDataI;


    constructor(public chartService: SystemChartService, public language: language) {
    }

    /**
     * input param for padding
     */
    get paddingClass(){
        return 'slds-p-around--' + this.padding;
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
        this.rowChildren.changes.subscribe(changes => {
            this.setData();
        })
    }

    /**
     * load rows and columns from content children
     */
    public loadDataFromContentChildren() {

        if(!this.rowChildren) return;

        if (this.rowChildren.length == 0) {
            return this.hasData = false;
        }

        this.data = {
            rows: [],
            cols: [{id: 'label', label: 'label', type: 'string'}, {id: 'value', label: 'value', type: 'number'}]
        };

        this.rowChildren.forEach(i => {
            const entry = {
                c: [{v: this.language.getLabel(i.label)}, {v: Number(i.value)},]
            };

            this.data.rows.push(entry);
        });
    }

    /**
     * build the options from teh input
     */
    get options(): GoogleChartOptionsI{
        var options:(GoogleChartOptionsI) = {}

        if(this.max) options.max = this.max;
        if(this.min) options.min = this.min;
        if(this.minorTicks) options.minorTicks = this.minorTicks;
        if(this.green) {
            options.greenFrom = this.green.from;
            options.greenTo = this.green.to;
            if(this.green.color) options.greenColor = this.green.color;
        }
        if(this.yellow) {
            options.yellowFrom = this.yellow.from;
            options.yellowTo = this.yellow.to;
            if(this.yellow.color) options.yellowColor = this.yellow.color;
        }
        if(this.red) {
            options.redFrom = this.red.from;
            options.redTo = this.red.to;
            if(this.red.color) options.redColor = this.red.color;
        }
        return options
    }

    /**
     * load chart by the service
     * @private
     */
    private loadChart() {
        this.chartService.loadChart(this.chartContainer.element.nativeElement, 'Gauge', this.options, this.data);
    }

    /**
     * reset the data
     */
    public setData(){
        this.loadDataFromContentChildren();
        this.chartService.setData(this.data);
    }
}