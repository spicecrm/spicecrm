/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {metadata} from "../../services/metadata.service";
import {ChartJSTypeOneDimensional} from "../../systemcomponents/interfaces/systemcomponents.interfaces";

declare var _: any;

/**
 * a component that displays one set of aggregates returned from the Elastic Search
 */
@Component({
    selector: 'object-listview-aggregate',
    templateUrl: '../templates/objectlistviewaggregate.html'
})
export class ObjectListViewAggregate {
    /**
     * a unique id
     */
    public aggregateID: string = _.uniqueId();


    /**
     * google chart types
     */
    public chartTypes: ChartJSTypeOneDimensional[] = ['Bar', 'Column', 'Pie', 'Doughnut', 'Line'];

    /**
     * toggles visibility for metrics
     */
    public showMetrics: boolean = false;

    /**
     * toggles visibility for metrics
     */
    public showChartTypes: boolean = false;

    /**
     * an input for teh aggregate itself
     */
    @Input() public aggregate: any = {};

    /**
     * list the number of items that are displayed by  default
     */
    public aggregateDefaultItems = 5;


    constructor(public language: language, public modellist: modellist, public model: model, public metadata: metadata) {
    }

    /**
     * getter for indicator that all shoudl be shopwn
     */
    get showall(){
        return this.aggregate.showall ?? false;
    }

    /**
     * setter for indicator that all shoudl be shopwn
     */
    set showall(v){
        this.aggregate.showall = v;
        this.modellist.setModuleAggregatePreferences();
    }

    /**
     * get the metric to be displayed
     */
    get metric(){
        return this.aggregate.metric ?? 'doc_count';
    }

    /**
     * set the metric to be displayed
     */
    set metric(m){
        this.aggregate.metric = m;
        this.modellist.setModuleAggregatePreferences();
    }

    /**
     * getter for the charttype
     */
    get chartType(): ChartJSTypeOneDimensional{
        return this.aggregate.chartType ?? this.chartTypes[0];
    }

    /**
     * setter for the charttype
     *
     * @param chartType
     */
    set chartType(chartType:ChartJSTypeOneDimensional){
        this.aggregate.chartType = chartType;
        this.modellist.setModuleAggregatePreferences();
    }

    /**
     * getter that toggles visibility for chart
     */
    get showChart(): boolean{
        return this.aggregate.showChart ?? false;
    }

    /**
     * setter toggles visibility for chart
     */
    set showChart(v: boolean){
        this.aggregate.showChart = v;
        this.modellist.setModuleAggregatePreferences();
    }

    /**
     * returns the items for teh display of the source of teh aggregate
     *
     * This is
     *  - the module if different ot the model
     *  - the fieldname
     */
    get aggregateNameItems(): string[] {
        let nameItems = [];
        if (this.aggregate.fielddetails) {
            if (this.model.module != this.aggregate.fielddetails.module) {
                nameItems.push(this.language.getModuleName(this.aggregate.fielddetails.module, true));
            }

            nameItems.push(this.language.getFieldDisplayName(this.aggregate.fielddetails.module, this.aggregate.fielddetails.field));
        }
        return nameItems;
    }

    /**
     * gets the name of the aggregate
     */
    get aggregatename() {
        return this.aggregate.indexfieldname?.replace(/>/g, '');
    }

    /**
     * a getter to see if the current module has aggergate metrics
     */
    get hasMetrics(){
        return this.metadata.getModuleAggregateMetrics(this.modellist.module).length > 0;
    }

    public getMetrics(){
        return this.metadata.getModuleAggregateMetrics(this.modellist.module);
    }

    /**
     * returns the aggregate bucket count
     */
    get aggregateBucketCount() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].buckets.length;
        } else {
            return 0;
        }
    }

    /**
     * returns the buckets from the modellist service
     */
    get aggregateBuckets() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            // show all or the first five plus all selected
            return this.modellist.searchAggregates?.[this.aggregatename].buckets.filter((a, i) => this.showall || i < this.aggregateDefaultItems || this.modellist.checkAggregate(this.aggregatename, a.aggdata));
        } else {
            return [];
        }
    }

    /**
     * returns the count of the documents not considered in teh aggregate
     */
    get otherDocCount() {
        if (this.aggregatename && this.modellist.searchAggregates?.[this.aggregatename]) {
            return this.modellist.searchAggregates?.[this.aggregatename].sum_other_doc_count;
        } else {
            return 0;
        }
    }

    /**
     * returns the number of the checked aggregates
     */
    get checkdCount() {
        return this.modellist.getCheckedAggregateCount(this.aggregatename);
    }

    /**
     * returns if the aggregate is collapsed
     */
    get collapsed() {
        return !!this.aggregate.collapsed;
    }

    /**
     * toggles the collapsed status
     */
    public toggleCollapsed() {
        this.aggregate.collapsed = !this.aggregate.collapsed;
        if(this.collapsed){
            this.showChartTypes = false;
            this.showMetrics = false;
        }
        this.modellist.setModuleAggregatePreferences();
    }

    /**
     * toggles the chart when container is not collapsed
     */
    public toggleChart() {
        if(!this.collapsed){
            // if we show the charttypes first hide that panel
            if(this.showChartTypes) {
                this.showChartTypes = false;
            } else {
                this.showChart = !this.showChart;
            }
        } else {
            this.showChart = false;
        }
    }

    /**
     * toggles the metriocs when container is not collapsed
     */
    public toggleMetrics() {
        if(!this.collapsed){
            this.showMetrics = !this.showMetrics;
        } else {
            this.showMetrics = false;
        }

        // close chart types
        if(this.showMetrics) this.showChartTypes = false;
    }

    /**
     * toggles the charttypes when container is not collapsed
     */
    public toggleChartTypes(e: MouseEvent) {
        if(!this.showChart) return;

        e.preventDefault();
        e.stopPropagation();

        if(!this.collapsed){
            this.showChartTypes = !this.showChartTypes;
        } else {
            this.showChartTypes = false;
        }

        // close metrocs
        if(this.showChartTypes) this.showMetrics = false;
    }
}
