/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    ElementRef, EventEmitter, Injector,
    Input, OnDestroy, OnInit, Output
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {salesdocrecord} from '../services/salesdocrecord';
import {Subscription} from "rxjs";

@Component({
    selector: '[salesdocs-item-container]',
    templateUrl: '../templates/salesdocsitemcontainer.html',
    providers: [model, view]
})
export class SalesDocsItemContainer implements OnInit, OnDestroy {

    /**
     * the item to be displayed
     */
    @Input() public item: any = {};

    /**
     * the view fromt eh parent .. to link the two
     */
    @Input() public parentview: view;

    /**
     * the salesdoc model
     */
    @Input() public salesdoc: any;

    /**
     * emit when the item has been recalculated
     */
    @Output() public recalculated: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the columns to be displayed
     */
    public fieldsetItems: any[] = [];

    /**
     * if the item type has a details view
     */
    public hasDetailsView: boolean = false;

    /**
     * if the item type has an edit modal
     */
    public editModal: string;

    /**
     * holds the subscrptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public elementRef: ElementRef,
        public model: model,
        public modal: modal,
        public userpreferences: userpreferences,
        public view: view,
        public configuration: configurationService,
        public salesdocrecord: salesdocrecord,
        public injector: Injector
    ) {
        this.view.displayLabels = false;

        // check if the model has changed and recalculate
        this.model.data$.subscribe(data => {
            this.recalculate();
        });

        this.subscriptions.add(
            this.salesdocrecord.taxchange.subscribe(() => {
                this.redetermineTax();
            })
        );

    }

    public ngOnInit(): void {
        this.model.module = 'SalesDocItems';
        this.model.id = this.item.id;
        this.model.setData(this.item);

        // link the two views
        if(this.parentview) {
            this.view.isEditable = this.parentview.isEditable;
            this.parentview.mode$.subscribe(mode => {
                // check if we are in the same mode already
                if (this.view.getMode() == mode) return;

                // process the mode change
                if (mode == 'edit') {
                    this.view.setEditMode();
                    this.view.displayLinks = false;
                } else {
                    this.view.setViewMode();
                    this.view.displayLinks = true;
                }
            });
        }

        this.view.mode$.subscribe(mode => {
            // check if we are in the same mode already
            if (this.view.getMode() == mode) return;

            // process the mode change
            if (mode == 'edit') {
                // start editing the Salesdoc
                this.salesdoc.startEdit();
                // set the view to edit mode
                if(this.parentview) this.parentview.setEditMode();

                // do not display links
                this.view.displayLinks = false;
            }
        });

        // subscribe to document to listen to relevant changes (currency ... etc)
        this.salesdoc.data$.subscribe(data => {
            if (this.salesdoc.getField('currency_id') != this.model.getField('currency_id')) {
                this.model.setField('currency_id', this.salesdoc.getField('currency_id'));
            }
        });

        // determine if we can open details
        let itemTypes = this.configuration.getData('salesdocitemtypes');
        if (itemTypes) {
            let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.item.itemtype);
            if (itemTypeDetails && itemTypeDetails.detailcomponentset) this.hasDetailsView = true;
            if (itemTypeDetails && itemTypeDetails.editmodalcomponent) this.editModal = itemTypeDetails.editmodalcomponent;

            // determine the list fieldset
            if (itemTypeDetails && itemTypeDetails.itemfieldset) {
                this.fieldsetItems = this.metadata.getFieldSetFields(itemTypeDetails.itemfieldset);
            } else {
                let config = this.metadata.getComponentConfig('SalesDocsItemsContainer', 'SalesDocItems');
                if (config.fieldset) {
                    this.fieldsetItems = this.metadata.getFieldSetFields(config.fieldset);
                }
            }
        }

        // recalculate in any case
        this.recalculate();
    }

    /**
     * unsubscribe from all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns if the item can be edited
     */
    get canEdit(){
        return !!this.editModal && this.editing;
    }

    get editing() {
        return this.view.isEditMode();
    }

    get taxcategories(): any[] {
        return this.configuration.getData('salesdoctaxcategories');
    }

    /**
     * returns a formatted number
     *
     * @param number
     */
    public formatNumber(number) {
        return this.userpreferences.formatMoney(parseFloat(number));
    }

