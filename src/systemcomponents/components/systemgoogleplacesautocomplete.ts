/**
 * @module SystemComponents
 */
import {Component, Output, EventEmitter, ElementRef, Renderer2, Input, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: "system-googleplaces-autocomplete",
    templateUrl: "../templates/systemgoogleplacesautocomplete.html"
})
export class SystemGooglePlacesAutocomplete implements OnDestroy {
    @Output() public address: EventEmitter<any> = new EventEmitter<any>();
    @Input() public disabled: boolean = false;

    public isenabled: boolean = false;
    public autocompletesearchterm: string = '';
    public autocompleteTimeout: any = undefined;
    public autocompleteResults: any[] = [];
    public autocompleteClickListener: any = undefined;
    public displayAutocompleteResults: boolean = false;
    public isSearching: boolean = false;

    constructor(public language: language,
                public backend: backend,
                public configuration: configurationService,
                public elementref: ElementRef,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2) {
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

    public ngOnDestroy() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
    }

    public onSearchFocus() {
        if (this.autocompletesearchterm.length > 1 && this.autocompleteResults.length > 0) {
            this.openSearchResults();
        }
    }

    public openSearchResults() {
        this.displayAutocompleteResults = true;
        this.autocompleteClickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        this.cdRef.detectChanges();
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementref.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchResutls();
        }
    }

    public closeSearchResutls() {
        if (this.autocompleteClickListener) {
            this.autocompleteClickListener();
        }
        this.displayAutocompleteResults = false;
        this.cdRef.detectChanges();
    }

    public doAutocomplete() {
        if (this.autocompletesearchterm.length > 5) {
            this.isSearching = true;
            const term = encodeURIComponent(this.autocompletesearchterm);

            this.backend.getRequest('channels/groupware/gsuite/places/autocomplete/' + term).subscribe((res: any) => {
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
        } else {
            this.closeSearchResutls();
        }
    }

    public getAddressDetail(placeid) {
        this.displayAutocompleteResults = false;
        this.autocompletesearchterm = '';
        this.backend.getRequest('channels/groupware/gsuite/places/' + placeid).subscribe((res: any) => {
            let address = {
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
            };
            this.address.emit(address);
            this.autocompletesearchterm = res.formatted_address;
            this.cdRef.detectChanges();
        });
    }
}
