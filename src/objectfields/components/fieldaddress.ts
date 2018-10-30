import {Component, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

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

    get addresskey() {
        return this.fieldconfig.key ? this.fieldconfig.key + '_' : '';
    }

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

    /*
    * getter for the field label if the form is rendered as subform
     */
    private getAddressLabel() {
        return this.language.getModuleLabel(this.model.module, this.fieldconfig.label);
    }

    /*
    * the functions for the autocomplete
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

    /*
     * getter and setter functions
     */
    get street() {
        return this.model.data[this.addresskey + 'address_street'];
    }

    set street(value) {
        this.model.data[this.addresskey + 'address_street'] = value;
    }

    get attn() {
        return this.model.data[this.addresskey + 'address_attn'];
    }

    set attn(value) {
        this.model.data[this.addresskey + 'address_attn'] = value;
    }

    get city() {
        return this.model.data[this.addresskey + 'address_city'];
    }

    set city(value) {
        this.model.data[this.addresskey + 'address_city'] = value;
    }

    get postalcode() {
        return this.model.data[this.addresskey + 'address_postalcode'];
    }

    set postalcode(value) {
        this.model.data[this.addresskey + 'address_postalcode'] = value;
    }

    get state() {
        return this.model.data[this.addresskey + 'address_state'];
    }

    set state(value) {
        this.model.data[this.addresskey + 'address_state'] = value;
    }

    get country() {
        return this.model.data[this.addresskey + 'address_country'];
    }

    set country(value) {
        this.model.data[this.addresskey + 'address_country'] = value;
    }

    get latitude() {
        return this.model.data[this.addresskey + 'address_latitude'];
    }

    set latitude(value) {
        this.model.data[this.addresskey + 'address_latitude'] = value;
    }

    get longitude() {
        return this.model.data[this.addresskey + 'address_longitude'];
    }

    set longitude(value) {
        this.model.data[this.addresskey + 'address_longitude'] = value;
    }
}
