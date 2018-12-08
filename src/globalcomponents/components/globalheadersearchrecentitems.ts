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
    templateUrl: './src/globalcomponents/templates/globalheadersearchrecentitems.html',

})
export class GlobalHeaderSearchRecentItems {

    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private recent: recent, private router: Router) {
    }

    private goRecent() {
        this.router.navigate(['/recent']);
    }
}
