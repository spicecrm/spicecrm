/**
 * @module ModuleSpicePath
 */
import {
    Component,
    Pipe,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {currency} from '../../../services/currency.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'spice-kanban',
    templateUrl: './src/include/spicepath/templates/spicekanban.html'
})
export class SpiceKanban implements OnInit, OnDestroy {
    @ViewChild('kanbanContainer', {read: ViewContainerRef, static: true}) private kanbanContainer: ViewContainerRef;

    private componentconfig: any = {};
    private modellistsubscribe: any = undefined;
    private requestedFields: string[] = [];

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    constructor(private broadcast: broadcast, private model: model, private modellist: modellist, private configuration: configurationService, private metadata: metadata, private userpreferences: userpreferences, private language: language, private currency: currency) {

        this.componentconfig = this.metadata.getComponentConfig('SpiceKanban', this.model.module);

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

        this.currencies = this.currency.getCurrencies();

    }

    public ngOnInit() {
        let confData = this.configuration.getData('spicebeanguides')[this.model.module];
        let stages = confData.stages;

        let bucketitems = [];
        for (let stage of stages) {
            bucketitems.push({
                bucket: stage.stagedata.secondary_stage ? stage.stagedata.stage + ' ' + stage.stagedata.secondary_stage : stage.stage,
                value: 0,
                items: 0
            });
        }

        this.requestedFields = ['name', 'account_name', 'account_id', 'sales_stage', 'amount_usdollar', 'amount'];

        this.modellist.buckets = {
            bucketfield: confData.statusfield,
            bucketitems: bucketitems
        }

        // set limit to 10 .. since this is retrieved bper stage
        this.modellist.loadlimit = 10;

        this.modellist.getListData(this.requestedFields, false);
    }

    public ngOnDestroy() {
        this.modellistsubscribe.unsubscribe();

        this.modellist.buckets = {};
    }

    /**
     * returns the stages for the module from teh configuration service
     */
    get stages() {
        try {
            return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];
        } catch (e) {
            return [];
        }
    }


    private getStageData(stage): any {
        let stagedata = [];
        this.stages.some(thisStage => {
            if (stage == thisStage.stage) {
                stagedata = thisStage.stagedata;
                return;
            }
        });
        return stagedata;
    }


    private switchListtype() {
        let requestedFields = [];
        this.modellist.getListData(this.requestedFields);
    }

    private showSum() {
        return this.componentconfig.sum !== '';
    }

    get sizeClass() {
        return 'slds-size--1-of-' + this.stages.length;
    }

    private getStageCount(stagedata) {
        let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
        let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);
        return item ? item.total : 0;
    }

    private getStageSum(stagedata) {
        let stage = stagedata.secondary_stage ? stagedata.stage + ' ' + stagedata.secondary_stage : stagedata.stage;
        let item = this.modellist.buckets.bucketitems.find(bucketitem => bucketitem.bucket == stage);

        return item && item.value ? this.userpreferences.formatMoney(item.value, 0) : 0;
    }

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

    private getMoney(amount) {
        return this.userpreferences.formatMoney(parseFloat(amount), 0);
    }

    private onScroll(e) {
        let element = this.kanbanContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
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

}