    public getUOMLabel(item) {
        let uoms = this.configuration.getData('uomunits');
        let unit = uoms.find(uom => uom.id == item.uom_id);
        if (unit) {
            return this.language.getLabel(unit.label);
        } else {
            return item.uom_id;
        }
    }

    /**
     * marks the item as deleted
     */
    public deleteItem() {
        this.item.deleted = 1;
    }

    get canAddSubitem(){
        return this.salesdocrecord.canAddSubitems(this.model.id);
    }

    get isSubItem(){
        return !!this.model.getField('parentitem_id')
    }

    get itemNr(){
        return this.salesdocrecord.getItemNr(this.model.id);
    }

    get parentItemNr(){
        return this.salesdocrecord.getItemNr(this.model.getField('parentitem_id'));
    }

    /**
     * adds a subitem
     */
    public addSubItem(){
        this.salesdocrecord.addItem(this.model.id);
    }

    /**
     * getter for the icon of the exoanded section
     *
     * ToDo: change to animation
     */
    get toggleIcon() {
        return this.item.expanded ? 'chevronup' : 'chevrondown';
    }

    /**
     * toggels the expanded flag and shows the details or hides them
     */
    public toggleDetails() {
        this.item.expanded = !this.item.expanded;
    }

    /**
     * opens the edit modal if one is defined in the type
     */
    public editDetails() {
        // check if we can edit at all
        if(!this.canEdit) return false

        let itemTypes = this.configuration.getData('salesdocitemtypes');
        let itemTypeDetails = itemTypes.find(thisItemType => thisItemType.name == this.model.getField('itemtype'));

        this.modal.openModal(this.editModal, true, this.injector).subscribe({
            next: (editModal) => {
                // add the item type details
                editModal.instance.itemTypeDetails = itemTypeDetails;
            }
        })
    }

    /**
     * triggered when a recalculate of the complete salesdoc is required
     */
    public recalculate() {
        // do not recalculate in display mode
        if (this.view.getMode() == 'view') return;

        // check that we have values to recalculate otherwise set totals to 0
        if (this.item.quantity && parseFloat(this.item.quantity) && this.item.amount_net_per_uom && parseFloat(this.item.amount_net_per_uom)) {

            if (this.item.salesdocitempricecalculationschema_id) {
                // get the condition elements
                this.salesdocrecord.recalculate(this.configuration.getData('pricingschemaelements').filter(e => e.syspricecalculationschema_id == this.item.salesdocitempricecalculationschema_id).sort((a, b) => a.elementindex > b.elementindex ? 1 : -1), this.item.salesdocitempricedetermination, this.item.quantity);

                // write the data to the item
                this.salesdocrecord.getItemFieldsByElements(this.item.salesdocitempricecalculationschema_id, this.item.quantity, this.item.salesdocitempricedetermination, this.item);
            } else if (this.item.gross_priced) {
                this.item.amount_gross = parseFloat(this.item.quantity) * parseFloat(this.item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(this.item.tax_category);

                this.item.amount_net = this.item.amount_gross * 100 / (100 + taxpercentage);
                this.item.tax_amount = this.item.amount_gross - this.item.amount_net;
            } else {
                this.item.amount_net = parseFloat(this.item.quantity) * parseFloat(this.item.amount_net_per_uom);

                let taxpercentage = this.getTaxPercentage(this.item.tax_category);

                this.item.amount_gross = this.item.amount_net * (100 + taxpercentage) / 100;
                this.item.tax_amount = this.item.amount_net * taxpercentage / 100;
            }
        } else {
            this.item.amount_net = 0;
            this.item.amount_gross = 0;
            this.item.tax_amount = 0;
        }

        this.recalculated.emit(true);
    }

    public redetermineTax() {
        // get the tax category
        let new_taxcategory = this.salesdocrecord.getTaxCategory(this.item.producttaxcategory);
        if (new_taxcategory != this.item.tax_category) {
            this.item.tax_category = new_taxcategory;
            this.recalculate();
        }
    }

    /**
     * gets the tax percentage for a given category
     * @param taxcategory
     */
    public getTaxPercentage(taxcategory) {
        let taxpercentage = 0;

        this.taxcategories.some(record => {
            if (record.taxcategoryid == taxcategory) {
                taxpercentage = parseInt(record.taxpercentage, 10);
                return true;
            }
        });

        return taxpercentage;
    }


}
