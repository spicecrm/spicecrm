/**
 * @module ObjectFields
 */
import {Component, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * renders an address field with all elements
 */
@Component({
    selector: 'field-address',
    templateUrl: './src/objectfields/templates/fieldaddress.html'
})
export class fieldAddress extends fieldGeneric {

    /*
    * getter function for the address .. need to build localization for this one
    *  todo: need to build localization for this one
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
    private buildAddress() {
        let address = '';
        if (this.model.data[this.addresskey + 'address_street']) {
            address += this.model.data[this.addresskey + 'address_street'];
        }
        if (this.model.data[this.addresskey + 'address_postalcode']) {
            address += ', ' + this.model.data[this.addresskey + 'address_postalcode'] + ' ' + this.model.data[this.addresskey + 'address_city'];
        }
        if (this.model.data[this.addresskey + 'address_country']) {
            address += ', ' + this.model.data[this.addresskey + 'address_country'];
        }
        return address;
    }

    /**
     * this is called with the event when the autocomplete function returns a selected address from googler search
     *
     * @param address is handed over from the Event Emitter from the autocomplete component
     */
    private addressSelected(address) {
        this.street = address.street;
        this.city = address.city;
        this.postalcode = address.postalcode;
        this.state = address.state;
        this.country = address.country;
        this.latitude = address.latitude;
        this.longitude = address.longitude;
    }

    /**
     * getter for the field label if the form is rendered as subform
     */
    private getAddressLabel() {
        return this.language.getModuleLabel(this.model.module, this.fieldconfig.label);
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
