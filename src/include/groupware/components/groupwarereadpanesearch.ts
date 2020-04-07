/**
 * @module ModuleGroupware
 */
import {Component} from '@angular/core';

import {backend} from "../../../services/backend.service";

/**
 * Search component. Returns a list of beans found using the search terms.
 */
@Component({
    selector: 'groupware-read-pane-search',
    templateUrl: './src/include/groupware/templates/groupwarereadpanesearch.html'
})
export class GroupwareReadPaneSearch {
    /**
     * Input string used for searching.
     */
    private searchTerm: string = "";
    private beans: any[] = [];
    /**
     * A list of found beans.
     */
    private searchResults: any[] = [];
    /**
     * A boolean used to indicate if a search is currently running.
     */
    private searching: boolean = false;

    private searchTimeOut: any = undefined;

    constructor(
        private backend: backend,
    ) {}

    /**
     * Handles the keyboard input into the search field.
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
     * Performs the search in SpiceCRM.
     */
    private searchSpice() {
        this.searching = true;
        this.searchResults = [];

        let searchParams = {
            aggregates: {},
            modules: "",
            owner: false,
            records: 10,
            searchterm: this.searchTerm,
            sort: {},
        };

        // this.backend.postRequest('module/Emails/groupware/search', {XDEBUG_SESSION_START: 'PHPSTORM'}, searchParams).subscribe(
        this.backend.postRequest('module/Emails/groupware/search', {XDEBUG_SESSION_START: 'PHPSTORM'}, searchParams).subscribe(
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
