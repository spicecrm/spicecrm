/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";

import {fieldGeneric} from './fieldgeneric';

/**
 * renders an address field with all elements
 */
@Component({
    selector: 'field-address',
    templateUrl: './src/objectfields/templates/fieldaddress.html'
})
export class fieldAddress extends fieldGeneric {

    /**
     * set to true if the address inpout shoudl be strict according to the dropdown values
     */
    private strict: boolean = false;

    /**
     * a fallback address format in case none is specified
     */
    private addressFormat = '{street} {street_number}, {postalcode} {city}, {statename}, {countryname}';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public configuration: configurationService
    ) {
        super(model, view, language, metadata, router);

        // load the ui config and set the config properly
        let uiconfig = this.configuration.getCapabilityConfig('spiceui');
        if (uiconfig.addressmode == 'strict') this.strict = true;
        if (uiconfig.addressformat) this.addressFormat = uiconfig.addressformat;
    }

    /*
    * getter function for the address
     */
    get value() {
        return this.buildAddress();
    }

    /**
     * since multiple addresses can be rendered in the config of the field the key for the address is defined. This returns the key to be used in all other functions
     */
    get addresskey() {
        return this.fieldconfig.key ? this.fieldconfig.key + '_' : '';
    }

    /**
     * builds a formatted address form all elements and renders it on the screen
     */
    public buildAddress() {
        let formattedaddress = this.addressFormat;

        // check if we have a country format
        if (this.strict && this.country) {
            let countries = this.configuration.getData('countries');
            if(countries) {
                let countryrecod = countries.countries.find(c => c.cc == this.country);
                if (countryrecod && countryrecod.addressformat) formattedaddress = countryrecod.addressformat;
            }
        }

        // match the elements and format the country
        let addresselements = formattedaddress.match(/\{(.*?)\}/g);
        for (let addresselement of addresselements) {
            let translatedElement = this[addresselement.slice(1, -1)];
            formattedaddress = formattedaddress.replace(addresselement, translatedElement ? translatedElement : '');
        }
        return formattedaddress;
    }

    /**
     * returns the country name if the mode is set to strict
     */
    get countryname() {
        if (this.strict) {
            let country = this.country;
            if (country) {
                let countries = this.configuration.getData('countries');
                let countryrecod = countries.countries.find(c => c.cc == country);
                if (countryrecod) country = this.language.getLabel(countryrecod.label);
            }
            return country;
        } else {
            return this.country;
        }
    }

    /**
     * returns the country name if the mode is set to strict
     */
    get statename() {
        if (this.strict) {
            let country = this.country;
            let state = this.state;
            if (state) {
                let states = this.configuration.getData('countries');
                let staterecod = states.states.find(s => s.cc == country && s.sc == state);
                if (staterecod) state = this.language.getLabel(staterecod.label);
            }
            return state;
        } else {
            return this.state;
        }
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

    /**
     * getter for the field label if the form is rendered as subform
     */
    private getAddressLabel() {
        return this.language.getLabel(this.fieldconfig.label);
    }

    /**
     * a getter for the street
     */
    get street() {
        return this.model.data[this.addresskey + 'address_street'];
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street(value) {
        this.model.setField(this.addresskey + 'address_street', value);
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
     * a getter for the attn field
     */
    get attn() {
        return this.model.data[this.addresskey + 'address_attn'];
    }

    /**
     * a setter for the attn field
     * @param value
     */
    set attn(value) {
        this.model.setField(this.addresskey + 'address_attn', value);
    }

    /**
     * a getter for the city field
     */
    get city() {
        return this.model.data[this.addresskey + 'address_city'];
    }

    /**
     * a setter for the city field
     *
     * @param value
     */
    set city(value) {
        this.model.setField(this.addresskey + 'address_city', value);
    }

    /**
     * a setter for the city field
     *
     * @param value
     */
    set district(value) {
        this.model.setField(this.addresskey + 'address_district', value);
    }

    /**
     * a getter for the city field
     */
    get district() {
        return this.model.data[this.addresskey + 'address_district'];
    }

    /**
     * a getter for the postalcode
     */
    get postalcode() {
        return this.model.data[this.addresskey + 'address_postalcode'];
    }

    /**
     * a setter for the postalcode
     *
     * @param value
     */
    set postalcode(value) {
        this.model.setField(this.addresskey + 'address_postalcode', value);
    }

    /**
     * a getter for the state
     */
    get state() {
        return this.model.data[this.addresskey + 'address_state'];
    }

    /**
     * a setter for the state
     *
     * @param value
     */
    set state(value) {
        this.model.setField(this.addresskey + 'address_state', value);
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
    }

    /**
     * a getter for the latitude
     */
    get latitude() {
        return this.model.data[this.addresskey + 'address_latitude'];
    }

    /**
     * a setter for the latitude
     *
     * @param value
     */
    set latitude(value) {
        this.model.setField(this.addresskey + 'address_latitude', value);
    }

    /**
     * a getter for the longitude
     */
    get longitude() {
        return this.model.data[this.addresskey + 'address_longitude'];
    }

    /**
     * a setter for the longitude
     *
     * @param value
     */
    set longitude(value) {
        this.model.setField(this.addresskey + 'address_longitude', value);
    }
}
