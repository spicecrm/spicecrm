/**
 * @module ObjectFields
 */
import {Component, ComponentRef, Injector} from '@angular/core';
import {Router} from "@angular/router";

import {AddressRefMetadataI, model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {configurationService} from "../../services/configuration.service";

import {fieldGeneric} from './fieldgeneric';
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {ObjectSelectBeanListModal} from "../../objectcomponents/components/objectselectbeanlistmodal";
/** @ignore */
declare var _;
/**
 * renders an address field with all elements
 */
@Component({
    selector: 'field-address',
    templateUrl: '../templates/fieldaddress.html'
})
export class fieldAddress extends fieldGeneric {

    /**
     * holds the reference metadata
     */
    public referenceMetadata: AddressRefMetadataI;
    /**
     * set to true if the address inpout shoudl be strict according to the dropdown values
     */
    public strict: boolean = false;
    /**
     * holds the loading value
     */
    public isLoading: boolean = false;

    public config_address_format: any = {};

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public configuration: configurationService,
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public injector: Injector
    ) {
        super(model, view, language, metadata, router);

        // load the ui config and set the config properly
        let uiconfig = this.configuration.data.backendextensions.spiceui.config.format;
        if (uiconfig == 'strict') this.strict = true;
        if (uiconfig.addressformat) this.addressFormat = uiconfig.addressformat;
        this.getAddressConfig();
    }

    /**
     * a fallback address format in case none is specified
     */
    public addressFormat = '{street} {street_number}, {postalcode} {city}, {statename}, {countryname}';

    public ngOnInit() {
        super.ngOnInit();
        this.handleReferenceAddress();
    }

    /**
     * set the initial value of isReferenced
     */
    public ngAfterViewInit() {
        super.ngAfterViewInit();
        if(!this.referenceMetadata) return;
        this._isReferenced = this.model.getField(this.addresskey + 'address_reference_id');
    }

    /**
     * update isReferenced on reference id change
     * @private
     */
    private handleReferenceAddress() {

        const referenceMetadata = this.configuration.getData('spice_address_references');

        if (!Array.isArray(referenceMetadata)) return;

        const metadata = (referenceMetadata as AddressRefMetadataI[]).find(m =>
            m.child_module == this.model.module && m.child_address_key == this.fieldconfig.key
        );

        if (!metadata) return;

        this.referenceMetadata = metadata;

        this.subscriptions.add(
            this.model.observeFieldChanges(metadata.child_address_key + '_address_reference_id').subscribe(value => {
                this._isReferenced = !!value;
            })
        );
    }

    /**
     * if ture disable editing
     */
    private _isReferenced: boolean = false;
    /**
     * search related beans through the reference link
     * @param bool
     */
    set isReferenced(bool: boolean) {

        if (bool == this._isReferenced) return;

        this._isReferenced = bool;

        if (this.model.isNew) return;

        if (bool) {
            this.handleReferenceActivation();
        } else {
            this.model.setField(this.addresskey + 'address_reference_id', '');
        }
    }

    /**
     * @return boolean isReferenced
     */
    get isReferenced(): boolean {
        return this._isReferenced;
    }

    /**
     * get the reference entries list through the backend vardefs link and handle the response
     * @private
     */
    private handleReferenceActivation() {

        this.isLoading = true;
        const url = `module/${this.model.module}/${this.model.id}/related/${this.referenceMetadata.child_link_name}`;

        this.backend.getRequest(url).subscribe({
            next: res => {
                this.isLoading = false;
                this.handleReferenceResponse(_.toArray(res));
            },
            error: () => {
                this.isLoading = false;
                this._isReferenced = false;
                this.toast.sendToast('MSG_NO_RECORDS_FOUND', 'warning');
            }
        });
    }

    /**
     * handle the reference entries response and open choose modal or fill in the address fields if only one reference found
     * @param res
     * @private
     */
    private handleReferenceResponse(res: any[]) {

        if (res.length > 1) {
            this.modal.openModal('ObjectSelectBeanListModal', true, this.injector).subscribe((
                modalRef: ComponentRef<ObjectSelectBeanListModal>) => {
                modalRef.instance.listData = res;
                modalRef.instance.selectedIds$.subscribe({
                    next: ids => {
                        if (!ids) {
                            this._isReferenced = false;
                        } else {
                            this.model.copyReferencedAddress(this.referenceMetadata, res.find(e => e.id == ids[0]));
                        }
                    }
                });
            });
        } else if (res.length == 1) {
            this.model.copyReferencedAddress(this.referenceMetadata, res[0]);
        } else {
            this._isReferenced = false;
            this.toast.sendToast('MSG_NO_RECORDS_FOUND', 'warning');
        }
    }

    /*
    * get the hidden fields from the config table in db
     */
    public getAddressConfig() {
        this.config_address_format = JSON.parse(this.configuration.data?.backendextensions?.address_format?.config?.format ?? '{}');
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
            if (countries) {
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

        // replace any standalone commas as separators in an address
        return formattedaddress.replace(new RegExp(/^([\s,]*)|(,[\s,]*,)|$([\s,]*)/gm), '').trim();
    }

    /**
     * returns the country name if the mode is set to strict
     */
    get countryname() {
        if (this.strict) {
            let country = this.country;
            if (country) {
                let countries = this.configuration.getData('countries');
                if (countries) {
                    let countryrecod = countries.countries.find(c => c.cc == country);
                    if (countryrecod) country = this.language.getLabel(countryrecod.label);
                }
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
                if (states) {
                    let staterecod = states.states.find(s => s.cc == country && s.sc == state);
                    if (staterecod) state = this.language.getLabel(staterecod.label);
                }
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
        if(this.hidestreetnumber) {
            this.street = address.street; // street contains street_name and street_number
        } else {
            this.street = address.street_name;
            this.street_number = address.street_number;
        }
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
    public getAddressLabel() {
        return this.language.getLabel(this.fieldconfig.label);
    }

    /**
     * returns the proper fieldname as found in the model
     *
     * @param field
     */
    public fieldName(field) {
        return this.addresskey + 'address_' + field;
    }

    /**
     * a getter for the street
     */
    get street() {
        return this.model.getField(this.addresskey + 'address_street');
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
        return this.model.getField(this.addresskey + 'address_street_number');
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
    get street_number_suffix() {
        return this.model.getField(this.addresskey + 'address_street_number_suffix');
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street_number_suffix(value) {
        this.model.setField(this.addresskey + 'address_street_number_suffix', value);
    }


    /**
     * a getter for the attn field
     */
    get attn() {
        return this.model.getField(this.addresskey + 'address_attn');
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
        return this.model.getField(this.addresskey + 'address_city');
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
        return this.model.getField(this.addresskey + 'address_district');
    }

    /**
     * a getter for the postalcode
     */
    get postalcode() {
        return this.model.getField(this.addresskey + 'address_postalcode');
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
        return this.model.getField(this.addresskey + 'address_state');
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
        return this.model.getField(this.addresskey + 'address_country');
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
        return this.model.getField(this.addresskey + 'address_latitude');
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
        return this.model.getField(this.addresskey + 'address_longitude');
    }

    /**
     * a setter for the longitude
     *
     * @param value
     */
    set longitude(value) {
        this.model.setField(this.addresskey + 'address_longitude', value);
    }


    /**
     * a getter to hide the field
     */
    get hideattn() {
        if (this.fieldconfig.hideattn) return true;
        if (this.config_address_format?.hideattn) return true;
        return false;
    }

    /**
     * a getter to hide the field
     */
    get hidestate() {
        if (this.fieldconfig.hidestate) return true;
        if (this.config_address_format?.hidestate) return true;
        return false;
    }

    /**
     * a getter to hide the field
     */
    get hidestreetnumber() {
        if (this.fieldconfig.hidestreetnumber) return true;
        if (this.config_address_format?.hidestreetnumber) return true;
        return false;
    }

    /**
     * a getter to hide the field
     */
    get hidedistrict() {
        if (this.fieldconfig.hidedistrict) return true;
        if (this.config_address_format?.hidedistrict) return true;
        return false;
    }

    /**
     * a getter to hide the field
     */
    get hidenumbersuffix() {
        if (this.fieldconfig.hidenumbersuffix) return true;
        if (this.config_address_format?.hidenumbersuffix) return true;
        return false;
    }


}
