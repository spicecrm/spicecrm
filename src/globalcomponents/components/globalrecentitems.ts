import {AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router} from '@angular/router';
import {recent} from '../../services/recent.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-recent-items',
    templateUrl: './src/globalcomponents/templates/globalrecentitems.html'
})
export class GlobalRecentItems {
    constructor(private language: language, navigation: navigation, private router: Router, private recent: recent) {
        // set the navigation
        navigation.setActiveModule('recent', this.language.getLabel('LBL_RECENTLYVIEWED'));
    }

    private goRecent(module, id) {
        this.router.navigate(['/module/' + module + '/' + id]);
    }
}
