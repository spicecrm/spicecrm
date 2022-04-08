/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';

@Component({
    selector: 'global-header-search-results-items',
    templateUrl: '../templates/globalheadersearchresultsitems.html'
})
export class GlobalHeaderSearchResultsItems {
    @Input()public searchTerm: string = '';
    @Input()public searchModule: string = '';
    @Input()public searchResults: any[] = [];
    @Output()public selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public router: Router,public language: language,public fts: fts) {

    }

    get searchModuleName() {
        return this.language.getLabel('LBL_INSPICECRM');
    }

   public goSearch() {
        // navigate tot he search view
        if (this.searchTerm.length > 0) {
            this.selected.emit(true);
            this.router.navigate(['/search/' + encodeURIComponent(btoa(this.searchTerm))]);
        }
    }
}
