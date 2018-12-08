import {ElementRef, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'global-search',
    templateUrl: './src/globalcomponents/templates/globalsearch.html'
})
export class GlobalSearch {

    private searchScope: string = '*';
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private searchTermUntrimmed: string = '';

    constructor(navigation: navigation, private broadcast: broadcast, private elementref: ElementRef, router: Router, private fts: fts, private language: language) {
        // set the navigation
        navigation.setActiveModule('search', 'search: ' + fts.searchTerm);

        // set the searchterm
        this.searchTerm = fts.searchTerm;

        // start the general search
        this.fts.searchByModules(fts.searchTerm);

        // subscribe to the broadcast message
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    private handleMessage(message): void {
        switch (message.messagetype) {
            case 'fts.search':
                this.searchTerm = message.messagedata;
                this.doSearch();
                break;
            case 'fts.setscope':
                this.setSearchScope(message.messagedata);
                break;
        }
    }

    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                // set the searchterm .. the timeout might not have gotten it
                this.fts.searchTerm = this.searchTerm;
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
            this.fts.searchByModules(this.searchTerm);
        } else {
            this.fts.searchByModules(this.searchTerm, [this.searchScope], 50);
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