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
 * @module SystemComponents
 */
import {
    Component,
    Output,
    EventEmitter,
    ElementRef,
    Renderer2,
    forwardRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: "system-googleplaces-search",
    templateUrl: "./src/systemcomponents/templates/systemgoogleplacessearch.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemGooglePlacesSearch),
            multi: true
        }
    ],
    host: {
        focus: 'focus()'
    }
})
export class SystemGooglePlacesSearch implements ControlValueAccessor {

    /**
     * the inputfield itself, reguired for the focus
     */
    @ViewChild('inputfield', {read: ViewContainerRef, static: true}) public inputfield: ViewContainerRef;

    /**
     * the event emitter that senbds out the address details
     */
    @Output() private details: EventEmitter<any> = new EventEmitter<any>();

    /**
     * for the ValueAccessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * set to enabled: set in the construcutor if an api key is present
     */
    private isenabled: boolean = false;

    /**
     * the serachterm completed
     */
    private autocompletesearchterm: string = '';

    /**
     * a timeoput for the field toi wait until the user did finish typing
     */
    private autocompleteTimeout: any = undefined;

    /**
     * the sresults array from the search
     */
    private autocompleteResults: any[] = [];

    /**
     * a listener for the dropdown with the results. enables to close the dropdown when clicked outside
     */
    private autocompleteClickListener: any = undefined;

    /**
     * boolean helper to display the dropwodn
     */
    private displayAutocompleteResults: boolean = false;

    /**
     * indicates that a serach is running
     */
    private isSearching: boolean = false;

    /**
     * the bias to search by
     */
    private locationbias: string = 'ipbias ';

    constructor(private language: language, private backend: backend, private configuration: configurationService, private elementref: ElementRef, private renderer: Renderer2) {
        let googleAPIConfig = this.configuration.getCapabilityConfig('google_api');
        if (googleAPIConfig.key && googleAPIConfig.key != '') {
            this.isenabled = true;
        }

        // try to get the location for the search
        navigator.geolocation.getCurrentPosition(
            position => {
                this.locationbias = `point:${position.coords.latitude},${position.coords.longitude}`;
            });

        // override the native focus functionality if focus is called proigramatically in a view
        this.elementref.nativeElement.focus = () => {
            this.focus();
        };
    }

    /**
     * set the focus
     */
    public focus() {
        setTimeout(() => {
            if (!this.inputfield.element.nativeElement.tabIndex) this.inputfield.element.nativeElement.tabIndex = '-1';
            this.inputfield.element.nativeElement.focus();
        });
    }

    /**
     * simple ghetter for the sarchterm
     */
    get searchterm() {
        return this.autocompletesearchterm;
    }

    /**
     * a setter for the sarchterm bound by the model. Sets the timeout function to trigger the google places search
     *
     * @param value
     */
    set searchterm(value) {
        this.autocompletesearchterm = value;
        // this.onChange(value);

        if (this.isenabled) {
            // set the timeout for the search
            if (this.autocompleteTimeout) {
                window.clearTimeout(this.autocompleteTimeout);
            }
            this.autocompleteTimeout = window.setTimeout(() => this.doAutocomplete(), 500);
        }
    }

    /**
     * displays a placeholder if the field is enabled
     */
    get placeholder() {
        if (this.isenabled) {
            return this.language.getLabel('LBL_SEARCH');
        } else {
            return '';
        }
    }

    /**
     * private function called with the blur event of teh inout field
     */
    private updateModel() {
        this.onChange(this.autocompletesearchterm);
    }

    /**
     * opens the search results again if theer are any and the fields gets the focus again
     */
    private onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults();
        }
    }

    /**
     * opens the search results
     */
    private openSearchResults() {
        this.displayAutocompleteResults = true;
        this.autocompleteClickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    /**
     * the click handler registered when the search results are opened
     * @param event
     */
    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementref.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchResutls();
        }
    }

    /**
     * clsoes the search results dialog and destruicts the click listener
     */
    private closeSearchResutls() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
        this.displayAutocompleteResults = false;
        this.autocompleteResults = [];
    }

    /**
     * starts the serach when the length is longer than 3 digits
     */
    private doAutocomplete() {
        if (this.autocompletesearchterm.length > 3) {
            this.isSearching = true;
            const searchTerm = encodeURIComponent(btoa(this.autocompletesearchterm));
            const locationBias = encodeURIComponent(btoa(this.locationbias));

            this.backend.getRequest(`googleapi/places/search/${searchTerm}/${locationBias}`).subscribe(
                (res: any) => {
                    if (res.candidates && res.candidates.length > 0) {
                        this.autocompleteResults = res.candidates;
                        this.openSearchResults();
                        this.isSearching = false;
                    } else {
                        this.autocompleteResults = [];
                        this.closeSearchResutls();
                        this.isSearching = false;
                    }
                },
                error => {
                    this.isSearching = false;
                });
        }
    }

    /**
     * takes the clicked place and gets all the details
     *
     * @param placedetails
     */
    private getDetails(placedetails) {
        this.displayAutocompleteResults = false;
        this.autocompleteResults = []

        // set the value and emit to the model
        this.autocompletesearchterm = placedetails.name;
        let formattedAddress = placedetails.formatted_address;
        this.onChange(placedetails.name);

        this.isSearching = true;

        this.backend.getRequest('googleapi/places/' + placedetails.place_id).subscribe((res: any) => {
                this.details.emit({
                    address: {
                        street: res.address.street,
                        street_name: res.address.street_name,
                        street_number: res.address.street_number,
                        city: res.address.city,
                        district: res.address.district,
                        postalcode: res.address.postalcode,
                        state: res.address.state,
                        country: res.address.country,
                        latitude: parseFloat(res.address.location.lat),
                        longitude: parseFloat(res.address.location.lng)
                    },
                    formatted_phone_number: res.formatted_phone_number,
                    formatted_address: res.formatted_address,
                    international_phone_number: res.international_phone_number,
                    website: res.website,
                    name: res.name
                });
                this.isSearching = false;
            },
            error => {
                this.isSearching = false;
            });
    }

    /**
     * for the valueaccessor
     *
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.autocompletesearchterm = value ? value : '';
    }
}
