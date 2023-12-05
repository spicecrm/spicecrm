/**
 * @module ModuleSalesDocs
 */
import {EventEmitter, Injectable, Injector, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {Observable, of, Subject, Subscription} from "rxjs";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;

/**
 * a helper service to handle the Sales Doc
 */
@Injectable()
export class salesdocrecord implements OnDestroy {

    /**
     * the salesdoc so it is available in underlying components
     *
     * @private
     */
    public salesdoc: any;

    /**
     * an emitter that triggers if the tax information has beenchanged and a new tax determination shoudl be triggered by the tax fields
     */
    public taxchange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the taxed party based onteh salesdoc
     *
     * @private
     */
    public taxedParty: any = {
        module: null,
        id: null,
        data: null
    };

    /**
     * collect Subscriptions
     *
     * @private
     */
    public subscribptions: Subscription = new Subscription();

    public buildItems$: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public configuration: configurationService,
        public backend: backend,
        public language: language,
        public modal: modal,
        public modelutilities: modelutilities,
        public injector: Injector
    ) {
    }

    /**
     * unsubscribe from all subscriptions on destroy
     */
    public ngOnDestroy() {
        this.subscribptions.unsubscribe();
    }

    /**
     * sets the salesdoc model
     *
     * @param model
     */
    set salesDoc(model: model) {
        // set the salesdoc model
        this.salesdoc = model;

        // subscribe to model changes
        this.subscribptions.add(
            this.salesdoc.data$.subscribe(() => {
                this.getTaxedParty();
            })
        );
    }

    /**
     * gets the salesdocmodel
     */
    get salesDoc() {
        return this.salesdoc;
    }

    public getTaxCategory(producttaxcategory) {

        let taxdeterminations = this.configuration.getData('salesdoctaxdetermination');

        // if we do not have tax determinations return empty
        if(!taxdeterminations) return '';

        // get the companycode
        let companycode = this.configuration.getData('companycodes').find(c => c.id == this.salesdoc.getField('companycode_id'));

        // first full fledged
        let taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && d.customervatid == this.vatid && d.producttaxcategory == producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        // with empty vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && !d.customervatid && d.producttaxcategory == producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        // without product category
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && d.customervatid == this.vatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        // without product category and emtpy vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && !d.customervatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        // then without customercountry
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && !d.customercountry && d.customervatid == this.vatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        // then without customercountry and empty vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && !d.customercountry && !d.customervatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.salesdoctaxcategory;
        }

        return '';

    }

    /**
     * returns if the taxed party has a vatid
     */
    get vatid() {
        return !this.taxedParty.data?.vat_nr ? '0' : '1';
    }

    get salesDocItemCount() {
        try {
            let count = 0;
            for (let id in this.salesdoc.data.salesdocitems.beans) {
                if (this.salesdoc.data.salesdocitems.beans.hasOwnProperty(id)) count++;
            }
            return count;
        } catch (e) {
            return 0;
        }
    }

    /**
     * gets the taxed country
     * - first fromt ehsalesdoc
     * - then from the taxed party
     */
    public taxedCountry(data?) {
        // first try to use the shipping country fromt eh salesdoc
        if (this.salesdoc.getField('shipping_address_country')) {
            return this.salesdoc.getField('shipping_address_country');
        }

        if (!data) data = this.taxedParty.data;

        // use the shipping country from the taxed bean
        switch (this.taxedParty.module) {
            case 'Accounts':
                return data.shipping_address_country ? data.shipping_address_country : data.billing_address_country;
            case 'Contacts':
                return data.primary_address_country;
        }

        return '';
    }

    /**
     * determine the best matching taxed party
     *
     * @private
     */
    public getTaxedParty(): Observable<boolean> {

        // only if we are editing
        if(!this.salesdoc.isEditing) return of(true);

        // first Receiving Account
        let rpModule = 'Accounts';
        let rpId = this.salesdoc.getField('account_rp_id');

        // try Ordering Account
        if (!rpId) {
            rpId = this.salesdoc.getField('account_op_id');
        }

        // try the receiving contact
        if (!rpId) {
            rpModule = 'Contacts';
            rpId = this.salesdoc.getField('contact_rp_id');
        }

        // try the ordering contact
        if (!rpId) {
            rpId = this.salesdoc.getField('contact_op_id');
        }

        // if we have no id return false
        if (!rpId) {
            return of(false);
        }

        if (rpId == this.taxedParty.id && rpModule == this.taxedParty.module) {
            return of(true);
        }

        // load the data
        let retSubject = new Subject<boolean>();

        // get the data
        this.backend.getRequest(`module/${rpModule}/${rpId}`).subscribe(
            data => {

                // check if we have a change in taxdata
                if (this.configuration.getData('salesdoctaxdetermination') && this.salesDocItemCount > 0 && (!this.taxedParty.data || !!this.taxedParty.data?.vat_nr != !!data?.vat_nr || this.taxedCountry() != this.taxedCountry(data))) {
                    this.modal.prompt('confirm', this.language.getLabel('MSG_RECALC_TAXES', null, 'long'), this.language.getLabel('MSG_RECALC_TAXES')).subscribe(res => {
                        if (res) {
                            this.taxchange.emit(true);
                        }
                    });
                }

                // set the data
                this.taxedParty.id = rpId;
                this.taxedParty.module = rpModule;
                this.taxedParty.data = data;

                // return and process
                retSubject.next(true);
                retSubject.complete();
            },
            () => {
                retSubject.error('record not found');
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    /**
     * recalculates an elements schema
     *
     * @param elements
     */
    public recalculate(schemaelements, conditionelements, quantity ){
        for(let element of schemaelements){
            let ce = conditionelements.find(c => c.id == element.id);
            if(element.elementcalculation){
                 ce.elementamount = this.evaluateFormula(element.elementcalculation,schemaelements, conditionelements);
                 ce.elementtotalamount = this.evaluateFormula(element.elementcalculation,schemaelements, conditionelements, true);
            } else if(element.elementbase && (element.valuetype == 'P' || element.valuetype == 'T')) {
                switch(element.elementbasetype) {
                    case 'I':
                        ce.elementamount =  this.evaluateFormula(element.elementbase, schemaelements, conditionelements) * ( 1 - 100 / (100 + parseFloat(ce.elementoverridevalue ?? ce.elementvalue ?? 0)));
                        ce.elementtotalamount =  this.evaluateFormula(element.elementbase, schemaelements, conditionelements, true) * ( 1 - 100 / (100 + parseFloat(ce.elementoverridevalue ?? ce.elementvalue ?? 0)));
                        break;
                    default:
                        ce.elementamount = parseFloat(ce.elementoverridevalue ?? ce.elementvalue ?? 0) * this.evaluateFormula(element.elementbase, schemaelements, conditionelements) / 100;
                        ce.elementtotalamount = parseFloat(ce.elementoverridevalue ?? ce.elementvalue ?? 0) * this.evaluateFormula(element.elementbase, schemaelements, conditionelements, true) / 100;
                        break;
                }
            } else if (element.valuetype == 'F') {
                ce.elementamount = ce.elementoverridevalue ?? ce.elementvalue ?? 0;
                ce.elementtotalamount = ce.elementamount;
                ce.elementamount = ce.elementamount / quantity;
            } else {
                ce.elementamount = ce.elementoverridevalue ?? ce.elementvalue ?? 0;
                ce.elementtotalamount = ce.elementamount * quantity;
            }

            // mathematical round the value
            ce.elementamount = Math.round(ce.elementamount * 100) / 100;
            ce.elementtotalamount = Math.round(ce.elementtotalamount * 100) / 100;
        }
    }

    /**
     * evaluates a formula in the calculation schema
     *
     * @param elementcalculation
     * @param elements
     * @private
     */
    private evaluateFormula(elementcalculation, elements, conditionelements, total = false): number{
        let reg = new RegExp(/{(.*?)}/g);
        let matches = elementcalculation.matchAll(reg)
        for(let match of matches){
            let value = this.getElementValueByIndex(match['1'], elements, conditionelements, total);
            elementcalculation = elementcalculation.replaceAll(match['0'], value);
        }
        try{
            return parseFloat(eval(elementcalculation));
        } catch(e){
            return 0;
        }
    }

    /**
     * gets a value for a index determining it by index or type
     *
     * @param index
     * @param elements
     * @private
     */
    private getElementValueByIndex(index, elements, conditionelements, total = false){
        let elementname = total ? 'elementtotalamount' : 'elementamount'

        for (let element of elements){
            if(element.elementindex == index || element.elementtype == index){
                return parseFloat(conditionelements.find(c => c.id == element.id)[elementname] ?? 0);
            }
        }
        return 0;
    }

    public getItemFieldsByElements(pricecalculationschema_id, quantity, elements, updateFields: any){

        // get the schema elements
        let schemaelements = this.configuration.getData('pricingschemaelements');
        schemaelements = schemaelements.filter(e => e.syspricecalculationschema_id == pricecalculationschema_id);
        schemaelements.sort((a, b) => a.elementindex > b.elementindex ? 1 : -1);

        for(let element of schemaelements) {
            // get the condiiton element
            let ce = elements.find(e => e.id == element.id);

            // if we have no recoird continue
            if(!ce) continue;

            switch (element.elementtype) {
                case 'NET':
                    updateFields.amount_net_per_uom = ce.elementamount;
                    updateFields.amount_net = ce.elementtotalamount;
                    break;
                case 'GROSS':
                    updateFields.amount_gross = ce.elementtotalamount;
                    break;
                case 'VAT':
                    updateFields.tax_amount = ce.elementtotalamount;
                    updateFields.tax_category = ce.tax_category;
                    break;
            }
        }
    }

    /**
     * called to add an Item
     */
    public addItem(parentItemId = null) {
        this.modal.openModal('SalesDocsItemsAddTypeSelector', true, this.injector).subscribe(addItemModal => {
            if(parentItemId){
                addItemModal.instance.parentItemType = this.salesdoc.data.salesdocitems.beans[parentItemId].itemtype;
            }
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
                                if(parentItemId) item.parentitem_id = parentItemId;
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
        itemData.id = this.modelutilities.generateGuid();
        itemData.deleted = 0;
        itemData.salesdoc_id = this.salesdoc.id;
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
        if (!this.salesdoc.data.salesdocitems) {
            this.salesdoc.data.salesdocitems = {
                beans: {}
            };
        }


        // check if we shoudl calculate
        let itemTypeDetails = this.configuration.getData('salesdocitemtypes').find(it => it.name == itemType);
        if (itemTypeDetails.pricecalculationschema_id) {
            // if we have the pricing data already the add dialog did the pricing (hopefully) and we do not need to do anything more
            if(!!itemData.salesdocitempricedetermination && !!itemData.salesdocitempricecalculationschema_id){
                // update the relevant fields
                this.getItemFieldsByElements(itemData.salesdocitempricecalculationschema_id, 1, itemData.salesdocitempricedetermination, itemData);
                this.salesdoc.data.salesdocitems.beans[itemData.id] = itemData;
                this.buildItems$.emit(true);
            } else {
                // otherwise run the price determination here and now
                itemData.salesdocitempricecalculationschema_id = itemTypeDetails.pricecalculationschema_id;
                this.calculateItem(itemTypeDetails.pricecalculationschema_id, itemData).subscribe({
                    next: () => {
                        this.salesdoc.data.salesdocitems.beans[itemData.id] = itemData;
                        this.buildItems$.emit(true);
                    },
                    error: () => {
                        this.salesdoc.data.salesdocitems.beans[itemData.id] = itemData;
                        this.buildItems$.emit(true);
                    }
                })
            }

        } else {
            this.salesdoc.data.salesdocitems.beans[itemData.id] = itemData;
            this.buildItems$.emit(true);
        }

    }

    /**
     * returns if there are subtypes for this item type configured
     * @param itemId
     */
    public canAddSubitems(itemId){
        let typesData = this.configuration.getData('salesdoctypes').find(typeRecord => typeRecord.name == this.salesdoc.getField('salesdoctype'));
        return typesData.itemsubtypes[this.salesdoc.data.salesdocitems.beans[itemId].itemtype] && typesData.itemsubtypes[this.salesdoc.data.salesdocitems.beans[itemId].itemtype].length > 0;
    }

    /**
     * returns the itemnr
     *
     * @param itemid
     */
    public getItemNr(itemid){
        return this.salesdoc.data.salesdocitems.beans[itemid].itemnr;
    }

    /**
     * gets the next item number
     */
    public getNextItemNr() {
        let lastitemnr = 0;
        for (let itemid in this.salesdoc.data.salesdocitems?.beans) {
            // get the item data
            let item = this.salesdoc.data.salesdocitems.beans[itemid];
            // get an itemNR
            let thisitemNr = parseInt(item.itemnr, 10);
            if (thisitemNr > lastitemnr) {
                lastitemnr = thisitemNr;
            }
        }

        return lastitemnr + 10;
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
            salesdoc: this.modelutilities.spiceModel2backend('SalesDocs', this.salesdoc.data),
            items: [this.modelutilities.spiceModel2backend('SalesDocItems', itemData)]
        }
        let calcAwait = this.modal.await('LBL_CALCULATING');
        this.backend.postRequest(`module/SalesDocs/${this.salesdoc.id}/calculateitems`, {}, postData).subscribe({
            next: (calcdata) => {
                // set the itemdata
                itemData.salesdocitempricedetermination = calcdata[itemData.id];

                // update the relevant fields
                this.getItemFieldsByElements(pricecalculationschema_id, itemData.quantity, itemData.salesdocitempricedetermination, itemData);

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
