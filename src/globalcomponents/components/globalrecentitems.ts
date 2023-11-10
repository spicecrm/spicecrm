/**
 * @module GlobalComponents
 */
import { Component} from '@angular/core';
import {Router} from '@angular/router';
import {recent} from '../../services/recent.service';
import {navigationtab} from '../../services/navigationtab.service';
import {language} from '../../services/language.service';

/**
 * displays a cotainer with the recent items
 */
@Component({
    selector: 'global-recent-items',
    templateUrl: '../templates/globalrecentitems.html'
})
export class GlobalRecentItems {
    constructor(
        public language: language,
        public navigationtab: navigationtab,
        public router: Router,
        public recent: recent)
    {
        // set the navigationtab title
        navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_RECENTLYVIEWED'), displayicon: 'breadcrumbs'});

        this.getRecent();
    }

   public goRecent(module, id) {
        this.router.navigate(['/module/' + module + '/' + id]);
    }

    /**
     * retrieves recent items from backend or cache
     */
    public getRecent() {
        this.recent.getRecentItems();
    }

}
