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
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitems.html'
})
export class GlobalHeaderSearchResultsItems {
    @Input() private searchTerm: string = '';
    @Input() private searchModule: string = '';
    @Input() private searchResults: any[] = [];
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router, private language: language, private fts: fts) {

    }

    get searchModuleName() {
        return this.language.getLabel('LBL_INSPICECRM');
    }

    private goSearch() {
        // navigate tot he search view
        if (this.searchTerm.length > 0) {
            this.selected.emit(true);
            this.router.navigate(['/search/' + btoa(this.searchTerm)]);
        }
    }
}
