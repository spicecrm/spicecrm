/**
 * Created by christian on 08.11.2016.
 */
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

    searchScope: string = '*';

    constructor(navigation: navigation, private broadcast: broadcast, private elementref: ElementRef, router: Router, private fts: fts, private language: language) {
        // set the navigation
        navigation.setActiveModule('search', 'search: ' + fts.searchTerm);

        // start the general search
        this.fts.searchByModules(fts.searchTerm);

        // subscribe to the broadcast message
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    getContainerStyle(): any {
        let rect = this.elementref.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + rect.top + 'px)'
        }
    }

    private handleMessage(message):void {
        switch (message.messagetype) {
            case 'fts.search':
                this.doSearch(message.messagedata);
                break;
            case 'fts.setscope':
                this.setSearchScope(message.messagedata);
                break;
        }
    }

    doSearch(term):void {
        if (this.searchScope === '*')
            this.fts.searchByModules(term);
        else
            this.fts.searchByModules(term, [this.searchScope], 50);
    }

    getScopeClass(scope): string {
        if (scope === this.searchScope)
            return 'slds-is-active';
    }

    setSearchScope(scope): void {
        if (scope === this.searchScope)
            return;

        this.searchScope = scope;
        this.doSearch(this.fts.searchTerm);
    }

    infiniteScroll(): boolean {
        if (this.searchScope === '*')
            return false;
        else
            return true;
    }
}