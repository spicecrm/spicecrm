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
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {currency} from '../../../services/currency.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {ListTypeI} from "../../../services/interfaces.service";
import {skip} from "rxjs/operators";

declare var _: any;

/**
 * the kanban board
 */
@Component({
    selector: 'spice-kanban',
    templateUrl: '../templates/spicekanban.html',
    providers: [model]
})
export class SpiceKanban implements OnInit, OnDestroy {
    /**
     * reference to the utility bar if one is rendered
     */
    @ViewChild('kanbanUtilityBar', {read: ViewContainerRef, static: false}) public kanbanUtilityBar: ViewContainerRef;

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * subscription to the modellist for type changes
     */
    public modellistsubscribe: any = undefined;

    /**
     * holds the config data for the beanguides
     */
    public confdata: any;

    /**
     * holds the info on the stages to be displayed
     */
    public stages: any[] = [];
    /**
     * collects all of the fields and their operation type
     */
    public sumfields: any[] = [];
    /**
     * hidden statges that are rendered in teh utility bar
     */
    public hiddenstages: any[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    public sortfields: any[] = [];

    public loadLabel: boolean = false;
    /**
     * holds the status network items
     */
    public statusNetworkItems: any[] = [];
    /**
     * holds the status network field
     */
    public statusField: string = '';
    /**
     * holds the status network managed boolean
     */
    public statusNetworkManaged: boolean = false;

    constructor(public backend: backend, public broadcast: broadcast, public model: model, public modellist: modellist, public configuration: configurationService, public metadata: metadata, public userpreferences: userpreferences, public language: language, public currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.modellist.module);
        this.currencies = this.currency.getCurrencies();
        this.loadSortFields();

    }

    /**
     * getter for the sortfield
     */
    get sortField() {
        return !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortfield : 'select';
    }

    /**
     * sets the sortfield and pushes it to the sortArray of the modellist
     * @param field
     */
    set sortField(field: string) {
        !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortfield = field :
        this.modellist.sortArray.push({
            sortfield: field,
            sortdirection: this.sortDirection
        });
    }

    /**
     * getter for disabling the sortdirection selection if the sortfield is an empty string
     */
    get isDisabled() {
        return this.sortField == 'select';
    }
    /**
     * getter for the sortfield
     */
    get sortDirection() {
        return !_.isEmpty(this.modellist.sortArray) ? this.modellist.sortArray[0].sortdirection : 'ASC';
    }

    set sortDirection(direction: string) {
        this.modellist.sortArray[0].sortdirection = direction;
    }



    /**
     * loads the sortfields from the fts configuration
     * @private
     */
    public loadSortFields() {
        let moduleDefs = this.metadata.getModuleDefs(this.modellist.module);
        if(moduleDefs.ftssortable){
            this.sortfields = moduleDefs.ftssortable.map(field => field.field);
        }
    }

    /**
     * load status network from metadata
     * @private
     */
    private loadStatusNetwork() {
        const managed = this.metadata.checkStatusManaged(this.modellist.module);
        if (managed != false) {
            this.statusField = managed.statusField;
            this.statusNetworkItems = managed.statusNetwork;
            this.statusNetworkManaged = true;
        }
    }

    /**
     * load ths stage data and build the buckts we are searching for to build the kanban board
     */
    public ngOnInit() {

        this.loadStatusNetwork();
        this.confdata = this.configuration.getData('spicebeanguides')[this.modellist.module];
        let stages = this.confdata.stages;

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
                items: 0,
                hidden: stage.stagedata.not_in_kanban == '1'
            });

        }

        // builds the sumfields array
        if(this.componentconfig.sumfield) {
            let configs = this.componentconfig.sumfield.split(",");
            for (let config of configs) {
                // catch whitespace
                config = config.trim();
                if (config.includes(":")) {
                    this.sumfields.push({
                        name: config.substring(0, config.indexOf(':')),
                        function: config.substring(config.indexOf(':') + 1),
                    });
                } else {
                    this.sumfields.push({
                        name: config,
                        function: "sum",
                    });
                }
        }


        }


        if (_.isEmpty(this.modellist.buckets)) {

            this.modellist.buckets = {
                bucketfield: this.confdata.statusfield,
                buckettotal: this.sumfields, // [{field: 'amount', function: 'sum'}, {field: 'probabilty', function: 'avg'}]
                bucketitems: bucketitems
            };

            this.modellist.getListData();

        }


        // set limit to 10 .. since this is retrieved bper stage
        this.modellist.loadlimit = 25;

        // subscribe to changes of the list type
        // since this is a behavior subject this will also fire the initial list load
        this.modellistsubscribe = this.modellist.listType$.pipe(skip(1)).subscribe(newType =>
            this.handleListTypeChange(newType)
        );

    }

    /**
     * destry any subscriptuon and reset the modellist buckets
     */
    public ngOnDestroy() {
        // unsubscribe
        this.modellistsubscribe.unsubscribe();

        // reset buckets
        this.modellist.buckets = {};
        this.modellist.setToSession();

    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    public handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'SpiceKanban') return;
        this.modellist.reLoadList();
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
    public trackbyfn(index, item) {
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

    public getStageCount(stagedata) {
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
    public getStageSum(stagedata, aggregatefield) {
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
    public getStageItems(stage) {
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
    public getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    /**
     * returns ture if there are any visible items for the displayed stages
     */
    get hasVisibleItems() {
        let visible = false;
        if (!!this.modellist.buckets && !!this.modellist.buckets.bucketitems) {
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
    public loadmore() {
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
    public getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return stagedata.stage_label;
        } else {
            return stagedata.stage_name;
        }
    }


    /**
     * helper to get the currency symbol
     * @param aggregatefield
     */
    public getCurrencySymbol(aggregatefield): string {
        if (this.metadata.getFieldType(this.modellist.module, aggregatefield.name) == 'currency') {
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

    }

    /**
     * handels the drop
     * ToDo: Check if we can find a nicer way then attaching the drop infor to the item
     *
     * @param event
     */
    public handleDrop(event: CdkDragDrop<any>) {
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
    public handleHiddenDrop(event: CdkDragDrop<any>) {
        if (event.item.data[this.confdata.statusfield] != event.container.data.stage) {
            // initialize the model
            this.model.module = this.modellist.module;
            this.model.initialize();
            this.model.id = event.item.data.id;
            this.model.setData(_.clone(event.item.data));

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
    public allowDrag(item) {
        return this.draganddropenabled && item.acl.edit && (!this.statusNetworkManaged || this.statusNetworkItems.some(e => item[this.statusField] == e.status_from));
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
    public getTitle(aggregatefield) {
        return this.language.getLabel("LBL_" + aggregatefield.name.toUpperCase());

    }

    /**
     * method to be passed to drop list to disable dropping based on status network
     * @param stage
     */
    public dropEnterAllowed(stage: any) {
        return (item: CdkDrag) => {
            return !this.statusNetworkManaged || this.statusNetworkItems.filter(e => e.status_to == stage.stage).some(e => e.status_from == item.data[this.statusField])
        }
    }
}
