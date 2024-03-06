/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit, SimpleChanges
} from "@angular/core";
import {modellist} from "../../services/modellist.service";
import {Subscription} from "rxjs";
import {
    ChartJSTypeOneDimensional,
    GoogleChartTypeOneDimensional
} from "../../systemcomponents/interfaces/systemcomponents.interfaces";
import {ChartType} from "chart.js/auto";
import {language} from "../../services/language.service";

/**
 * a component that displays a chart based on one set of aggregates returned from the Elastic Search
 */
@Component({
    selector: 'object-listview-aggregate-chart',
    templateUrl: '../templates/objectlistviewaggregatechart.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ObjectListViewAggregateChart implements OnInit, OnDestroy, OnChanges{
    /**
     * the aggregate
     */
    @Input() public aggregate: any;

    /**
     * the metric to be displayed
     */
    @Input() public metric: string = 'doc_count';

    /**
     * the selected chart type, default = 'Pie'
     */
    @Input() public chartType: ChartJSTypeOneDimensional;

    /**
     * buckets in which the aggregate info arrives
     */
    public buckets: any[] = [];

    /**
     * subsription to data changes in buckets.
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(public modellist: modellist, public language: language, public cdref: ChangeDetectorRef) {
        this.subscriptions.add(
            this.language.currentlanguage$.subscribe(() => {
                this.buildBuckets();
            })
        );
    }

    public ngOnInit() {
        this.buildBuckets();
        this.subscriptions.add(
            this.modellist.listDataChanged$.subscribe(data => {
                this.buildBuckets();
            })
        );
    }

    public ngOnChanges(changes: SimpleChanges) {
        if(changes.metric) this.buildBuckets();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * builds buckets based on modellist data for aggregates
     * @private
     */
    private buildBuckets(){
        if(this.aggregate) {
            this.buckets = this.modellist.searchAggregates?.[this.aggregate.fielddetails.field].buckets.map(i => ({
                label: this.language.getFieldDisplayOptionValue(this.modellist.module, this.aggregate.fieldname, i.displayName),
                value: this.metric == 'doc_count' ? i.doc_count : i[this.metric].value
            }));
            this.cdref.detectChanges();
        }
    }

}