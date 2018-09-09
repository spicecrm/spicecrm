import {Component, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-address',
    templateUrl: './src/objectfields/templates/fieldaddress.html'
})
export class fieldAddress extends fieldGeneric {

    @ViewChild('searchref', {read: ViewContainerRef}) searchref: ViewContainerRef;

    fieldguid: string = '';
    autocompletesearchterm: string = '';
    autocompleteTimeout: any = undefined;
    autocompleteResults: Array<any> = [];
    autocompleteClickListener: any = undefined;
    displayAutocompleteResults: boolean = false;


    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        private backend: backend,
        private renderer: Renderer,
        public router: Router
    ) {
        super(model, view, language, metadata, router);

        this.fieldguid = 'f' + model.generateGuid().replace('-', '');
    }

    /*
    * getter function for the address .. need to build localization for this one
    *  todo: need to build localization for this one
     */
    getValue() {
        return this.buildAddress();
    }

    get addresskey(){
        return this.fieldconfig.key ? this.fieldconfig.key + '_' : '';
    }

    buildAddress()
    {
        let address = '';
        if( this.model.data[this.addresskey + 'address_street'] )
            address += this.model.data[this.addresskey + 'address_street'];
        if( this.model.data[this.addresskey + 'address_postalcode'] )
            address += ', ' + this.model.data[this.addresskey + 'address_postalcode'] + ' ' + this.model.data[this.addresskey + 'address_city'];
        if( this.model.data[this.addresskey + 'address_country'])
            address += ', ' + this.model.data[this.addresskey + 'address_country'];
        return address;
    }
    /*
    * getter for the field label if the form is rendered as subform
     */
    getAddressLabel() {
        return this.language.getModuleLabel(this.model.module, this.fieldconfig.label);
    }

    /*
    * the functions for the autocomplete
     */
    get searchterm() {
        return this.autocompletesearchterm;
    }

    set searchterm(value) {
        this.autocompletesearchterm = value;

        // set the timeout for the search
        if (this.autocompleteTimeout) window.clearTimeout(this.autocompleteTimeout);
        this.autocompleteTimeout = window.setTimeout(() => this.doAutocomplete(), 500);
    }

    onSearchFocus(){
        if(this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0){
            this.openSearchResults()
        }
    }

    openSearchResults(){
        this.displayAutocompleteResults = true;
        this.autocompleteClickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.searchref.element.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchResutls()
        }
    }

    closeSearchResutls(){
        if(this.autocompleteClickListener) this.autocompleteClickListener();
        this.displayAutocompleteResults = false;
    }

    doAutocomplete() {
        if (this.autocompletesearchterm.length > 5) {
            this.backend.getRequest('googleapi/places/autocomplete/' + this.autocompletesearchterm).subscribe((res: any) => {
                if(res.predictions && res.predictions.length > 0) {
                    this.autocompleteResults = res.predictions;
                    this.openSearchResults()
                } else {
                    this.autocompleteResults = [];
                    this.closeSearchResutls();
                }
            })
        }
    }

    getAddressDetail(placeid) {
        this.displayAutocompleteResults = false;
        this.backend.getRequest('googleapi/places/' + placeid).subscribe((res: any) => {
            this.street = res.address.street;
            this.city = res.address.city;
            this.postalcode = res.address.postalcode;
            this.state = res.address.state;
            this.country = res.address.country;
            this.latitude = parseFloat(res.address.location.lat);
            this.longitude = parseFloat(res.address.location.lng);
        })
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