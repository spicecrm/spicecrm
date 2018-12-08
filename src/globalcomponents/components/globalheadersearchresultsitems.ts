import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fts} from '../../services/fts.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search-results-items',
    templateUrl: './src/globalcomponents/templates/globalheadersearchresultsitems.html'
})
export class GlobalHeaderSearchResultsItems {
    @Input() private searchTerm: string = '';
    @Input() private searchModule: string = '';
    @Input() private searchResults: any[] = [];
    @Output() private selected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private broadcast: broadcast, private fts: fts, private router: Router, private language: language) {

    }

    get searchModuleName() {
        return this.language.getLabel('LBL_INSPICECRM');
    }

    private goSearch() {
        // set the searchterm .. the timeout might not have gotten it
        this.fts.searchTerm = this.searchTerm;

        this.broadcast.broadcastMessage('fts.search', this.searchTerm);

        // navigate tot he search view
        this.router.navigate(['/search']);
    }
}
