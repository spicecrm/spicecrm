/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fts } from '../../services/fts.service';
import { popup } from '../../services/popup.service';
import { language } from '../../services/language.service';
import { broadcast } from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search-results-items',
    templateUrl: './app/globalcomponents/templates/globalheadersearchresultsitems.html'
})
export class GlobalHeaderSearchResultsItems {
    @Input() searchTerm: string = '';

    constructor(private broadcast: broadcast, private fts: fts, private popup: popup, private router: Router, private language: language){

    }

    goSearch(){
        // set the searchterm .. the timeout might not have gotten it
        this.fts.searchTerm = this.searchTerm;

        this.broadcast.broadcastMessage('fts.search', this.searchTerm);

        // navigate tot he search view
        this.router.navigate(['/search']);
        this.popup.close();
    }
}