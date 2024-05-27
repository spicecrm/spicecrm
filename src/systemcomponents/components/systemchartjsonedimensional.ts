import {
    AfterContentChecked,
    Component,
    ContentChildren,
    EventEmitter,
    Input, OnChanges,
    OnDestroy,
    Output,
    QueryList, SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from "../../services/language.service";
import {
    ChartJSTypeOneDimensional,
    GoogleChartSelectedObject
} from "../interfaces/systemcomponents.interfaces";
import {Subscription} from "rxjs";
import {SystemChartDataRow} from "./systemchartdatarow";
import {Chart, ChartData, ChartType} from "chart.js/auto";
import {SystemChartJSService} from "../services/systemchartjs.service";

@Component({
    selector: 'system-chart-js-one-dimensional',
    templateUrl: '../templates/systemchartjsonedimensional.html',
    providers: [SystemChartJSService]
})
export class SystemChartJSOneDimensional implements OnChanges, OnDestroy {
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
     * google chart type
     */
    @Input() public chartType: ChartJSTypeOneDimensional;
    /**
     * google chart colors
     */
    @Input() public colors: string[];

    /**
     * a state for the data so we can trigger a reload
     */
    @Input() public dataState: string = '';
    /**
     * an optional padding parameter
     */
    @Input() public padding: 'none'|'small'|'medium' = 'small';

    /**
     * holds the rows retrieved from the content children
     */
    public data: ChartData;
    /**
     * holds the rxjs subscriptions
     */
    public subscriptions = new Subscription();

    constructor(public chartService: SystemChartJSService, public language: language) {
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

    public ngOnChanges(changes: SimpleChanges) {
        if(changes.chartType && !changes.chartType.firstChange){
            this.loadDataFromContentChildren();
            this.setChartType(changes.chartType.currentValue);
        }
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

        if(!this.rowChildren) return;

        if (this.rowChildren.length == 0) {
            return this.hasData = false;
        }

        this.data = {
           labels: [],
           datasets: [{
               data: []
           }]
        };

        this.rowChildren.forEach(i => {
            this.data.labels.push(this.language.getLabel(i.label));
            this.data.datasets[0].data.push(Number(i.value));
        });
    }

    /**
     * load chart by the service
     * @private
     */
    private loadChart() {
        this.chartService.loadChart(this.chartContainer.element.nativeElement, this.chartType, this.data);
    }

    /**
     * reset the data
     */
    public setData(){
        this.loadDataFromContentChildren();
        this.chartService.setData(this.data);
    }

    public setChartType(chartType?){
        this.loadDataFromContentChildren();
        this.chartService.setChartType(chartType ?? this.chartType);
    }
}