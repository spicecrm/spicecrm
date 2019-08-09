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
    @ViewChild('inputfield', {read: ViewContainerRef, static: true}) public inputfield: ViewContainerRef;
    @Output() private details: EventEmitter<any> = new EventEmitter<any>();

    private onChange: (value: string) => void;
    private onTouched: () => void;

    private isenabled: boolean = false;
    private autocompletesearchterm: string = '';
    private autocompleteTimeout: any = undefined;
    private autocompleteResults: any[] = [];
    private autocompleteClickListener: any = undefined;
    private displayAutocompleteResults: boolean = false;
    private isSearching: boolean = false;
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

    public focus() {
        setTimeout(() => {
            if (!this.inputfield.element.nativeElement.tabIndex) this.inputfield.element.nativeElement.tabIndex = '-1';
            this.inputfield.element.nativeElement.focus();
        });
    }

    get searchterm() {
        return this.autocompletesearchterm;
    }

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

    private onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults();
        }
    }

    private openSearchResults() {
        this.displayAutocompleteResults = true;
        this.autocompleteClickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementref.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchResutls();
        }
    }

    private closeSearchResutls() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
        this.displayAutocompleteResults = false;
        this.autocompleteResults = [];
    }

    private doAutocomplete() {
        if (this.autocompletesearchterm.length > 3) {
            this.isSearching = true;
            this.backend.getRequest('googleapi/places/search/' + btoa(this.autocompletesearchterm) + '/' + btoa(this.locationbias)).subscribe(
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

    private getDetails(placedetails) {
        this.displayAutocompleteResults = false;
        this.autocompleteResults = []

        // set the value and emit to the model
        this.autocompletesearchterm = placedetails.name;
        this.onChange(placedetails.name);

        this.isSearching = true;

        this.backend.getRequest('googleapi/places/' + placedetails.place_id).subscribe((res: any) => {
                this.details.emit({
                    address: {
                        street: res.address.street,
                        city: res.address.city,
                        postalcode: res.address.postalcode,
                        state: res.address.state,
                        country: res.address.country,
                        latitude: parseFloat(res.address.location.lat),
                        longitude: parseFloat(res.address.location.lng)
                    },
                    formatted_phone_number: res.formatted_phone_number,
                    international_phone_number: res.international_phone_number,
                    website: res.website,
                });
                this.isSearching = false;
            },
            error => {
                this.isSearching = false;
            });
    }

    // for the valueaccessor
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
