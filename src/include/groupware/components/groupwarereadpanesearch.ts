import {Component} from '@angular/core';
import {GroupwareService} from "../services/groupware.service";

/**
 * Outlook add-in pane used to display the bean search results from SpiceCRM.
 */
@Component({
    selector: 'groupware-read-pane-search',
    templateUrl: './src/include/groupware/templates/groupwarereadpanesearch.html'
})
export class GroupwareReadPaneSearch {
    private searchTerm: string = "";
    private beans: any[] = [];
    private searchResults: any[] = [];

    private searching: boolean = false;

    private searchTimeOut: any = undefined;

    constructor(
        private groupware: GroupwareService,
    ) {}

    /**
     * Handles the search input field.
     *
     * @param _e
     */
    private search(_e) {
        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                if (this.searchTerm.length) {
                    // if we wait for completion kill the timeout
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.searchSpice();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.searchSpice(), 1000);
                break;
        }
    }

    /**
     * Triggers the bean search in SpiceCRM.
     */
    private searchSpice() {
        this.searching = true;
        this.searchResults = [];

        this.groupware.searchSpice(this.searchTerm).subscribe(
            (res: any) => {
                this.searchResults = res;
                this.searching = false;
            },
            (err) => {
                this.searching = false;
            }
        );
    }
}
