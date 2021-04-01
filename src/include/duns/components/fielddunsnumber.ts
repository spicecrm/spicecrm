/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/include/duns/templates/fielddunsnumber.html"
})
export class FieldDunsNumber extends fieldGeneric {

    public componentconfig: any = {};
    private fieldName: string = 'name';
    private fieldStreet: string = 'billing_address_street';
    private fieldCity: string = 'billing_address_city';
    private fieldPostalCode: string = 'billing_address_postalcode';
    private fieldCountry: string = 'billing_address_country';
    private fieldHouseNumber: string = 'billing_address_hsnm';
    private neverOverwriteAddress: boolean = false;
    private guessHouseNumber: boolean = false;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private backend: backend,
                private modal: modal,
                private ViewContainerRef: ViewContainerRef
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
    private loadComponentConfig() {
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
    private openDunsModal() {
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
    private getResults(modalRef) {
        let params = {
            name: this.model.data.name,
            street: (this.model.getField(this.fieldStreet) ? this.model.getField(this.fieldStreet) + (this.model.getField(this.fieldHouseNumber) ? ' ' + this.model.getField(this.fieldHouseNumber) : '') : ''),
            city: (this.model.getField(this.fieldCity) ? this.model.getField(this.fieldCity) : ''),
            postalcode: (this.model.getField(this.fieldPostalCode) ? this.model.getField(this.fieldPostalCode) : ''),
            country: (this.model.getField(this.fieldCountry) ? this.model.getField(this.fieldCountry) : '')
        };
        modalRef.instance.isLoading = true;
        this.backend.getRequest('SpiceDuns', params).subscribe(res => {
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
    private setAddressFields(res) {

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
