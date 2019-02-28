import {Component, Output, EventEmitter, ElementRef, Renderer2} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: "system-googleplaces-autocomplete",
    templateUrl: "./src/systemcomponents/templates/systemgoogleplacesautocomplete.html"
})
export class SystemGooglePlacesAutocomplete {
    @Output() private address: EventEmitter<any> = new EventEmitter<any>();

    private isenabled: boolean = false;
    private autocompletesearchterm: string = '';
    private autocompleteTimeout: any = undefined;
    private autocompleteResults: any[] = [];
    private autocompleteClickListener: any = undefined;
    private displayAutocompleteResults: boolean = false;
    private isSearching: boolean = false;

    constructor(private language: language, private backend: backend, private configuration: configurationService, private elementref: ElementRef, private renderer: Renderer2) {
        let googleAPIConfig = this.configuration.getCapabilityConfig('google_api');
        if (googleAPIConfig.key && googleAPIConfig.key != '') {
            this.isenabled = true;
        }
    }

    get searchterm() {
        return this.autocompletesearchterm;
    }

    set searchterm(value) {
        this.autocompletesearchterm = value;

        // set the timeout for the search
        if (this.autocompleteTimeout) {
            window.clearTimeout(this.autocompleteTimeout);
        }
        this.autocompleteTimeout = window.setTimeout(() => this.doAutocomplete(), 500);
    }

    private onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults()
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
    }

    private doAutocomplete() {
        if (this.autocompletesearchterm.length > 5) {
            this.isSearching = true;
            this.backend.getRequest('googleapi/places/autocomplete/' + this.autocompletesearchterm).subscribe((res: any) => {
                    if (res.predictions && res.predictions.length > 0) {
                        this.autocompleteResults = res.predictions;
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
                }
            );
        }
    }

    private getAddressDetail(placeid) {
        this.displayAutocompleteResults = false;
        this.autocompletesearchterm = '';
        this.backend.getRequest('googleapi/places/' + placeid).subscribe((res: any) => {
            let address = {
                street: res.address.street,
                city: res.address.city,
                postalcode: res.address.postalcode,
                state: res.address.state,
                country: res.address.country,
                latitude: parseFloat(res.address.location.lat),
                longitude: parseFloat(res.address.location.lng)
            };
            this.address.emit(address);
        });
    }
}
