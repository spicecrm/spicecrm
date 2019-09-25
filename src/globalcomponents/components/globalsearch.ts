/**
 * @module GlobalComponents
 */
import {ElementRef, Component, NgModule, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-search',
    templateUrl: './src/globalcomponents/templates/globalsearch.html',
    providers: [fts]
})
export class GlobalSearch implements OnDestroy {

    private searchScope: string = '*';
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private routeSubscription: any;

    constructor(navigation: navigation, private elementref: ElementRef, router: Router, private activatedRoute: ActivatedRoute, private fts: fts, private language: language) {
        this.routeSubscription = this.activatedRoute.params.subscribe(params => {
            if (params.searchterm) {
                // try to base 64 decode .. but can also be plain string
                try {
                    this.searchTerm = atob(decodeURIComponent(params.searchterm));
                } catch (e) {
                    this.searchTerm = params.searchterm;
                }

                this.doSearch();
                navigation.setActiveModule('search', 'search: ' + this.searchTerm);
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
            total += modres.data.total;
        }
        return total;
    }

    get totalmodules() {
        let total = 0;
        for (let modres of this.fts.moduleSearchresults) {
            if (modres.data.total > 0) total++;
        }
        return total;
    }

    private doSearch(): void {
        if (this.searchScope === '*') {
            this.fts.searchByModules({searchterm: this.searchTerm});
        } else {
            this.fts.searchByModules({searchterm: this.searchTerm, modules: [this.searchScope], size: 50});
        }
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