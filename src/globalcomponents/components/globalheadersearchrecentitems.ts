/**
 * @module GlobalComponents
 */
import {
    Component,
    Output,
    EventEmitter
} from '@angular/core';
import {Router} from '@angular/router';
import {recent} from '../../services/recent.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-header-search-recent-items',
    templateUrl: '../templates/globalheadersearchrecentitems.html',

})
export class GlobalHeaderSearchRecentItems {

    @Output()public selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public language: language,public recent: recent,public router: Router) {
    }

   public goRecent() {
        this.selected.emit(false);
        this.router.navigate(['/recent']);
    }
}
