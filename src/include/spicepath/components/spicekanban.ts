/**
 * @module ModuleSpicePath
 */
import {
    Component,
    Pipe,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnInit,
    Input
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {currency} from '../../../services/currency.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {CdkDragDrop} from "@angular/cdk/drag-drop";

declare var _: any;

/**
 * the kanban board
 */
@Component({
    selector: 'spice-kanban',
    templateUrl: './src/include/spicepath/templates/spicekanban.html',
    providers: [model]
})
export class SpiceKanban implements OnInit, OnDestroy {
    /**
     * reference to the utility bar if one is rendered
     */
    @ViewChild('kanbanUtilityBar', {read: ViewContainerRef, static: false}) private kanbanUtilityBar: ViewContainerRef;

    /**
     * the component config
     */
    private componentconfig: any = {};

    /**
     * subscription to the modellist for type changes
     */
    private modellistsubscribe: any = undefined;

    /**
     * for the requested fields
     */
    private requestedFields: string[] = [];

    /**
     * holds the config data for the beanguides
     */
    private confdata: any;

    /**
     * holds the info on the stages to be displayed
     */
    private stages: any[] = [];
    /**
     * collects all of the fields and their operation type
     */
    private opfields: any[] = [];
    /**
     * hidden statges that are rendered in teh utility bar
     */
    private hiddenstages: any[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    private loadLabel: boolean = false;

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private configuration: configurationService, private metadata: metadata, private userpreferences: userpreferences, private language: language, private currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.modellist.module);
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * load ths stage data and build the buckts we are searching for to build the kanban board
     */
    public ngOnInit() {
        this.confdata = this.configuration.getData('spicebeanguides')[this.modellist.module];
        let stages = this.confdata.stages;

        let tilecomponentconfig = this.metadata.getComponentConfig('SpiceKanbanTile', this.modellist.module);
        let tilecomponentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
        for (let tilecomponentField of tilecomponentFields) {
            this.requestedFields.push(tilecomponentField.field);
        }

        let bucketitems = [];
        for (let stage of stages) {
            // if not in kanban continue
            if (stage.stagedata.not_in_kanban == '1') {
                this.hiddenstages.push(stage);
            } else {
                this.stages.push(stage);
            }

            // push the bucket item
            bucketitems.push({
                bucket: stage.stagedata.secondary_stage ? stage.stagedata.stage + ' ' + stage.stagedata.secondary_stage : stage.stage,
                values: {},
                items: 0
            });

        }

        // builds the operation fields array
        let configs = this.componentconfig.sumfield.split(",");
        for (let config of configs) {
            // catch whitespace
            config = config.trim();
            if (config.includes(":")) {
                this.opfields.push({
                    name: config.substr(0, config.indexOf(':')),
                    function: config.substr(config.indexOf(':') + 1),
                });
            } else {
                this.opfields.push({
                    name: config,
                    function: "sum",
                });
            }

        }


        if (_.isEmpty(this.modellist.buckets)) {

            this.modellist.buckets = {
                bucketfield: this.confdata.statusfield,
                buckettotal: this.opfields, // [{field: 'amount', function: 'sum'}, {field: 'probabilty', function: 'avg'}]
                bucketitems: bucketitems
            };

            this.modellist.getListData();

        }


        // set limit to 10 .. since this is retrieved bper stage
        this.modellist.loadlimit = 25;

        // subscribe to changes of the listtype
        // since this is a behvaiour subject this will also fire the intiial list load
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());
    }

    /**
     * destry any subscriptuon and reset the modellist buckets
     */
    public ngOnDestroy() {
        // unsubscribe
        this.modellistsubscribe.unsubscribe();

        // reset buckets
        this.modellist.buckets = {};

    }


    /**
     * reads draganddrop from the config and returns it
     */
    get draganddropenabled() {
        return this.componentconfig.draganddrop ? true : false;
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * gets the data for a given stage
     *
     * @param stage the stage
     */
    public getStageData(stage): any {
        let stagedata = this.stages.find(thisStage => stage == thisStage.stage);
        return stagedata.stagedata;
    }


    private switchListtype() {
        // let requestedFields = [];
        // this.modellist.loadList(this.requestedFields);
        // this.modellist.getListData(this.requestedFields);
    }


    /**
     * the size class
     */
    get sizeClass() {
        return 'slds-size--1-of-' + this.stages.length;
    }

    /**
     * get the count from the bucket in the modellist
     *
     * @param stagedata
     */

    private getStageCount(stagedata) {
        try {
            let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
            let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);
            return item ? item.total : 0;
        } catch (e) {
            return 0;
        }
    }

    /**
     * get the sum for the stage bucket
     *
     * @param stagedata
     * @param aggregatefield
     */
    private getStageSum(stagedata, aggregatefield) {
        try {
            let aggname = "_bucket_agg_" + aggregatefield.name;
            let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
            let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);
            for(let prop in item.values) {
                let value = item.values[prop];
                if(prop == aggname) {
                    return item.values ? value : 0;
                }
            }
        } catch (e) {
            return 0;
        }
    }

    /**
     * get all items for a stage
     *
     * @param stage
     */
    private getStageItems(stage) {
        let stageData = this.getStageData(stage);
        let items: any[] = [];
        for (let item of this.modellist.listData.list) {
            if (item[stageData.statusfield] && item[stageData.statusfield].indexOf(stage) == 0) {
                items.push(item);
            }
        }
        return items;
    }

    /**
     * format the number as money
     *
     * @param amount the amount
     */
    private getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    /**
     * returns ture if there are any visible items for the displayed stages
     */
    get hasVisibleItems() {
        let visible = false;
        if (this.modellist.buckets) {
            for (let bucket of this.modellist.buckets.bucketitems) {
                if (this.stages.findIndex(st => st.stage == bucket.bucket) >= 0 && bucket.items > 0) {
                    visible = true;
                    break;
                }
            }
        }
        return visible;
    }

    /**
     * checks if there are more records to load
     */
    private loadmore() {
        // no further load if we are loading already
        if (this.modellist.isLoading) return false;

        // check if there are still buckets that have potentially more items
        let loadmore = false;
        for (let bucket of this.modellist.buckets.bucketitems) {
            if (this.stages.findIndex(st => st.stage == bucket.bucket) >= 0 && bucket.total > bucket.items) {
                loadmore = true;
                break;
            }
        }

        if (loadmore) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * returns the name for the stage to be displayed
     *
     * @param stagedata
     */
    private getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return this.language.getLabel(stagedata.stage_label);
        } else {
            return stagedata.stage_name;
        }
    }

    /**
     * helper to get the currency symbol
     */
    private getCurrencySymbol(): string {
 
        let currencySymbol: string;
        let currencyid = -99;

        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }

    /**
     * handels the drop
     * ToDo: Check if we can find a nicer way then attaching the drop infor to the item
     *
     * @param event
     */
    private handleDrop(event: CdkDragDrop<any>) {
        if (event.item.data[this.confdata.statusfield] != event.container.data.stage) {
            // a little bit of an ugly hack to get the drop information to the item so the item can handle the moel upadet
            event.item.data._KanbanDrop = {
                from: event.item.data[this.confdata.statusfield],
                to: event.container.data.stage
            };
            event.item.data[this.confdata.statusfield] = event.container.data.stage;
        }
    }

    /**
     * handels the drop on a hidden container
     *
     * @param event
     */
    private handleHiddenDrop(event: CdkDragDrop<any>) {
        if (event.item.data[this.confdata.statusfield] != event.container.data.stage) {
            // initialize the model
            this.model.module = this.modellist.module;
            this.model.initialize();
            this.model.id = event.item.data.id;
            this.model.data = this.model.utils.backendModel2spice(this.modellist.module, _.clone(event.item.data));

            // initialize the field statis
            this.model.initializeFieldsStati();

            // start the edit and set the new stage
            this.model.startEdit();
            this.model.setField(this.confdata.statusfield, event.container.data.stage);

            //
            if (this.model.validate()) {
                this.model.save();
            } else {
                this.model.edit();
            }

            // udate the item data
            event.item.data[this.confdata.statusfield] = event.container.data.stage;
        }
    }

    /**
     * returns if the user is allowed to edit and can edit this opportunity
     *
     * @param item
     */
    private allowDrag(item) {
        return this.draganddropenabled && item.acl.edit;
    }

    /**
     * adds a bottom margin if the utility bar is shown
     */
    get containerStyle() {
        if (this.kanbanUtilityBar) {
            let rect = this.kanbanUtilityBar.element.nativeElement.getBoundingClientRect();
            return {'margin-bottom': rect.height + 'px'};
        } else {
            return {};
        }
    }

    /**
     * returns the label of the spicekanbansumfield
     *
     * @param aggregatefield
     */
    private getTitle(aggregatefield) {
        const prefix = "LBL_";
        return this.language.getLabel(prefix + aggregatefield.name.toUpperCase());

    }

}
