/**
 * @module ModuleProcurementDocs
 */
import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {Observable, of, Subject, Subscription} from "rxjs";

/**
 * a helper service to handle the Procurement Doc
 */
@Injectable()
export class procurementdocrecord implements OnDestroy {

    /**
     * the procurementdoc so it is available in underlying components
     *
     * @private
     */
    public procurementdoc: any;

    /**
     * an emitter that triggers if the tax information has beenchanged and a new tax determination shoudl be triggered by the tax fields
     */
    public taxchange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the taxed party based onteh procurementdoc
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

    constructor(
        public configuration: configurationService,
        public backend: backend,
        public language: language,
        public modal: modal
    ) {
    }

    /**
     * unsubscribe from all subscriptions on destroy
     */
    public ngOnDestroy() {
        this.subscribptions.unsubscribe();
    }

    /**
     * sets the procurementdoc model
     *
     * @param model
     */
    set procurementDoc(model: model) {
        // set the procurementdoc model
        this.procurementdoc = model;

        // subscribe to model changes
        this.subscribptions.add(
            this.procurementdoc.data$.subscribe(() => {
                this.getTaxedParty();
            })
        );
    }

    /**
     * gets the procurementdocmodel
     */
    get procurementDoc() {
        return this.procurementdoc;
    }

    public getTaxCategory(producttaxcategory) {

        let taxdeterminations = this.configuration.getData('procurementdoctaxdetermination');

        // if we do not have tax determinations return empty
        if(!taxdeterminations) return '';

        // get the companycode
        let companycode = this.configuration.getData('companycodes').find(c => c.id == this.procurementdoc.getField('companycode_id'));

        // first full fledged
        let taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && d.customervatid == this.vatid && d.producttaxcategory == producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        // with empty vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && !d.customervatid && d.producttaxcategory == producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        // without product category
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && d.customervatid == this.vatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        // without product category and emtpy vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && d.customercountry.indexOf(this.taxedCountry()) >= 0 && !d.customervatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        // then without customercountry
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && !d.customercountry && d.customervatid == this.vatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        // then without customercountry and empty vatid
        taxDeterminationRecord = taxdeterminations.find(d => d.companycodecountry == companycode.country && !d.customercountry && !d.customervatid && !d.producttaxcategory);
        if (taxDeterminationRecord) {
            return taxDeterminationRecord.procurementdoctaxcategory;
        }

        return '';

    }

    /**
     * returns if the taxed party has a vatid
     */
    get vatid() {
        return !this.taxedParty.data?.vat_nr ? '0' : '1';
    }

    get procurementDocItemCount() {
        try {
            let count = 0;
            for (let id in this.procurementdoc.data.procurementdocitems.beans) {
                if (this.procurementdoc.data.procurementdocitems.beans.hasOwnProperty(id)) count++;
            }
            return count;
        } catch (e) {
            return 0;
        }
    }

    /**
     * gets the taxed country
     * - first fromt ehprocurementdoc
     * - then from the taxed party
     */
    public taxedCountry(data?) {
        // first try to use the shipping country fromt eh procurementdoc
        if (this.procurementdoc.getField('shipping_address_country')) {
            return this.procurementdoc.getField('shipping_address_country');
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
        if(!this.procurementdoc.isEditing) return of(true);

        // get vendor Account
        let rpModule = 'Accounts';
        let rpId = this.procurementdoc.getField('account_id');

        // try the vendor Contact
        if (!rpId) {
            rpModule = 'Contacts';
            rpId = this.procurementdoc.getField('contact_id');
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
                if (this.configuration.getData('procurementdoctaxdetermination') && this.procurementDocItemCount > 0 && (!this.taxedParty.data || !!this.taxedParty.data?.vat_nr != !!data?.vat_nr || this.taxedCountry() != this.taxedCountry(data))) {
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

}
