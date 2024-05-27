/**
 * @module GlobalComponents
 */
import {
    Component,
    ElementRef, HostListener,
    Renderer2, ViewChild, ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {configurationService} from '../../services/configuration.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";

@Component({
    selector: 'global-header-search',
    templateUrl: '../templates/globalheadersearch.html',
    providers: [fts]
})
export class GlobalHeaderSearch {

    @ViewChild('searchfield', {read: ViewContainerRef, static: false}) public searchfield: ViewContainerRef;
    /**
     * indicates if the entered search terms would provoke any error
     * dues to the min engram restrictions and thus
     * would certainly not find any results
     */
    public searchTermErrors: {label: string, nestedValues: string[]}[];
    public showError: boolean = false;

    public isFocused = false;
    public showRecent: boolean = false;
    public searchTimeOut: any = undefined;
    public searchTerm: string = '';
    public searchTermUntrimmed: string = '';
    public clickListener: any;
    public _searchmodule: string = 'all';
    public searchresults: {hits: any[], total: number} = {hits: [], total: 0};

    /**
     * add a control-space listener to open the quick launcher
     * @param event
     */
    @HostListener('document:keydown.control.s')quickLaunch(event: KeyboardEvent) {
        this.searchfield.element.nativeElement.focus();
    }

    get searchmodule() {
        if(this._searchmodule == 'all'){
            return this.language.getLabel('LBL_ALL');
        }
        return this.language.getModuleName(this._searchmodule);
    }

    set searchmodule(module) {
        this._searchmodule = module;
        if (this.searchTerm && this.showRecent) {
            this.executeSearch();
        }
    }

    constructor(
        public router: Router,
        public broadcast: broadcast,
        public fts: fts,
        public configuration: configurationService,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public userPreferences: userpreferences,
        public language: language
    ) {
    }

    get minNGram() {
        return this.configuration.getCapabilityConfig('search').min_ngram ?? 3;
    }

    get showModuleSelector() {
        return window.innerWidth >= 768 && !this.userPreferences.toUse.globalHeaderCollapsed;
    }

    public onFocus() {
        this.showRecent = true;
        this.isFocused = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public closePopup() {
        this.clickListener();
        this.showRecent = false;
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
    }

    public doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if (this.searchTerm.length && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.executeSearch();
        }
    }

    public executeSearch() {
        let searchmodules = [];
        if (this.showModuleSelector && this._searchmodule != 'all') searchmodules.push(this._searchmodule);

        this.searchresults = {
            hits: [],
            total: 0
        };
        this.fts.searchByModules({searchterm: this.searchTerm, modules: searchmodules, size: 10}).subscribe(rsults => {
            for (let moduleSearchresult of this.fts.moduleSearchresults) {
                this.searchresults.hits = this.searchresults.hits.concat(moduleSearchresult.data.hits);
                this.searchresults.total += moduleSearchresult.data.total.value;
            }
            this.searchresults.hits.sort((a, b) => {
                return a._score > b._score ? -1 : 1;
            });
            this.searchresults.hits = this.searchresults.hits.splice(0, 10);
        });

        // broadcast so if searc is open also the serach is updated
        // this.broadcast.broadcastMessage('fts.search', this.searchTerm);
    }

    public clearSearchTerm() {
        // cancel any ongoing search
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        // clear the serachterm
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
        this.fts.searchTerm = '';
    }

    public search(_e) {
        // make sure the popup is open
        this.showRecent = true;

        let errors: {label: string, nestedValues: string[]}[] | undefined;

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();

                errors = this.fts.checkForSearchTermErrors(this.searchTerm);

                if (!errors) {

                    this.searchTermErrors = undefined;

                    if (this.searchTerm.length) {
                        // if we wait for completion kill the timeout
                        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                        // close the dropdown
                        this.showRecent = false;

                        // navigate to the search view
                        if (this.searchTerm.length > 0) {
                            this.router.navigate(['/search/' + encodeURIComponent(btoa(this.searchTerm))]);
                        }
                    }

                } else {
                    this.searchTermErrors = errors;
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                errors = this.fts.checkForSearchTermErrors(this.searchTermUntrimmed.trim());

                if (!errors) {
                    this.searchTermErrors = undefined;
                    this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                } else if (this.searchTermUntrimmed.trim() == '') {
                    this.searchTerm = '';
                    this.searchTermErrors = undefined;
                } else {
                    this.searchTimeOut = window.setTimeout(() => this.searchTermErrors = errors, 1000);
                }
                break;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopup();
        }
    }

    public selected(event) {
        this.showRecent = false;
        this.clearSearchTerm();
    }

    public onBlur() {
        window.setTimeout(() => this.isFocused = false, 200);
    }
}
