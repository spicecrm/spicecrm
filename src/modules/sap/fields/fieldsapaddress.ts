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
    templateUrl: '../templates/fieldsapaddress.html'
})
export class fieldSAPAddress extends fieldAddress {

    /**
     * holds the list of countries
     */
    public countries: any[] = [];

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
        return this.model.getField(this.addresskey + 'address_street_2');
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
        return this.model.getField(this.addresskey + 'address_street_3');
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

