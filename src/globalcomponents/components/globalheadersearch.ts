import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    NgModule,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Renderer,
    EventEmitter,
    HostListener
} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {fts} from '../../services/fts.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search',
    templateUrl: './src/globalcomponents/templates/globalheadersearch.html',
    providers: [fts]
})
export class GlobalHeaderSearch {
    private showRecent: boolean = false;
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private searchTermUntrimmed: string = '';
    private clickListener: any;
    private _searchmodule: string = 'all';
    private searchresults: any[] = [];


    get searchmodule() {
        return this.language.getModuleName(this._searchmodule);
    }

    set searchmodule(module) {
        this._searchmodule = module;
        if (this.searchTerm && this.showRecent) {
            this.executeSearch();
        }
    }

    constructor(private router: Router, private broadcast: broadcast, private fts: fts, private elementRef: ElementRef, private renderer: Renderer, private language: language) {
    }

    private onFocus() {
        this.showRecent = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    private closePopup() {
        this.clickListener();
        this.showRecent = false;
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
    }

    private doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if (this.searchTerm.length && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.executeSearch();
        }
    }

    private executeSearch() {
        let searchmodules = [];
        if (this._searchmodule != 'all') searchmodules.push(this._searchmodule);

        this.searchresults = [];
        this.fts.searchByModules(this.searchTerm, searchmodules, 10).subscribe(rsults => {
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

    private clearSearchTerm() {
        // cancel any ongoing search
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        // clear the serachterm
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
        this.fts.searchTerm = '';
    }

    private search(_e) {
        // make sur ethe popup is open
        this.showRecent = true;

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if (this.searchTerm.length) {
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                    // set the searchterm .. the timeout might not have gotten it
                    this.fts.searchTerm = this.searchTerm;

                    // broadcast the searchterm
                    this.broadcast.broadcastMessage('fts.search', this.searchTerm);

                    // close the dropdown
                    this.showRecent = false;

                    // navigate tot he search view
                    this.router.navigate(['/search']);
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopup();
        }
    }

    private selected(event) {
        this.showRecent = false;
        this.clearSearchTerm();
    }
}
