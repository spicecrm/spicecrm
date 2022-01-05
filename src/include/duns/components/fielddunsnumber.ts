/**
 * @module ModuleDuns
 */
import {Component, ViewContainerRef} from "@angular/core";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {Router} from "@angular/router";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "field-duns-number",
    templateUrl: "../templates/fielddunsnumber.html"
})
export class FieldDunsNumber extends fieldGeneric {

    public componentconfig: any = {};
    public fieldName: string = 'name';
    public fieldStreet: string = 'billing_address_street';
    public fieldCity: string = 'billing_address_city';
    public fieldPostalCode: string = 'billing_address_postalcode';
    public fieldCountry: string = 'billing_address_country';
    public fieldHouseNumber: string = 'billing_address_hsnm';
    public neverOverwriteAddress: boolean = false;
    public guessHouseNumber: boolean = false;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public backend: backend,
                public modal: modal,
                public ViewContainerRef: ViewContainerRef
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.loadComponentConfig();
    }

    /*
    * @return void
    */
    public loadComponentConfig() {
        if (this.fieldconfig.never_overwrite_address) this.neverOverwriteAddress = true;
        if (this.fieldconfig.guess_house_number) this.guessHouseNumber = true;
        if (this.fieldconfig.field_name) this.fieldName =  this.fieldconfig.field_name;
        if (!this.fieldconfig.address_type || this.fieldconfig.address_type.length == 0) return;
        this.fieldStreet = this.fieldconfig.address_type + '_address_street';
        this.fieldCity = this.fieldconfig.address_type + '_address_city';
        this.fieldPostalCode = this.fieldconfig.address_type + '_address_postalcode';
        this.fieldCountry = this.fieldconfig.address_type + '_address_country';
        this.fieldHouseNumber = this.fieldconfig.address_type + '_address_hsnm';
    }

    /*
    * open a modal and pass a list of duns
    * @return void
    */
    public openDunsModal() {
        this.modal.openModal('DunsNumberModal', true, this.ViewContainerRef.injector)
            .subscribe(modalRef => {
                this.getResults(modalRef);
                modalRef.instance.response.subscribe(res => {
                    this.value = res.duns;
                    if (res != 'none') {
                        this.setAddressFields(res);
                    }
                });
            });
    }

    /*
    * write the field value and address values from duns modal response
    * @param modalRef
    * @return void
    */
    public getResults(modalRef) {
        let params = {
            name: this.model.getField('name'),
            street: (this.model.getField(this.fieldStreet) ? this.model.getField(this.fieldStreet) + (this.model.getField(this.fieldHouseNumber) ? ' ' + this.model.getField(this.fieldHouseNumber) : '') : ''),
            city: (this.model.getField(this.fieldCity) ? this.model.getField(this.fieldCity) : ''),
            postalcode: (this.model.getField(this.fieldPostalCode) ? this.model.getField(this.fieldPostalCode) : ''),
            country: (this.model.getField(this.fieldCountry) ? this.model.getField(this.fieldCountry) : '')
        };
        modalRef.instance.isLoading = true;
        this.backend.getRequest('common/SpiceDuns', params).subscribe(res => {
            if (res) {
                modalRef.instance.isLoading = false;
                if (res.length) {
                    modalRef.instance.results = res;
                }
            }
        });
    }

    /**
     * set field values in form.
     * consider overwriting current address in form with DUNS results
     * do not overwrite if user selected "nothing found"
     * check on street / house number split
     * @param res
     * @return void
     */
    public setAddressFields(res) {

        if (!this.model.getField(this.fieldName) || this.model.getField(this.fieldName).length == 0 || !this.neverOverwriteAddress) {
            if(res.name.length > 0) {
                this.model.setField(this.fieldName, res.name || '');
            }
        }

        if (!this.model.getField(this.fieldStreet) || this.model.getField(this.fieldStreet).length == 0 || !this.neverOverwriteAddress) {
            if(res.street.length > 0) {
                this.model.setField(this.fieldStreet, res.street || '');
            }
        }
        // overwrite street when guess house number is on
        if(this.guessHouseNumber) {
            if (!this.model.getField(this.fieldStreet) || this.model.getField(this.fieldStreet).length == 0 || !this.neverOverwriteAddress) {
                if(res.street_only.length > 0) {
                    this.model.setField(this.fieldStreet, res.street_only || '');
                }
            }
            if (!this.model.getField(this.fieldHouseNumber) || this.model.getField(this.fieldHouseNumber).length == 0 || !this.neverOverwriteAddress) {
                if(res.hsnm.length > 0) {
                    this.model.setField(this.fieldHouseNumber, res.hsnm || '');
                }
            }
        }

        if (!this.model.getField(this.fieldCity) || this.model.getField(this.fieldCity).length == 0 || !this.neverOverwriteAddress) {
            if(res.city.length > 0) {
                this.model.setField(this.fieldCity, res.city || '');
            }
        }
        if (!this.model.getField(this.fieldPostalCode) || this.model.getField(this.fieldPostalCode).length == 0 || !this.neverOverwriteAddress) {
            if(res.postalcode.length > 0) {
                this.model.setField(this.fieldPostalCode, res.postalcode || '');
            }
        }
        if (!this.model.getField(this.fieldCountry) || this.model.getField(this.fieldCountry).length == 0 || !this.neverOverwriteAddress) {
            if(res.country.length > 0) {
                this.model.setField(this.fieldCountry, res.country || '');
            }
        }
    }
}
