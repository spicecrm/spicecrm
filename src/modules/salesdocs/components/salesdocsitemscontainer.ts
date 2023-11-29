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
import {Subject, Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {salesdocrecord} from "../services/salesdocrecord";

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
    public subscription = new Subscription();

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
        public broadcast: broadcast,
        private salesdocrecord: salesdocrecord
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
     * recalculates the total document
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
                            // add the item type details
                            addModal.instance.itemTypeDetails = itemTypeDetails;

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
        // set the quantity by default to 1 if not set
        if(!itemData.quantity) itemData.quantity = 1;
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


        // check if we shoudl calculate
        let itemTypeDetails = this.configuration.getData('salesdocitemtypes').find(it => it.name == itemType);
        if (itemTypeDetails.pricecalculationschema_id) {
            // if we have the pricing data already the add dialog did the pricing (hopefully) and we do not need to do anything more
            if(!!itemData.salesdocitempricedetermination && !!itemData.salesdocitempricecalculationschema_id){
                // update the relevant fields
                this.salesdocrecord.getItemFieldsByElements(itemData.salesdocitempricecalculationschema_id, 1, itemData.salesdocitempricedetermination, itemData);
                this.model.data.salesdocitems.beans[itemData.id] = itemData;
                this.buildItems()
            } else {
                // otherwise run the price determination here and now
                itemData.salesdocitempricecalculationschema_id = itemTypeDetails.pricecalculationschema_id;
                this.calculateItem(itemTypeDetails.pricecalculationschema_id, itemData).subscribe({
                    next: () => {
                        this.model.data.salesdocitems.beans[itemData.id] = itemData;
                        this.buildItems();
                    },
                    error: () => {
                        this.model.data.salesdocitems.beans[itemData.id] = itemData;
                        this.buildItems();
                    }
                })
            }

        } else {
            this.model.data.salesdocitems.beans[itemData.id] = itemData;
            this.buildItems();
        }

    }

    /**
     * caclulate the item on the backend
     *
     * @param itemData
     * @private
     */
    private calculateItem(pricecalculationschema_id, itemData) {
        let retSubject = new Subject();
        let postData = {
            salesdoc: this.model.utils.spiceModel2backend('SalesDocs', this.model.data),
            items: [this.model.utils.spiceModel2backend('SalesDocItems', itemData)]
        }
        let calcAwait = this.modal.await('LBL_CALCULATING');
        this.backend.postRequest(`module/SalesDocs/${this.model.id}/calculateitems`, {}, postData).subscribe({
            next: (calcdata) => {
                // set the itemdata
                itemData.salesdocitempricedetermination = calcdata[itemData.id];

                // update the relevant fields
                this.salesdocrecord.getItemFieldsByElements(pricecalculationschema_id, this.model.getField('quantity'), itemData.salesdocitempricedetermination, itemData);

                // retutn the subject so the item gets added
                retSubject.next(true);
                retSubject.complete();

                calcAwait.emit(true);
            },
            error: () => {
                calcAwait.emit(true);
                retSubject.error(false);
            }
        })

        return retSubject.asObservable();
    }
}
