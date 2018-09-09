/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { recent } from '../../services/recent.service';
import { popup } from '../../services/popup.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'global-header-search-recent-items',
    templateUrl: './src/globalcomponents/templates/globalheadersearchrecentitems.html',

})
export class GlobalHeaderSearchRecentItems {

    constructor(private language: language, private recent: recent, private popup: popup, private router: Router){
    }

    goRecent(){
        this.router.navigate(['/recent']);
        this.popup.close();
    }
}