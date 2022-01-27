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

@Component({
    selector: 'global-header-search',
    templateUrl: '../templates/globalheadersearch.html',
    providers: [fts]
})
export class GlobalHeaderSearch {

    @ViewChild('searchfield', {read: ViewContainerRef, static: false}) public serachfield: ViewContainerRef;

    public showRecent: boolean = false;
    public searchTimeOut: any = undefined;
    public searchTerm: string = '';
    public searchTermUntrimmed: string = '';
    public clickListener: any;
    public _searchmodule: string = 'all';
    public searchresults: any[] = [];

    /**
     * add a control-space listener to open the quick launcher
     * @param event
     */
    @HostListener('document:keydown.control.s')quickLaunch(event: KeyboardEvent) {
        this.serachfield.element.nativeElement.focus();
    }

    get searchmodule() {
        return this._searchmodule;
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
        public renderer: Renderer2
    ) {
    }

    get showModuleSelector() {
        return window.innerWidth >= 768;
    }

    public onFocus() {
        this.showRecent = true;
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

        this.searchresults = [];
        this.fts.searchByModules({searchterm: this.searchTerm, modules: searchmodules, size: 10}).subscribe(rsults => {
            let hits = [];
            for (let moduleSearchresult of this.fts.moduleSearchresults) {
                hits = hits.concat(moduleSearchresult.data.hits);
            }
            hits.sort((a, b) => {
                return a._score > b._score ? -1 : 1;
            });
            this.searchresults = hits.splice(0, 10);
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

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if (this.searchTerm.length && this.searchTermsValid(this.searchTerm)) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                    // close the dropdown
                    this.showRecent = false;

                    // navigate to the search view
                    if (this.searchTerm.length > 0) {
                        this.router.navigate(['/search/' + encodeURIComponent(btoa(this.searchTerm))]);
                    }
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                if (this.searchTermsValid(this.searchTermUntrimmed.trim())) {
                    this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                } else if (this.searchTermUntrimmed.trim() == '') {
                    this.searchTerm = '';
                }
                break;
        }
    }


    /**
     * checks if we have the proper length of searchterms
     *
     * @param searchTerm
     * @private
     */
    public searchTermsValid(searchTerm) {
        let config = this.configuration.getCapabilityConfig('search');
        let minNgram = config.min_ngram ? parseInt(config.min_ngram, 10) : 3;
        let maxNgram = config.max_ngram ? parseInt(config.max_ngram, 10) : 20;
        let items = searchTerm.split(' ');
        return items.filter(i => i.length < minNgram || i.length > maxNgram).length == 0;
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
}
