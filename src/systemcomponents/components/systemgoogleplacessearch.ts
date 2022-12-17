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
    templateUrl: "../templates/systemgoogleplacessearch.html",
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
    @Output() public details: EventEmitter<any> = new EventEmitter<any>();

    /**
     * for the ValueAccessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * set to enabled: set in the construcutor if an api key is present
     */
    public isenabled: boolean = false;

    /**
     * the serachterm completed
     */
    public autocompletesearchterm: string = '';

    /**
     * a timeoput for the field toi wait until the user did finish typing
     */
    public autocompleteTimeout: any = undefined;

    /**
     * the sresults array from the search
     */
    public autocompleteResults: any[] = [];

    /**
     * a listener for the dropdown with the results. enables to close the dropdown when clicked outside
     */
    public autocompleteClickListener: any = undefined;

    /**
     * boolean helper to display the dropwodn
     */
    public displayAutocompleteResults: boolean = false;

    /**
     * indicates that a serach is running
     */
    public isSearching: boolean = false;

    /**
     * the bias to search by
     */
    public locationbias: string = 'ipbias ';

    constructor(public language: language, public backend: backend, public configuration: configurationService, public elementref: ElementRef, public renderer: Renderer2) {
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
            if (!this.inputfield.element.nativeElement.tabIndex) {
                this.renderer.setAttribute(this.inputfield.element.nativeElement, 'tabIndex', '-1');
            }
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
     * public function called with the blur event of teh inout field
     */
    public updateModel() {
        this.onChange(this.autocompletesearchterm);
    }

    /**
     * opens the search results again if theer are any and the fields gets the focus again
     */
    public onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults();
        }
    }

    /**
     * opens the search results
     */
    public openSearchResults() {
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
    public closeSearchResutls() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
        this.displayAutocompleteResults = false;
        this.autocompleteResults = [];
    }

    /**
     * starts the serach when the length is longer than 3 digits
     */
    public doAutocomplete() {
        if (this.autocompletesearchterm.length > 3) {
            this.isSearching = true;
            const searchTerm = encodeURIComponent(this.autocompletesearchterm);
            const locationBias = encodeURIComponent(this.locationbias);

            this.backend.getRequest(`channels/groupware/gsuite/places/search/${searchTerm}/${locationBias}`).subscribe(
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
    public getDetails(placedetails) {
        this.displayAutocompleteResults = false;
        this.autocompleteResults = []

        // set the value and emit to the model
        this.autocompletesearchterm = placedetails.name;
        let formattedAddress = placedetails.formatted_address;
        this.onChange(placedetails.name);

        this.isSearching = true;

        this.backend.getRequest('channels/groupware/gsuite/places/' + placedetails.place_id).subscribe((res: any) => {
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
