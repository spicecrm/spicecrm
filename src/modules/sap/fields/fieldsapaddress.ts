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
 * @module ModuleSAPIDOCs
 */
import {Component, Injector} from '@angular/core';
import {Router} from "@angular/router";

import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";

import {fieldAddress} from "../../../objectfields/components/fieldaddress";
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: './src/modules/sap/templates/fieldsapaddress.html'
})
export class fieldSAPAddress extends fieldAddress {

    /**
     * holds the list of countries
     */
    private countries: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public configuration: configurationService,
        public backend: backend
    ) {
        super(model, view, language, metadata, router, configuration, backend);


    }

    /**
     * a getter for the street
     */
    get street_2() {
        return this.model.data[this.addresskey + 'address_street_2'];
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street_2(value) {
        this.model.setField(this.addresskey + 'address_street_2', value);
    }

    /**
     * a getter for the street
     */
    get street_3() {
        return this.model.data[this.addresskey + 'address_street_3'];
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street_3(value) {
        this.model.setField(this.addresskey + 'address_street_3', value);
    }

    /**
     * this is called with the event when the autocomplete function returns a selected address from googler search
     *
     * @param address is handed over from the Event Emitter from the autocomplete component
     */
    public addressSelected(address) {
        this.street = address.street_name;
        this.street_number = address.street_number;
        this.city = address.city;
        this.district = address.district;
        this.postalcode = address.postalcode;
        this.country = address.country;
        this.state = address.state;
        this.latitude = address.latitude;
        this.longitude = address.longitude;
    }

}

