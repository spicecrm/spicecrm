/**
 * @module ObjectComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {modellist} from "../../services/modellist.service";
import {Subscription} from "rxjs";
import {GoogleChartTypeOneDimensional} from "../../systemcomponents/interfaces/systemcomponents.interfaces";

/**
 * a component that displays a chart based on one set of aggregates returned from the Elastic Search
 */
@Component({
    selector: 'object-listview-aggregate-chart',
    templateUrl: '../templates/objectlistviewaggregatechart.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ObjectListViewAggregateChart implements OnInit, OnDestroy{
    /**
     * the aggregate
     */
    @Input() public aggregate: any;

    /**
     * google chart types
     */
    public chartType: GoogleChartTypeOneDimensional[] = ['Area', 'SteppedArea', 'Bar', 'Column', 'Line', 'Pie', 'Donut'];

    /**
     * the selected chart type, default = 'Pie'
     */
    public selectedChartType : GoogleChartTypeOneDimensional = this.chartType[5];

    /**
     * buckets in which the aggregate info arrives
     */
    public buckets: any[] = [];

    /**
     * subsription to data changes in buckets.
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(public modellist: modellist, public cdref: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.buildBuckets();
        this.subscriptions.add(
            this.modellist.listDataChanged$.subscribe(data => {
                this.buildBuckets();
            })
        );
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
                label: i.displayName,
                value: i.doc_count
            }));
            this.cdref.detectChanges();
        }
    }

}