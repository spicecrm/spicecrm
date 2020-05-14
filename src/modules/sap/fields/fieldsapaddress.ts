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
        private configuration: configurationService
    ) {
        super(model, view, language, metadata, router);

        this.loadCountries();

    }

    private loadCountries() {
        let countries = this.configuration.getData('countries');
        this.countries = countries?.countries ? countries.countries : [];

        this.countries.sort((a, b) => this.language.getLabel(a.label) > this.language.getLabel(b.label) ? 1 : -1);
    }

    get states() {
        let ret = [];
        if (this.country) {
            let states = this.configuration.getData('countries');
            if (states.states) {
                ret = states.states.filter(s => s.cc == this.country);
                ret.sort((a, b) => this.language.getLabel(a.label) > this.language.getLabel(b.label) ? 1 : -1);
            }
        }

        return ret;
    }

    /**
     * a getter for the country
     */
    get country() {
        return this.model.data[this.addresskey + 'address_country'];
    }

    /**
     * a setter for the country
     *
     * @param value
     */
    set country(value) {
        this.model.setField(this.addresskey + 'address_country', value);
        this.state = '';
    }

    /**
     * a getter for the street
     */
    get street_number() {
        return this.model.data[this.addresskey + 'address_street_number'];
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street_number(value) {
        this.model.setField(this.addresskey + 'address_street_number', value);
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
        this.state = address.state;
        this.country = address.country;
        this.latitude = address.latitude;
        this.longitude = address.longitude;
    }

    /**
     * builds a formatted address form all elements and renders it on the screen
     */
    public buildAddress() {
        let address = '';
        let address_arr = [];
        if (this.model.data[this.addresskey + 'address_attn']) {
            address_arr.push(this.model.data[this.addresskey + 'address_attn']);
        }
        if (this.model.data[this.addresskey + 'address_street']) {
            address_arr.push(this.model.data[this.addresskey + 'address_street']);
        }
        if (this.model.data[this.addresskey + 'address_postalcode']) {
            address_arr.push(this.model.data[this.addresskey + 'address_postalcode'] + ' ' + this.model.data[this.addresskey + 'address_city']);
        }
        if (this.model.data[this.addresskey + 'address_state']) {
            let state = this.model.getField(this.addresskey + 'address_state');
            let stateItem = this.states.find(s => s.sc == state);
            address_arr.push(stateItem ? this.language.getLabel(stateItem.label) : state);
        }
        if (this.model.data[this.addresskey + 'address_country']) {
            let country = this.model.getField(this.addresskey + 'address_country');
            let countryItem = this.countries.find(c => c.cc == country);
            address_arr.push(countryItem ? this.language.getLabel(countryItem.label) : country);
        }
        address = address_arr.join(', ');
        return address;
    }

}

