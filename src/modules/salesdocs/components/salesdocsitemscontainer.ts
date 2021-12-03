/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef,
    Injector, OnDestroy,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";

declare var moment: any;

@Component({
    selector: 'salesdocs-items-container',
    templateUrl: '../templates/salesdocsitemscontainer.html'
})
export class SalesDocsItemsContainer implements OnInit, OnDestroy {

    /**
     * the items on the sales Document
     */
    public items: any[] = [];

    /**
     * for the voucher handling
     */
    public voucher: any = {};

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * the columns to be displayed
     */
    private subscription = new Subscription();

    constructor(
        public userpreferences: userpreferences,
        public injector: Injector,
        public language: language,
        public backend: backend,
        public elementRef: ElementRef,
        public model: model,
        public modal: modal,
        public view: view,
        public configuration: configurationService,
        public metadata: metadata,
        private broadcast: broadcast,
    ) {
        // build in any case if the items had already been passed in
        this.buildItems();

        // add the subscriber
        this.subscription.add(
            this.broadcast.message$.subscribe(msg => {
                    if (msg.messagetype == 'model.save' || msg.messagetype == 'model.loaded' && msg.messagedata.module === this.model.module) {
                        this.buildItems();
                    }
                }
            )
        );

        // determine the list fieldset
        let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
        if (config.fieldset) {
            this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
        }
    }

    /**
     * on the init recalculate
     */
    public ngOnInit() {
        this.recalculate();
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * simple helper to get if the view is editing
     */
    get editing() {
        return this.view.isEditMode();
    }

    /**
     * getter for total net value
     */
    get totalnet() {
        let total = 0;
        for (let item of this.items) {
            if (item.deleted != 1) total += parseFloat(item.amount_net);
        }
        return total;
    }

    /**
     * getter for total gross value
     */
    get totalgross() {
        let total = 0;
        for (let item of this.items) {
            if (item.deleted != 1) total += parseFloat(item.amount_gross);
        }
        return total;
    }

    /**
     * returns the number of not deleted items
     */
    get itemcount() {
        return this.items.filter(item => item.deleted != 1).length;
    }

    /**
     * recacluates the total document
     */
    public recalculate() {
        this.model.setField('amount_net', this.totalnet);
        this.model.setField('amount_gross', this.totalgross);
    }

    /**
     * build the items and render them in the container
     */
    public buildItems(): boolean {
        if (!this.model.data?.salesdocitems) return false;

        this.items = [];
        for (let itemid in this.model.data.salesdocitems.beans) {
            this.items.push(this.model.data.salesdocitems.beans[itemid]);
        }

        this.items.sort((a, b) => {
            return a.itemnr > b.itemnr ? 1 : -1;
        });

        if (this.model.data.salesvouchers) {
            for (let voucherid in this.model.data.salesvouchers.beans) {
                this.voucher = this.model.data.salesvouchers.beans[voucherid];
            }
        }
        return true;
    }


    /**
     * gets the next item number
     */
    public getNextItemNr() {
        let lastitemnr = 0;
        for (let item of this.items) {
            let thisitemNr = parseInt(item.itemnr, 10);
            if (thisitemNr > lastitemnr) {
                lastitemnr = thisitemNr;
            }
        }

        return lastitemnr + 10;
    }


    /**
     * called to add an Item
     */
    public addItem() {
        this.modal.openModal('SalesDocsItemsAddTypeSelector', true, this.injector).subscribe(addItemModal => {
            addItemModal.instance.itemTypeSelected.subscribe(itemType => {
                if (itemType) {
                    // get the item type data
                    let itemTypes = this.configuration.getData('salesdocitemtypes');
                    let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == itemType);
                    if (itemTypeDetails) {
                        this.modal.openModal(itemTypeDetails.addmodalcomponent, true, this.injector).subscribe(addModal => {
                            // if a filter is set add the filter
                            if (itemTypeDetails.addmodalfilter) {
                                addModal.instance.modulefilter = itemTypeDetails.addmodalfilter;
                            }
                            // subscribe to the add event
                            addModal.instance.additem.subscribe(item => {
                                // add the item
                                this.handleAddItem(item, itemType);
                            });
                        });
                    }
                }
            });
        });
    }

    /**
     * handler to add the item
     * @param itemData
     */
    public handleAddItem(itemData, itemType) {
        itemData.id = this.model.generateGuid();
        itemData.deleted = 0;
        itemData.salesdoc_id = this.model.id;
        // The tax category is temporarily set by a copy rule.
        // So for this time only one specific tax rate per CRM installation is possible.
        // ToDo: Work out a tax rate calculation.
        // itemData.tax_category = 'V20';
        itemData.quantity = 1;
        itemData.itemnr = this.getNextItemNr();
        itemData.itemtype = itemType;
        itemData.date_entered = new moment();
        itemData.date_modified = new moment();

        // add to the bean as well
        if (!this.model.data.salesdocitems) {
            this.model.data.salesdocitems = {
                beans: {}
            };
        }

        this.model.data.salesdocitems.beans[itemData.id] = itemData;

        this.buildItems();

    }
}
