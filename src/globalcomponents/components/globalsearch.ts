/**
 * @module GlobalComponents
 */
import {ElementRef, Component, NgModule, ViewChild, ViewContainerRef, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';

declare var _: any;

@Component({
    selector: 'global-search',
    templateUrl: './src/globalcomponents/templates/globalsearch.html',
    providers: [fts]
})
export class GlobalSearch implements OnDestroy, OnInit {

    private searchScope: string = '*';
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private routeSubscription: any;

    constructor(private navigation: navigation, private navigationtab: navigationtab, private elementref: ElementRef, router: Router, private activatedRoute: ActivatedRoute, private fts: fts, private language: language) {

    }

    public ngOnInit(): void {
        this.routeSubscription = this.navigationtab.activeRoute$.subscribe(route => {
            const params = route.params;
            if (params.searchterm) {
                // try to base 64 decode .. but can also be plain string
                try {
                    this.searchTerm = atob(decodeURIComponent(params.searchterm));
                } catch (e) {
                    this.searchTerm = params.searchterm;
                }

                this.doSearch();
            } else {
                this.navigationtab.setTabInfo({displayname: 'global search', displayicon: 'search'});
            }
        });
    }

    public ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
    }

    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.fts.searchTerm = this.searchTerm;
                this.doSearch();
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    get totalcount() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            total += _.isNumber(modres.data.total) ? modres.data.total : modres.data.total.value;
        }
        return total;
    }

    get totalmodules() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            if ((_.isNumber(modres.data.total) ? modres.data.total : modres.data.total.value) > 0) total++;
        }
        return total;
    }

    /**
     * run the search
     */
    private doSearch(): void {
        if (this.searchScope === '*') {
            this.fts.searchByModules({searchterm: this.searchTerm}).subscribe(results => {
                let total = 0;
                for(let sres of this.fts.moduleSearchresults){
                    total += _.isNumber(sres.data.total) ? sres.data.total : sres.data.total.value;
                }
                this.setTabName(total);

            });
        } else {
            this.fts.searchByModules({searchterm: this.searchTerm, modules: [this.searchScope], size: 50}).subscribe(results => {
                let total = 0;
                for(let sres of this.fts.moduleSearchresults){
                    total += _.isNumber(sres.data.total) ? sres.data.total : sres.data.total.value;
                }
                this.setTabName(total);
            });
        }

        this.setTabName();
    }

    /**
     * sets the tabname
     */
    private setTabName(count?) {
        this.navigationtab.setTabInfo({displayname: 'search ' + this.searchTerm + (count ? ' (' + count + ')' : ''), displayicon: 'search'});
    }

    private getScopeClass(scope): string {
        if (scope === this.searchScope) {
            return 'slds-is-active';
        }
    }

    private setSearchScope(scope): void {
        if (scope === this.searchScope) return;

        this.searchScope = scope;
        this.doSearch();
    }

    private infiniteScroll(): boolean {
        if (this.searchScope === '*') {
            return false;
        } else {
            return true;
        }
    }
}
