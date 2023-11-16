/**
 * @module GlobalComponents
 */
import {Component, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {recent} from '../../services/recent.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-header-search-recent-items',
    templateUrl: '../templates/globalheadersearchrecentitems.html',
})
export class GlobalHeaderSearchRecentItems {

    /**
     * selected item
     */
    @Output()public selected: EventEmitter<any> = new EventEmitter<any>();

    /**
     *
     */
    public recentItems: any[] = [];

    /**
     * holds info whether recent items
     * are initialized
     */
    public isInitialized: boolean = false;

       constructor(
        public language: language,
        public recent: recent,
        public router: Router
    ) {
        this.getRecent();
    }

    /**
     * retrieves recent items from backend or cache
     */
    public getRecent() {
        this.recent.getRecentItems();
    }

    /**
     * navigates to recent bean
     */
    public goRecent() {
        this.selected.emit(false);
        this.router.navigate(['/recent']);
    }
}
