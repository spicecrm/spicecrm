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

@Component({
    selector: 'spice-kanban',
    templateUrl: './src/include/spicepath/templates/spicekanban.html'
})
export class SpiceKanban implements OnInit, OnDestroy {
    @ViewChild('kanbanContainer', {read: ViewContainerRef, static: true}) private kanbanContainer: ViewContainerRef;

    private componentconfig: any = {};
    private modellistsubscribe: any = undefined;
    private requestedFields: string[] = [];

    private confdata: any;

    private stages: any[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private configuration: configurationService, private metadata: metadata, private userpreferences: userpreferences, private language: language, private currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.model.module);

        this.currencies = this.currency.getCurrencies();

    }

    /**
     * load ths stage data and build the buckts we are searching for to build the kanban board
     */
    public ngOnInit() {
        this.confdata = this.configuration.getData('spicebeanguides')[this.model.module];
        let stages = this.confdata.stages;


        let tilecomponentconfig = this.metadata.getComponentConfig('SpiceKanbanTile', this.modellist.module);
        let tilecomponentFields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
        for (let tilecomponentField of tilecomponentFields) {
            this.requestedFields.push(tilecomponentField.field);
        }

        let bucketitems = [];
        for (let stage of stages) {
            // if not in kanban continue
            if (stage.stagedata.not_in_kanban == '1') continue;

            // push to stages
            this.stages.push(stage);

            // push the bucket item
            bucketitems.push({
                bucket: stage.stagedata.secondary_stage ? stage.stagedata.stage + ' ' + stage.stagedata.secondary_stage : stage.stage,
                value: 0,
                items: 0
            });
        }

        if (_.isEmpty(this.modellist.buckets)) {
            this.modellist.buckets = {
                bucketfield: this.confdata.statusfield,
                buckettotal: this.componentconfig.sumfield,
                bucketitems: bucketitems
            }

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
    private getStageData(stage): any {
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
     */
    private getStageSum(stagedata) {
        try {
            let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
            let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);

            return item && item.value ? item.value : 0;
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
     * react to the scroll event and if possible reload the list
     *
     * @param e
     */
    private onScroll(e) {
        let element = this.kanbanContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {

            // check if there are still buckets that have potentially more items
            let loadmore = false;
            for (let bucket of this.modellist.buckets.bucketitems) {
                if (bucket.total > bucket.items) {
                    loadmore = true;
                    break;
                }
            }

            if (loadmore) {
                this.modellist.loadMoreList();
            }
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
     * returns if the user is allowed to edit and can edit this opportunity
     *
     * @param item
     */
    private allowDrag(item) {
        return item.acl.edit;
    }
}
